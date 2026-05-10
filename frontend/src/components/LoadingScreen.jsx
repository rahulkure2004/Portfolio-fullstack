import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.15),transparent_55%)]" />
          <motion.div
            className="relative h-20 w-20 rounded-2xl border border-cyan-500/40 shadow-[0_0_60px_rgba(56,189,248,0.35)]"
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
          />
          <motion.p
            className="mt-8 font-display text-sm tracking-[0.35em] text-cyan-200/90"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            INITIALIZING INTERFACE
          </motion.p>
          <motion.div
            className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
