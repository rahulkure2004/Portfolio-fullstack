import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { SKILL_GROUPS } from '@/utils/constants'
import { fetchPublicSkills } from '@/services/api'

export function Skills() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const [groups, setGroups] = useState(SKILL_GROUPS)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchPublicSkills()
        if (!cancelled && Array.isArray(data) && data.length) {
          const byCat = {}
          for (const row of data) {
            const c = row.category || 'Other'
            if (!byCat[c]) byCat[c] = []
            byCat[c].push(row.name)
          }
          const mapped = Object.entries(byCat).map(([title, items]) => ({ title, items }))
          if (mapped.length) setGroups(mapped)
        }
      } catch {
        /* use seed */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="skills" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/90">Skills</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Future-ready <span className="gradient-text">toolchain</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g, gi) => (
            <motion.div
              key={g.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-xl transition hover:border-cyan-500/35 hover:shadow-[0_0_50px_-15px_rgba(56,189,248,0.45)]"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 * gi }}
              whileHover={{ y: -4 }}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <h3 className="font-display text-lg font-semibold text-white">{g.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-medium text-cyan-100/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
