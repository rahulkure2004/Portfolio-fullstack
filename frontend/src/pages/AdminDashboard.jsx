import { motion } from 'framer-motion'
import { BarChart3, Briefcase, FileUp, LogOut, MessageSquare, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  deleteInquiry,
  deleteProject,
  deleteSkill,
  fetchAdminInquiries,
  fetchAdminProjects,
  fetchAdminSkills,
  fetchAdminStats,
  saveProject,
  saveSkill,
  updateInquiryStatus,
  uploadResume,
  uploadProjectImage,
} from '@/services/api'

export function AdminDashboard() {
  const nav = useNavigate()
  const [stats, setStats] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [tab, setTab] = useState('overview')
  const [projectDraft, setProjectDraft] = useState({
    id: null,
    title: '',
    slug: '',
    summary: '',
    techStack: '',
    features: '',
    githubUrl: '',
    demoUrl: '',
    displayOrder: 0,
    imageUrl: '',
    imageName: '',
  })
  const [skillDraft, setSkillDraft] = useState({ id: null, name: '', category: 'Frontend', displayOrder: 0 })

  const load = async () => {
    try {
      const [s, iq, pr, sk] = await Promise.all([
        fetchAdminStats(),
        fetchAdminInquiries(),
        fetchAdminProjects(),
        fetchAdminSkills(),
      ])
      setStats(s)
      setInquiries(iq)
      setProjects(pr)
      setSkills(sk)
    } catch {
      localStorage.removeItem('portfolio_admin_token')
      nav('/admin/login')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token')
    nav('/admin/login')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadProjectImage(file);
      setProjectDraft((prev) => ({
        ...prev,
        imageUrl: imageUrl,
        imageName: file.name
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="font-display text-lg font-bold gradient-text">Mission Control</div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">View site</Link>
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        <aside className="hidden w-52 shrink-0 flex-col gap-2 lg:flex">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'skills', label: 'Skills', icon: Wrench },
            { id: 'resume', label: 'Resume', icon: FileUp },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                tab === item.id ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {['overview', 'inquiries', 'projects', 'skills', 'resume'].map((t) => (
              <Button key={t} size="sm" variant={tab === t ? 'default' : 'outline'} onClick={() => setTab(t)}>
                {t}
              </Button>
            ))}
          </div>

          {tab === 'overview' && stats && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Visitors', stats.totalVisitors],
                ['Inquiries', stats.totalInquiries],
                ['Projects', stats.totalProjects],
                ['Resume downloads', stats.resumeDownloads],
              ].map(([k, v]) => (
                <div key={k} className="glass rounded-2xl border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{k}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{v}</p>
                </div>
              ))}
            </motion.div>
          )}

          {tab === 'inquiries' && (
            <div className="space-y-4">
              {inquiries.map((q) => (
                <div key={q.id} className="glass rounded-2xl border border-white/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {q.fullName} · {q.email}
                      </p>
                      <p className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleString()}</p>
                    </div>
                    <select
                      className="rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-sm"
                      value={q.status}
                      onChange={async (e) => {
                        await updateInquiryStatus(q.id, e.target.value, q.adminNotes)
                        load()
                      }}
                    >
                      {['NEW', 'IN_PROGRESS', 'CLOSED', 'SPAM'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{q.subject}</p>
                  <p className="mt-2 text-sm text-slate-300">{q.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    {q.phone && <span>Phone: {q.phone}</span>}
                    {q.budget && <span>Budget: {q.budget}</span>}
                    {q.serviceType && <span>Service: {q.serviceType}</span>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await deleteInquiry(q.id)
                        load()
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {!inquiries.length && <p className="text-slate-500">No inquiries yet.</p>}
            </div>
          )}

          {tab === 'projects' && (
            <div className="space-y-6">
              <div className="glass rounded-2xl border border-white/10 p-6 space-y-3">
                <h3 className="font-display text-lg text-white">{projectDraft.id ? 'Edit project' : 'New project'}</h3>
                
                <div>
                  <Label>Project Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {projectDraft.imageUrl && (
                    <img
                      src={projectDraft.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl mt-4"
                    />
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Title</Label>
                    <Input value={projectDraft.title} onChange={(e) => setProjectDraft({ ...projectDraft, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input value={projectDraft.slug} onChange={(e) => setProjectDraft({ ...projectDraft, slug: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Summary</Label>
                  <Input value={projectDraft.summary} onChange={(e) => setProjectDraft({ ...projectDraft, summary: e.target.value })} />
                </div>
                <div>
                  <Label>Tech (comma)</Label>
                  <Input
                    value={projectDraft.techStack}
                    onChange={(e) => setProjectDraft({ ...projectDraft, techStack: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Features (pipe | separated)</Label>
                  <Input
                    value={projectDraft.features}
                    onChange={(e) => setProjectDraft({ ...projectDraft, features: e.target.value })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>GitHub URL</Label>
                    <Input
                      value={projectDraft.githubUrl}
                      onChange={(e) => setProjectDraft({ ...projectDraft, githubUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Demo URL</Label>
                    <Input value={projectDraft.demoUrl} onChange={(e) => setProjectDraft({ ...projectDraft, demoUrl: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      await saveProject(projectDraft)
                      setProjectDraft({
                        id: null,
                        title: '',
                        slug: '',
                        summary: '',
                        techStack: '',
                        features: '',
                        githubUrl: '',
                        demoUrl: '',
                        displayOrder: 0,
                        imageUrl: '',
                        imageName: '',
                      })
                      load()
                    }}
                  >
                    Save project
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setProjectDraft({
                        id: null,
                        title: '',
                        slug: '',
                        summary: '',
                        techStack: '',
                        features: '',
                        githubUrl: '',
                        demoUrl: '',
                        displayOrder: 0,
                        imageUrl: '',
                        imageName: '',
                      })
                    }
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 p-4">
                    <div>
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setProjectDraft({ ...p, imageUrl: p.imageUrl || '', imageName: p.imageName || '' })}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          await deleteProject(p.id)
                          load()
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'skills' && (
            <div className="space-y-6">
              <div className="glass rounded-2xl border border-white/10 p-6 space-y-3">
                <h3 className="font-display text-lg text-white">{skillDraft.id ? 'Edit skill' : 'New skill'}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <Input value={skillDraft.name} onChange={(e) => setSkillDraft({ ...skillDraft, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={skillDraft.category}
                      onChange={(e) => setSkillDraft({ ...skillDraft, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      await saveSkill(skillDraft)
                      setSkillDraft({ id: null, name: '', category: 'Frontend', displayOrder: 0 })
                      load()
                    }}
                  >
                    Save skill
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setSkillDraft({ id: null, name: '', category: 'Frontend', displayOrder: 0 })}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id} className="glass flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                    <span className="text-sm text-slate-200">
                      {s.name} <span className="text-slate-500">· {s.category}</span>
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSkillDraft(s)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          await deleteSkill(s.id)
                          load()
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'resume' && (
            <div className="glass max-w-lg rounded-2xl border border-white/10 p-6 space-y-4">
              <h3 className="font-display text-lg text-white">Upload resume PDF</h3>
              <Input
                type="file"
                accept="application/pdf"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  await uploadResume(f)
                  load()
                }}
              />
              <p className="text-xs text-slate-500">Active resume is served from secure storage path configured on the server.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
