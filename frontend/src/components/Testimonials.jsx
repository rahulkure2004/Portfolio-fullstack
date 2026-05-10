import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { TESTIMONIALS_SEED } from '@/utils/constants'
import { fetchPublicTestimonials } from '@/services/api'

export function Testimonials() {
  const [ref, inView] = useInView({ threshold: 0.12 })
  const [items, setItems] = useState(TESTIMONIALS_SEED)
  const [i, setI] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchPublicTestimonials()
        if (!cancelled && Array.isArray(data) && data.length) {
          setItems(data.map((t) => ({ quote: t.quote, author: t.authorName, role: t.authorRole || '' })))
        }
      } catch {
        /* seed */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const list = items.length ? items : TESTIMONIALS_SEED

  useEffect(() => {
    if (!list.length) return
    const id = setInterval(() => setI((x) => (x + 1) % list.length), 5200)
    return () => clearInterval(id)
  }, [list.length])

  const t = list[i % list.length] || list[0]

  return (
    <section id="testimonials" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/90">Testimonials</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Trusted by <span className="gradient-text">builders</span>
          </h2>
        </motion.div>

        <motion.div
          className="glass relative overflow-hidden rounded-3xl border-glow p-10 sm:p-14"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <Quote className="absolute right-8 top-8 h-10 w-10 text-cyan-500/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45 }}
              className="relative z-10"
            >
              <p className="text-xl font-medium leading-relaxed text-slate-100 sm:text-2xl">“{t.quote}”</p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600" />
                <div>
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-sm text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
