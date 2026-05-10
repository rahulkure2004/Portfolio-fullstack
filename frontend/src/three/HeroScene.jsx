import { Float, MeshDistortMaterial, Sphere, TorusKnot } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { GalaxyParticles } from './GalaxyParticles'

function CoreOrb() {
  const mesh = useRef()
  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2
    mesh.current.rotation.y = state.clock.elapsedTime * 0.35
  })
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <Sphere ref={mesh} args={[1.1, 64, 64]} scale={1}>
        <MeshDistortMaterial
          color="#38bdf8"
          emissive="#1e3a5f"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.85}
          distort={0.35}
          speed={2}
        />
      </Sphere>
    </Float>
  )
}

function OrbitRing() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.15
  })
  return (
    <mesh ref={ref} rotation={[1.2, 0.4, 0]}>
      <torusGeometry args={[2.4, 0.02, 16, 100]} />
      <meshStandardMaterial color="#a855f7" emissive="#6b21a8" emissiveIntensity={0.8} metalness={1} roughness={0.2} />
    </mesh>
  )
}

function SecondaryKnot() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    ref.current.rotation.y += 0.01
  })
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
      <TorusKnot ref={ref} args={[0.45, 0.12, 128, 16]} position={[2.8, 0.6, -1.2]}>
        <meshStandardMaterial
          color="#22d3ee"
          metalness={0.9}
          roughness={0.15}
          emissive="#0e7490"
          emissiveIntensity={0.5}
        />
      </TorusKnot>
    </Float>
  )
}

export function HeroScene() {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <ambientLight intensity={0.25} />
      <pointLight position={[6, 6, 6]} intensity={80} color="#38bdf8" />
      <pointLight position={[-8, -4, -6]} intensity={40} color="#a855f7" />
      <spotLight position={[0, 10, 4]} angle={0.35} penumbra={1} intensity={120} color="#e0f2fe" castShadow />
      <GalaxyParticles count={2200} />
      <CoreOrb />
      <OrbitRing />
      <SecondaryKnot />
      <fog attach="fog" args={['#030712', 8, 28]} />
    </>
  )
}
