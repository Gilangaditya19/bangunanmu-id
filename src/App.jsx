import { Routes, Route } from 'react-router-dom'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Beranda from './pages/public/Beranda'
import Tentang from './pages/public/Tentang'
import Layanan from './pages/public/Layanan'
import CekProgress from './pages/public/CekProgress'
import Kontak from './pages/public/Kontak'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'

// Admin Pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProjectManagement from './pages/admin/ProjectManagement'
import TestimonialManagement from './pages/admin/TestimonialManagement'

// Context
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/cek-progress" element={<CekProgress />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="testimonials" element={<TestimonialManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
