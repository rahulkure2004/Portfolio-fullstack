import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const AudioContextState = createContext(null)

const AMBIENT =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

export function AudioProvider({ children }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('portfolio_sound') === '1')
  const ctxRef = useRef(null)

  const playClick = useCallback(() => {
    if (!enabled) return
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!ctxRef.current) ctxRef.current = new Ctx()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') void ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.value = 0.04
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.stop(ctx.currentTime + 0.1)
    } catch {
      /* ignore */
    }
  }, [enabled])

  const toggleSound = useCallback(() => {
    setEnabled((e) => {
      const next = !e
      localStorage.setItem('portfolio_sound', next ? '1' : '0')
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ enabled, toggleSound, playClick, ambientSrc: AMBIENT }),
    [enabled, playClick, toggleSound],
  )

  return <AudioContextState.Provider value={value}>{children}</AudioContextState.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioContextState)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
