import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AudioProvider } from '@/context/AudioContext'
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const AdminLogin = lazy(() => import('@/pages/AdminLogin').then(m => ({ default: m.AdminLogin })))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))

function AdminGuard({ children }) {
  const token = localStorage.getItem('portfolio_admin_token')
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AudioProvider>
    </ThemeProvider>
  )
}

