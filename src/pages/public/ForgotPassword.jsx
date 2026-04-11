import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import ShinyText from '../../components/ui/ShinyText'

import bgImage from '../../assets/images/gallery_architecture_1_1772961143405.png'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess(true)
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi nanti.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#E5E9EC] flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-[1000px] min-h-[600px]">

                <div className="w-full md:w-1/2 relative bg-dark-900 flex flex-col text-left min-h-[250px] md:min-h-auto flex-shrink-0">
                    <img 
                        src={bgImage} 
                        alt="Arsitektur Modern" 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#173a4a]/90 via-[#225165]/80 to-[#2c657e]/50 mix-blend-multiply"></div>

                    <div className="relative z-10 flex-col h-full flex p-8 md:p-12">
                        
                        <div className="mt-auto mb-4 md:mb-10 max-w-sm">
                            <div className="inline-flex px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full mb-4 md:mb-6 w-max items-center justify-center">
                                <ShinyText 
                                    text="BANGUNANMU.ID" 
                                    speed={3}
                                    className="text-[10px] sm:text-xs font-bold tracking-widest uppercase"
                                />
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-6 leading-tight tracking-tight drop-shadow-lg">
                                Atur Ulang <br className="hidden md:block"/> Kata Sandi
                            </h1>
                            <p className="hidden sm:block text-white/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-sm mb-4 md:mb-12 drop-shadow-md font-medium">
                                Jangan khawatir, kami akan membantu Anda mendapatkan akses kembali ke proyek impian Anda.
                            </p>
                            
                        </div>
                    </div>

                </div>

                <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">
                        <h2 className="text-3xl font-extrabold text-dark-900 mb-2 tracking-tight">Lupa Kata Sandi?</h2>
                        <p className="text-dark-500 text-sm mb-10 font-medium">
                            Masukkan email yang terdaftar untuk menerima instruksi pemulihan.
                        </p>

                        {success ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-800 animate-fadeInUp">
                                <h3 className="font-bold text-lg mb-2">Email Terkirim!</h3>
                                <p className="text-sm">Silakan periksa kotak masuk email Anda untuk instruksi. Email selambatnya masuk dalam 5 menit.</p>
                                <Link to="/admin/login" className="mt-6 inline-flex items-center gap-2 text-[#658797] font-bold hover:text-[#527181] transition-colors">
                                    <FaArrowLeft className="text-sm" /> Kembali ke Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-dark-800 mb-2">Alamat Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nama@email.com"
                                            className="w-full px-6 py-3.5 rounded-full border border-dark-200 focus:outline-none focus:ring-4 focus:ring-[#658797]/20 focus:border-[#658797] transition-all text-dark-900 placeholder-dark-300 font-medium pr-12 shadow-sm"
                                            required
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none">
                                            <FaEnvelope className="text-lg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-[#658797] hover:bg-[#527181] text-white font-bold rounded-full shadow-lg shadow-[#658797]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Memproses...' : (
                                            <>
                                                Kirim Instruksi <FaArrowRight className="text-sm" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {!success && (
                            <div className="mt-8 text-center">
                                <Link to="/admin/login" className="inline-flex items-center gap-2 text-dark-500 font-bold hover:text-[#658797] transition-colors text-sm">
                                    <FaArrowLeft className="text-xs" /> Kembali ke Login
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
