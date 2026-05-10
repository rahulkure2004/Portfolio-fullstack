import { useMousePosition } from '@/hooks/useMousePosition'

export function CursorGlow() {
  const { x, y } = useMousePosition()
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[5] h-[min(480px,85vw)] w-[min(480px,85vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13] blur-3xl mix-blend-screen transition-[left,top] duration-500 ease-out"
      style={{
        left: x,
        top: y,
        background:
          'radial-gradient(circle, rgba(56,189,248,0.85) 0%, rgba(168,85,247,0.45) 42%, transparent 72%)',
      }}
    />
  )
}
