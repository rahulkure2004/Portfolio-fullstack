import gsap from 'gsap'

/** Staggered reveal for glass panels (Jarvis-style depth). */
export function staggerReveal(elements, options = {}) {
  if (!elements?.length) return
  gsap.fromTo(
    elements,
    { opacity: 0, y: options.y ?? 28, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: options.duration ?? 0.75,
      stagger: options.stagger ?? 0.1,
      ease: options.ease ?? 'power3.out',
    },
  )
}
