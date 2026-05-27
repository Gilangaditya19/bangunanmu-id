import { useState, useEffect } from 'react'
import { Compass, CheckCircle2, MessageSquare, Globe, Star, ArrowRight, ExternalLink, Loader2, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../services/dashboardService'
import { getAllTestimonials } from '../../services/testimonialService'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTestimonials: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashboardRes, testiRes] = await Promise.all([
                    getDashboardStats(),
                    getAllTestimonials()
                ])

                const dashboardData = dashboardRes.data || dashboardRes
                let testiCount = 0;
                if (testiRes.success && testiRes.data && Array.isArray(testiRes.data.data)) {
                    testiCount = testiRes.data.data.length
                } else if (Array.isArray(testiRes.data)) {
                    testiCount = testiRes.data.length
                }

                setStats({
                    totalProjects: dashboardData.totalProjects || 0,
                    activeProjects: dashboardData.activeProjects || 0,
                    completedProjects: dashboardData.completedProjects || 0,
                    totalTestimonials: testiCount,
                })
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <div className="pb-12">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
                
                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#396680]">
                        <Compass size={20} />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Total Proyek</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">
                            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.totalProjects}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#396680]">
                        <TrendingUp size={20} />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Proyek Aktif</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">
                            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.activeProjects}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Proyek Selesai</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">
                            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.completedProjects}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-[#f4ece3] flex items-center justify-center text-[#9c754d]">
                        <MessageSquare size={20} />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Total Testimoni</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">
                            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.totalTestimonials}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Aksi Cepat</h2>
                <p className="text-sm text-dark-500 font-medium">Akses cepat fitur utama manajemen</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-all relative overflow-hidden group flex flex-col">
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F4F8] flex items-center justify-center text-[#396680] mb-6">
                            <Compass size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-dark-900 mb-3 tracking-tight">Kelola Proyek</h3>
                        <p className="text-sm text-dark-500 leading-relaxed font-medium mb-8">
                            Pantau progres, tambahkan proyek baru, atau perbarui status konstruksi.
                        </p>
                        <div className="mt-auto">
                            <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#396680] hover:text-dark-900 transition-colors">
                                Buka Manajemen Proyek <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-all relative overflow-hidden group flex flex-col">
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#f4ece3] flex items-center justify-center text-[#9c754d] mb-6">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-dark-900 mb-3 tracking-tight">Kelola Testimoni</h3>
                        <p className="text-sm text-dark-500 leading-relaxed font-medium mb-8">
                            Lihat ulasan klien, moderasi testimoni baru, dan publikasikan ke website.
                        </p>
                        <div className="mt-auto">
                            <Link to="/admin/testimonials" className="inline-flex items-center gap-2 text-sm font-bold text-[#9c754d] hover:text-dark-900 transition-colors">
                                Buka Manajemen Testimoni <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] rounded-[2rem] p-8 shadow-md relative overflow-hidden group flex flex-col text-white">
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Lihat Website</h3>
                        <p className="text-sm text-white/70 leading-relaxed font-medium mb-8">
                            Buka tampilan website publik untuk melihat perubahan secara real-time.
                        </p>
                        <div className="mt-auto">
                            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#E5E9EC] hover:text-white transition-colors">
                                Kunjungi Situs <ArrowRight size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Dashboard
