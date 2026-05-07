import { Routes, Route } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import Beranda from './pages/public/Beranda'
import Tentang from './pages/public/Tentang'
import Layanan from './pages/public/Layanan'
import CekProgress from './pages/public/CekProgress'
import Kontak from './pages/public/Kontak'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProjectManagement from './pages/admin/ProjectManagement'
import TestimonialManagement from './pages/admin/TestimonialManagement'
import Settings from './pages/admin/Settings'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/cek-progress" element={<CekProgress />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="testimonials" element={<TestimonialManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
