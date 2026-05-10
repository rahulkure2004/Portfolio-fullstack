import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { EDUCATION } from '@/utils/constants'

export function Education() {
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <section id="education" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/90">Education</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Academic <span className="gradient-text">trajectory</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {EDUCATION.map((e, i) => (
            <motion.div
              key={e.degree}
              className="glass flex flex-col gap-4 rounded-3xl border-glow p-8 sm:flex-row sm:items-center"
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-white">{e.degree}</h3>
                <p className="mt-1 text-cyan-200/80">{e.school}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{e.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
