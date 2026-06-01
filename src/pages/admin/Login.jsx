import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginService } from '../../services/authService'
import { Mail, Eye, EyeOff } from 'lucide-react'
import ShinyText from '../../components/ui/ShinyText'
import ImageTrail from '../../components/ui/ImageTrail'

import loginBg from '../../assets/images/gallery_architecture_1_1772961143405.png'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await loginService({ email, password })
            loginUser(response.data.user, response.data.token, response.data.refreshToken)
            navigate('/admin/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#E5E9EC] flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-[1000px] min-h-[600px] animate-fade-in-up">

                <div className="w-full md:w-1/2 relative bg-dark-900 min-h-[250px] md:min-h-auto flex-shrink-0">
                    <img
                        src={loginBg}
                        alt="Bangunan Arsitektur"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-[#396680]/60 to-[#2d5166]/90"></div>

                    <ImageTrail items={['/logo.png', '/logo.png', '/logo.png', '/logo.png', '/logo.png', '/logo.png', '/logo.png', '/logo.png']} variant={1} />

                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none z-10">
                        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full mb-4 md:mb-6 w-max">
                            <ShinyText
                                text="Bangunanmu.id"
                                speed={3}
                                className="text-[10px] sm:text-xs font-bold tracking-widest uppercase"
                            />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-4 leading-tight tracking-tight">
                            Selamat Datang <br /> Kembali<br className="hidden md:block" />
                        </h1>
                        <p className="hidden sm:block text-white/80 text-base lg:text-lg leading-relaxed max-w-sm">
                            Wujudkan proyek konstruksi impian Anda dengan Bangunanmu.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-extrabold text-dark-900 mb-2 tracking-tight">Login</h2>
                        <p className="text-dark-400 text-sm mb-10 font-medium">Silakan masuk ke akun Anda</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            <div>
                                <label className="block text-sm font-bold text-dark-800 mb-2">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full px-5 py-3.5 rounded-2xl bg-[#F8F9FA] border-2 border-[#396680] focus:outline-none focus:ring-2 focus:ring-[#396680] focus:border-[#396680] transition-all text-dark-900 placeholder-dark-400 font-medium pr-12"
                                        required
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-300 pointer-events-none">
                                        <Mail size={20} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark-800 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-5 py-3.5 rounded-2xl bg-[#F8F9FA] border-2 border-[#396680] focus:outline-none focus:ring-2 focus:ring-[#396680] focus:border-[#396680] transition-all text-dark-900 placeholder-dark-400 font-medium pr-12 tracking-widest"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-[#396680] focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#396680] hover:bg-[#2d5166] text-white font-bold rounded-full shadow-lg shadow-[#396680]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {loading ? 'Memproses...' : 'Masuk'}
                                </button>
                            </div>
                        </form>

                        {}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Login
