import { motion } from 'framer-motion'
import { GitBranch, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { SITE } from '@/utils/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function GitHubSection() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const [repos, setRepos] = useState([])
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const u = SITE.githubUsername
    let cancelled = false
    ;(async () => {
      try {
        const [userRes, repoRes] = await Promise.all([
          fetch(`https://api.github.com/users/${u}`),
          fetch(`https://api.github.com/users/${u}/repos?per_page=6&sort=updated`),
        ])
        if (!userRes.ok || !repoRes.ok) throw new Error('GitHub API rate limit or user not found')
        const userJson = await userRes.json()
        const repoJson = await repoRes.json()
        if (!cancelled) {
          setUser(userJson)
          setRepos(Array.isArray(repoJson) ? repoJson : [])
        }
      } catch (e) {
        if (!cancelled) setErr(e.message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="github" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">GitHub</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Live <span className="gradient-text">activity</span>
            </h2>
            {user && (
              <p className="mt-2 text-slate-400">
                {user.public_repos} public repos · {user.followers} followers
              </p>
            )}
          </div>
          <Button variant="glass" asChild>
            <a href={`https://github.com/${SITE.githubUsername}`} target="_blank" rel="noreferrer">
              Open profile
            </a>
          </Button>
        </motion.div>

        {err && (
          <p className="mb-6 text-sm text-amber-400">
            GitHub preview unavailable ({err}). Set VITE_GITHUB_USERNAME or try again later.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <motion.a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="glass group block rounded-2xl border border-white/10 p-6 transition hover:border-cyan-500/35"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 * i }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-200">{r.name}</h3>
                <Badge variant="outline">{r.language || 'Code'}</Badge>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-400">{r.description || 'Engineering repository.'}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  {r.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitBranch className="h-3.5 w-3.5" />
                  {r.forks_count}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          <p className="mb-3 text-center text-xs text-slate-500">Contribution graph (GitHub)</p>
          <div className="flex justify-center">
            <img
              loading="lazy"
              src={`https://ghchart.rshah.org/409ba5/${SITE.githubUsername}`}
              alt={`GitHub contributions for ${SITE.githubUsername}`}
              className="max-w-full opacity-90"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
