import { FolderGit2, Link2, Mail } from 'lucide-react'
import { SITE } from '@/utils/constants'

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left sm:px-6">
        <div>
          <p className="font-display text-lg font-bold gradient-text">{SITE.name}</p>
          <p className="mt-1 text-sm text-slate-500">Computer Engineering · {SITE.location}</p>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a className="hover:text-cyan-300" href={`mailto:hello@rahulkure.dev`} aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
          <a
            className="hover:text-cyan-300"
            href={`https://github.com/${SITE.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FolderGit2 className="h-5 w-5" />
          </a>
          <a className="hover:text-cyan-300" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Link2 className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} {SITE.name}. Crafted as a premium product experience.</p>
      </div>
    </footer>
  )
}
