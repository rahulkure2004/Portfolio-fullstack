import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function GalaxyParticles({ count = 2500 }) {
  const ref = useRef()
  const { mouse, viewport } = useThree()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const c1 = new THREE.Color('#38bdf8')
    const c2 = new THREE.Color('#a855f7')
    for (let i = 0; i < count; i++) {
      const r = 12 * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      const mix = Math.random()
      const cc = c1.clone().lerp(c2, mix)
      col[i * 3] = cc.r
      col[i * 3 + 1] = cc.g
      col[i * 3 + 2] = cc.b
    }
    return [pos, col]
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.02
    ref.current.rotation.x += delta * 0.008
    const mx = (mouse.x * viewport.width) / 40
    const my = (mouse.y * viewport.height) / 40
    ref.current.rotation.x += (my - ref.current.rotation.x) * 0.02 * delta * 10
    ref.current.rotation.y += (mx - ref.current.rotation.y) * 0.02 * delta * 10
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}
