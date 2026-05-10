import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAudio } from '@/context/AudioContext'

export function BackToTop() {
  const [show, setShow] = useState(false)
  const { playClick } = useAudio()

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-8 right-6 z-[55]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
        >
          <Button
            size="icon"
            variant="glass"
            className="rounded-full border-cyan-500/40"
            onClick={() => {
              playClick()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label="Back to top"
          >
            <ArrowUp />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
