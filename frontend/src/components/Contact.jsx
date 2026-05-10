import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInView } from '@/hooks/useInView'
import { fetchCaptcha, submitContact } from '@/services/api'
import { useAudio } from '@/context/AudioContext'

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone required'),
  subject: z.string().min(2, 'Subject required'),
  budget: z.string().optional(),
  serviceType: z.string().min(1, 'Select a service type'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
  captchaAnswer: z.string().min(1, 'CAPTCHA required'),
  website: z.string().max(0).optional(),
})

export function Contact() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const { playClick } = useAudio()
  const [captcha, setCaptcha] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadCaptcha = async () => {
    try {
      const c = await fetchCaptcha()
      setCaptcha(c)
    } catch {
      setCaptcha(null)
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      budget: '',
      serviceType: 'fullstack',
      message: '',
      captchaAnswer: '',
      website: '',
    },
  })

  const onSubmit = async (values) => {
    if (values.website) return
    setLoading(true)
    setStatus(null)
    playClick()
    try {
      await submitContact({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        budget: values.budget,
        serviceType: values.serviceType,
        message: values.message,
        captchaToken: captcha?.token,
        captchaAnswer: values.captchaAnswer,
      })
      setStatus({ ok: true, text: 'Transmission received. Check your inbox for confirmation.' })
      form.reset({ ...form.getValues(), fullName: '', email: '', phone: '', subject: '', budget: '', message: '', captchaAnswer: '' })
      await loadCaptcha()
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Failed to send. Please try again.'
      setStatus({ ok: false, text: msg })
      await loadCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">Contact</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Secure <span className="gradient-text">uplink</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Encrypted-style workflow: validated input, server CAPTCHA, rate limits, and instant email routing to Rahul.
          </p>
        </motion.div>

        <motion.div
          className="glass grid gap-10 rounded-3xl border-glow p-8 lg:grid-cols-[1fr_1.1fr] lg:p-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <div className="space-y-6">
            <h3 className="font-display text-xl font-semibold text-white">Direct line</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              For freelancing engagements, internships, or product builds — send a structured brief. You will receive an automated
              acknowledgment and a personal follow-up.
            </p>
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-sm text-cyan-100/90">
              <p className="font-medium text-cyan-200">Response SLA</p>
              <p className="mt-2 text-slate-300">Typically within 24–48 hours for serious inquiries.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register('website')} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...form.register('fullName')} />
                {form.formState.errors.fullName && (
                  <p className="text-xs text-red-400">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register('email')} />
                {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register('phone')} />
                {form.formState.errors.phone && <p className="text-xs text-red-400">{form.formState.errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (optional)</Label>
                <Input id="budget" placeholder="e.g. $2k–$5k or INR range" {...form.register('budget')} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...form.register('subject')} />
                {form.formState.errors.subject && (
                  <p className="text-xs text-red-400">{form.formState.errors.subject.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service type</Label>
                <select
                  id="serviceType"
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                  {...form.register('serviceType')}
                >
                  <option value="fullstack">Full stack build</option>
                  <option value="frontend">Frontend / UI engineering</option>
                  <option value="backend">Backend / APIs</option>
                  <option value="ai">AI / ML integration</option>
                  <option value="consulting">Consulting</option>
                  <option value="internship">Internship opportunity</option>
                </select>
                {form.formState.errors.serviceType && (
                  <p className="text-xs text-red-400">{form.formState.errors.serviceType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={5}
                className="flex w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                {...form.register('message')}
              />
              {form.formState.errors.message && (
                <p className="text-xs text-red-400">{form.formState.errors.message.message}</p>
              )}
            </div>

            {captcha && (
              <div className="space-y-2 rounded-xl border border-violet-500/25 bg-violet-500/5 p-4">
                <Label htmlFor="captcha">CAPTCHA · {captcha.question}</Label>
                <Input id="captcha" placeholder="Your answer" {...form.register('captchaAnswer')} />
                {form.formState.errors.captchaAnswer && (
                  <p className="text-xs text-red-400">{form.formState.errors.captchaAnswer.message}</p>
                )}
                <button type="button" className="text-xs text-cyan-300 hover:underline" onClick={loadCaptcha}>
                  Refresh challenge
                </button>
              </div>
            )}

            {status && (
              <p className={`text-sm ${status.ok ? 'text-emerald-400' : 'text-red-400'}`}>{status.text}</p>
            )}

            <Button type="submit" disabled={loading || !captcha} className="w-full sm:w-auto">
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
              Send secure message
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
