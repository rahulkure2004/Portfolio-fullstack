import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export function ScrollProgress() {
  const p = useScrollProgress()
  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-slate-900/80">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 shadow-[0_0_20px_rgba(56,189,248,0.6)]"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  )
}
