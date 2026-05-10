import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { TIMELINE_INTERN } from '@/utils/constants'

export function Experience() {
  const [ref, inView] = useInView({ threshold: 0.12 })

  return (
    <section id="experience" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">Experience</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Internship <span className="gradient-text">timeline</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/40 to-transparent md:left-1/2 md:-ml-px" />
          <div className="space-y-12">
            {TIMELINE_INTERN.map((item, i) => (
              <motion.div
                key={item.company}
                className={`relative flex flex-col gap-4 md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * i }}
              >
                <div className="hidden flex-1 md:block" />
                <div className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/50 bg-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.45)] md:left-1/2 md:-ml-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                </div>
                <div className="flex-1 pl-10 md:pl-0">
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-violet-300">{item.period}</p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-white">{item.company}</h3>
                    <p className="text-sm text-cyan-200/90">{item.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
