import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, FolderGit2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useInView } from '@/hooks/useInView'
import { PROJECTS_SEED } from '@/utils/constants'
import { fetchPublicProjects } from '@/services/api'
import { useAudio } from '@/context/AudioContext'

function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 260, damping: 22 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 260, damping: 22 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

export function Projects() {
  const [ref, inView] = useInView({ threshold: 0.08 })
  const [projects, setProjects] = useState(PROJECTS_SEED)
  const { playClick } = useAudio()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchPublicProjects()
        if (!cancelled && Array.isArray(data) && data.length) {
          setProjects(
            data.map((p) => ({
              slug: p.slug || p.title?.toLowerCase().replace(/\s+/g, '-'),
              title: p.title,
              short: p.summary || p.description,
              tech: (p.techStack || '').split(',').map((s) => s.trim()).filter(Boolean),
              features: (p.features || '').split('|').map((s) => s.trim()).filter(Boolean),
              githubUrl: p.githubUrl || '#',
              liveUrl: p.demoUrl || '#',
              imageUrl: p.imageUrl,
              accent: 'from-cyan-500 to-violet-600',
            })),
          )
        }
      } catch {
        /* seed */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="projects" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">Projects</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Cinematic <span className="gradient-text">builds</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug || p.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.06 * i }}
            >
              <TiltCard className="h-full perspective-[1400px]">
                <div className="glass group relative h-full overflow-hidden rounded-3xl border-glow p-1">
                  <div className={`h-2 rounded-t-[1.35rem] bg-gradient-to-r ${p.accent || 'from-cyan-500 to-violet-600'}`} />
                  <div className="rounded-b-[1.35rem] bg-slate-950/70 p-6 sm:p-8">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="mb-5 aspect-video w-full object-cover rounded-2xl border border-white/10"
                      />
                    ) : (
                      <div className="mb-5 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
                        <div className="flex h-full items-center justify-center text-sm text-slate-500">
                          Live preview · add screenshots in admin
                        </div>
                      </div>
                    )}
                    <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.short}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(p.tech || []).map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        onClick={() => playClick()}
                      >
                        <a href={p.githubUrl} target="_blank" rel="noreferrer">
                          <FolderGit2 />
                          GitHub
                        </a>
                      </Button>
                      <Button size="sm" asChild onClick={() => playClick()}>
                        <a href={p.liveUrl} target="_blank" rel="noreferrer">
                          <ExternalLink />
                          Live demo
                        </a>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="glass" onClick={() => playClick()}>
                            Case study
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg border-white/10 bg-slate-950/95">
                          <DialogHeader>
                            <DialogTitle>{p.title}</DialogTitle>
                            <DialogDescription className="text-slate-400">{p.short}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3 text-sm text-slate-300">
                            <p className="font-medium text-cyan-300">Highlights</p>
                            <ul className="list-inside list-disc space-y-1 text-slate-400">
                              {(p.features || []).map((f) => (
                                <li key={f}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
