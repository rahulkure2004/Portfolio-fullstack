import { motion } from 'framer-motion'
import { FolderGit2, Link2, Menu, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import { useAudio } from '@/context/AudioContext'
import { SITE } from '@/utils/constants'
import { cn } from '@/lib/utils'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#github', label: 'GitHub' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { enabled, toggleSound, playClick } = useAudio()
  const [open, setOpen] = useState(false)

  const scrollTo = (href) => {
    playClick()
    setOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#030712]/75 backdrop-blur-xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => scrollTo('#hero')}
          className="font-display text-lg font-bold tracking-tight gradient-text"
        >
          {SITE.name.split(' ')[0]}
          <span className="text-slate-500">.</span>
          <span className="text-cyan-400">dev</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              type="button"
              onClick={() => scrollTo(l.href)}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-slate-300"
            onClick={() => {
              toggleSound()
              playClick()
            }}
            aria-label="Toggle sound"
          >
            {enabled ? <Volume2 /> : <VolumeX />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-slate-300"
            onClick={() => {
              toggleTheme()
              playClick()
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <a
            href={`https://github.com/${SITE.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg p-2 text-slate-300 hover:bg-white/5 sm:inline-flex"
            aria-label="GitHub"
          >
            <FolderGit2 className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg p-2 text-slate-300 hover:bg-white/5 sm:inline-flex"
            aria-label="LinkedIn"
          >
            <Link2 className="h-5 w-5" />
          </a>
          <Button size="sm" className="hidden md:inline-flex" onClick={() => scrollTo('#contact')}>
            Hire Me
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'border-t border-white/5 bg-[#030712]/95 md:hidden',
          open ? 'max-h-[420px] opacity-100' : 'max-h-0 overflow-hidden opacity-0',
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <button
              key={l.href}
              type="button"
              className="rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5"
              onClick={() => scrollTo(l.href)}
            >
              {l.label}
            </button>
          ))}
          <Button className="mt-2" onClick={() => scrollTo('#contact')}>
            Hire Me
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
