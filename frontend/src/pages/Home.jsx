import { lazy, Suspense, useEffect } from 'react'
import { About } from '@/components/About'
import { BackToTop } from '@/components/BackToTop'
import { Certificates } from '@/components/Certificates'
import { Contact } from '@/components/Contact'
import { CursorGlow } from '@/components/CursorGlow'
import { Education } from '@/components/Education'
import { Experience } from '@/components/Experience'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Navbar } from '@/components/Navbar'
import { Projects } from '@/components/Projects'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Skills } from '@/components/Skills'
import { Testimonials } from '@/components/Testimonials'
import { getResumeInfo, logVisit } from '@/services/api'

const GitHubSection = lazy(() =>
  import('@/components/GitHubSection').then((m) => ({ default: m.GitHubSection })),
)

export function Home() {
  useEffect(() => {
    logVisit({ path: '/', referrer: document.referrer || '' })
  }, [])

  const handleResume = async () => {
    try {
      const info = await getResumeInfo()
      if (info?.downloadUrl) {
        window.open(info.downloadUrl, '_blank', 'noopener,noreferrer')
        return
      }
    } catch {
      /* fallback */
    }
    window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero onResumeDownload={handleResume} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certificates />
        <Testimonials />
        <Suspense fallback={<div className="py-24 text-center text-slate-500">Loading GitHub…</div>}>
          <GitHubSection />
        </Suspense>
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
