import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

import registerBg from '../../assets/images/gallery_interior_1_1772961158421.png'
import ShinyText from '../../components/ui/ShinyText'

const Register = () => {
    const [formData, setFormData] = useState({
        namaLengkap: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            
            await new Promise(resolve => setTimeout(resolve, 1500))

            navigate('/admin/login')
        } catch {
            setError('Gagal mendaftar. Silakan coba lagi nanti.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#E5E9EC] flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-[1000px] min-h-[600px]">

                <div className="w-full md:w-1/2 relative bg-dark-900 min-h-[250px] md:min-h-auto flex flex-col items-center justify-center text-center p-8 md:p-12 flex-shrink-0">
                    <img 
                        src={registerBg} 
                        alt="Interior Arsitektur" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-dark-900/20 to-dark-900/10 mix-blend-multiply"></div>
                    
                    <div className="relative z-10 max-w-sm mt-4 md:mt-10">
                        <div className="inline-flex px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4 md:mb-6 max-w-max items-center justify-center">
                            <ShinyText 
                                text="BANGUNANMU.ID" 
                                speed={3}
                                className="text-[10px] sm:text-xs font-bold tracking-widest uppercase"
                            />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-6 leading-tight tracking-tight drop-shadow-lg">
                            Mulai Perjalananmu
                        </h1>
                        <p className="hidden sm:block text-white/90 text-sm md:text-base lg:text-lg leading-relaxed font-medium drop-shadow-md">
                            Bangun impian bersama layanan konstruksi terbaik yang memprioritaskan transparansi.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-extrabold text-dark-900 mb-2 tracking-tight">Daftar Akun Baru</h2>
                        <p className="text-dark-400 text-sm mb-10 font-medium">Lengkapi detail di bawah untuk memulai.</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div>
                                <label className="block text-xs font-bold text-dark-700 mb-2 uppercase tracking-wide">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="namaLengkap"
                                    value={formData.namaLengkap}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full px-6 py-3.5 rounded-full border border-dark-200 focus:outline-none focus:ring-2 focus:ring-[#658797]/30 focus:border-[#658797] transition-all text-dark-900 placeholder-dark-300 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-dark-700 mb-2 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="nama@email.com"
                                    className="w-full px-6 py-3.5 rounded-full border border-dark-200 focus:outline-none focus:ring-2 focus:ring-[#658797]/30 focus:border-[#658797] transition-all text-dark-900 placeholder-dark-300 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-dark-700 mb-2 uppercase tracking-wide">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-3.5 rounded-full border border-dark-200 focus:outline-none focus:ring-2 focus:ring-[#658797]/30 focus:border-[#658797] transition-all text-dark-900 placeholder-dark-400 font-medium tracking-widest"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#658797] hover:bg-[#527181] text-white font-bold rounded-full shadow-md shadow-[#658797]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Memproses...' : (
                                        <>
                                            Daftar <FaArrowRight className="text-sm" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-dark-400 font-medium">
                                Sudah punya akun? <Link to="/admin/login" className="text-[#658797] font-bold hover:underline transition-all">Masuk di sini</Link>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Register
