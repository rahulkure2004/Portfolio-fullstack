import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function AnimatedCounter({ value, suffix = '', duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const mv = useMotionValue(0)
  const display = useTransform(mv, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (!inView) return
    const c = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [inView, mv, value, duration])

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
    </span>
  )
}
