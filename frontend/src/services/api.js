import axios from 'axios'

const rawBase = import.meta.env.VITE_API_URL || ''
export const API_BASE = rawBase.replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function fetchCaptcha() {
  const { data } = await api.get('/api/public/captcha')
  return data
}

export async function submitContact(payload) {
  const { data } = await api.post('/api/public/contact', payload)
  return data
}

export async function logVisit(meta = {}) {
  try {
    await api.post('/api/public/analytics/visit', meta)
  } catch {
    /* non-blocking */
  }
}

export async function logResumeDownload(meta = {}) {
  try {
    await api.post('/api/public/analytics/resume-download', meta)
  } catch {
    /* non-blocking */
  }
}

export async function adminLogin(username, password) {
  const { data } = await api.post('/api/auth/login', { username, password })
  return data
}

export async function fetchAdminStats() {
  const { data } = await api.get('/api/admin/dashboard/stats')
  return data
}

export async function fetchAdminInquiries() {
  const { data } = await api.get('/api/admin/inquiries')
  return data
}

export async function updateInquiryStatus(id, status, adminNotes) {
  const { data } = await api.patch(`/api/admin/inquiries/${id}`, { status, adminNotes })
  return data
}

export async function deleteInquiry(id) {
  await api.delete(`/api/admin/inquiries/${id}`)
}

export async function fetchAdminProjects() {
  const { data } = await api.get('/api/admin/projects')
  return data
}

export async function saveProject(project) {
  if (project.id) {
    const { data } = await api.put(`/api/admin/projects/${project.id}`, project)
    return data
  }
  const { data } = await api.post('/api/admin/projects', project)
  return data
}

export async function deleteProject(id) {
  await api.delete(`/api/admin/projects/${id}`)
}

export async function uploadProjectImage(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/api/admin/projects/upload-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchAdminSkills() {
  const { data } = await api.get('/api/admin/skills')
  return data
}

export async function saveSkill(skill) {
  if (skill.id) {
    const { data } = await api.put(`/api/admin/skills/${skill.id}`, skill)
    return data
  }
  const { data } = await api.post('/api/admin/skills', skill)
  return data
}

export async function deleteSkill(id) {
  await api.delete(`/api/admin/skills/${id}`)
}

export async function fetchPublicProjects() {
  const { data } = await api.get('/api/public/projects')
  return data
}

export async function fetchPublicSkills() {
  const { data } = await api.get('/api/public/skills')
  return data
}

export async function fetchPublicTestimonials() {
  const { data } = await api.get('/api/public/testimonials')
  return data
}

export async function getResumeInfo() {
  const { data } = await api.get('/api/public/resume')
  return data
}

export async function uploadResume(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/api/admin/resume/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export default api
