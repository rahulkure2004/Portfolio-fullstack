import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { CERTS } from '@/utils/constants'

export function Certificates() {
  const [ref, inView] = useInView({ threshold: 0.12 })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % CERTS.length), 4200)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="certifications" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">Certifications</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Proof of <span className="gradient-text">craft</span>
          </h2>
        </motion.div>

        <motion.div
          className="glass relative overflow-hidden rounded-3xl border-glow p-10"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-200">
              <Award />
            </div>
            <div className="min-h-[80px]">
              <motion.p
                key={index}
                className="text-lg leading-relaxed text-slate-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                {CERTS[index]}
              </motion.p>
              <div className="mt-6 flex gap-2">
                {CERTS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Certificate ${i + 1}`}
                    className={`h-1.5 flex-1 rounded-full transition ${i === index ? 'bg-cyan-400' : 'bg-slate-700'}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
