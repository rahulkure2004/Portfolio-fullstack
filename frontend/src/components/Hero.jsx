import { motion, useAnimation } from 'framer-motion'
import { Download, FolderKanban, Mail, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeroCanvas } from '@/three/HeroCanvas'
import { SITE } from '@/utils/constants'
import { useAudio } from '@/context/AudioContext'

export function Hero({ onResumeDownload }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const controls = useAnimation()
  const { playClick } = useAudio()

  useEffect(() => {
    controls.start({
      opacity: [0, 1],
      y: [24, 0],
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    })
  }, [controls])

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % SITE.roles.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const scrollTo = (id) => {
    playClick()
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleResume = async () => {
    playClick()
    onResumeDownload?.()
  }

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-24">
      <HeroCanvas className="opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/40 to-[#030712]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-24 pt-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        <motion.div className="flex-1 space-y-8" initial={{ opacity: 0 }} animate={controls}>
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/90"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            JARVIS // PORTFOLIO OS
          </motion.p>

          <div className="space-y-4">
            <motion.h1
              className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {SITE.name}
            </motion.h1>
            <motion.div
              className="h-10 font-display text-xl text-cyan-300 sm:text-2xl"
              key={roleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="gradient-text">{SITE.roles[roleIndex]}</span>
            </motion.div>
          </div>

          <motion.p
            className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Button onClick={() => scrollTo('#contact')} className="rounded-xl">
              Hire Me
            </Button>
            <Button variant="glass" className="rounded-xl" onClick={handleResume}>
              <Download />
              Download Resume
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => scrollTo('#projects')}>
              <FolderKanban />
              View Projects
            </Button>
            <Button variant="ghost" className="rounded-xl text-cyan-200" onClick={() => scrollTo('#contact')}>
              <Mail />
              Contact Me
            </Button>
            <Button variant="ghost" className="rounded-xl text-slate-300" onClick={() => scrollTo('#about')}>
              <UserRound />
              About Me
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-6 text-xs text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1">{SITE.location}</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1">Open to freelance & internships</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto flex w-full max-w-md flex-1 justify-center lg:mx-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-square w-full max-w-[340px]">
            <div className="absolute inset-0 rounded-[2rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-600/20 shadow-[0_0_80px_-20px_rgba(56,189,248,0.5)]" />
            <motion.div
              className="absolute inset-2 rounded-[1.75rem] border border-white/10 bg-slate-950/60 backdrop-blur-xl"
              animate={{ rotateY: [0, 4, -4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                <motion.div
                  className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(56,189,248,0.35)]"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-violet-600/40" />
                  <div className="relative flex h-full w-full items-center justify-center font-display text-4xl font-bold text-white">
                    RK
                  </div>
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-full border border-white/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
                <p className="text-center text-sm text-slate-400">Elite full stack engineering — shipped with precision.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
