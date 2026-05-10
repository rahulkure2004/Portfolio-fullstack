import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { ABOUT_BIO, STATS } from '@/utils/constants'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export function About() {
  const [ref, inView] = useInView({ threshold: 0.12 })
  const bioRef = useRef(null)
  const gsapRan = useRef(false)

  useEffect(() => {
    if (!inView || !bioRef.current || gsapRan.current) return
    gsapRan.current = true
    const cards = bioRef.current.querySelectorAll('[data-gsap]')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 36, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
      },
    )
  }, [inView])

  return (
    <section id="about" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/90">About</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Precision engineering. <span className="gradient-text">Human clarity.</span>
          </h2>
        </motion.div>

        <div ref={bioRef} className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            data-gsap
            className="glass relative overflow-hidden rounded-3xl border-glow p-8 sm:p-10"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="relative space-y-5 text-slate-300">
              {ABOUT_BIO.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  className="leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            data-gsap
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="relative mx-auto max-w-md perspective-[1200px]">
              <motion.div
                className="glass-strong relative aspect-[4/5] overflow-hidden rounded-3xl border-glow"
                whileHover={{ rotateY: 6, rotateX: -4 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-transparent to-violet-600/20" />
                <div className="flex h-full flex-col items-center justify-center gap-6 p-10">
                  <div className="relative h-40 w-40 rounded-2xl border border-cyan-400/35 bg-slate-950/80 shadow-[0_0_60px_rgba(56,189,248,0.25)]">
                    <div className="flex h-full items-center justify-center font-display text-5xl font-bold gradient-text">
                      RK
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </div>
                  <p className="text-center text-sm text-slate-400">3D frame · glass HUD · cinematic depth</p>
                </div>
              </motion.div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.key}
                  className="glass rounded-2xl border border-white/10 p-4 text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <div className="font-display text-2xl font-bold text-white">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
