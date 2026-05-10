import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminLogin } from '@/services/api'

const schema = z.object({
  username: z.string().min(2),
  password: z.string().min(6),
})

export function AdminLogin() {
  const nav = useNavigate()
  const [err, setErr] = useState(null)
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { username: '', password: '' } })

  const onSubmit = async (v) => {
    setErr(null)
    try {
      const data = await adminLogin(v.username, v.password)
      localStorage.setItem('portfolio_admin_token', data.token)
      nav('/admin')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),transparent_50%)]" />
      <motion.div
        className="glass-strong relative w-full max-w-md rounded-3xl border-glow p-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold gradient-text">Admin Access</h1>
        <p className="mt-2 text-sm text-slate-400">JWT-secured control surface</p>
        <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="user">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input id="user" className="pl-10" {...form.register('username')} autoComplete="username" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input id="pass" type="password" className="pl-10" {...form.register('password')} autoComplete="current-password" />
            </div>
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <Button type="submit" className="w-full">
            Authenticate
          </Button>
        </form>
        <Link to="/" className="mt-6 block text-center text-sm text-cyan-400 hover:underline">
          ← Back to site
        </Link>
      </motion.div>
    </div>
  )
}
