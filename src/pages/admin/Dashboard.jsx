import { useState } from 'react'
import { FaCompass, FaCheckCircle, FaCommentDots, FaGlobe, FaStar, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [stats] = useState({
        totalProjects: 42,
        activeProjects: 12,
        completedProjects: 30,
        totalTestimonials: 156,
    })

    return (
        <div className="pb-12">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
                
                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#658797]">
                        <FaCompass />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Total Proyek</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">{stats.totalProjects}</p>
                    </div>
                </div>

                <div className="bg-[#658797] rounded-[1.5rem] p-6 shadow-md flex flex-col justify-between min-h-[140px] xl:min-h-[180px] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-8 -mt-6 opacity-10">
                        <FaCompass className="text-[120px]" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] sm:text-xs font-bold text-white/80 tracking-widest uppercase mb-1">Proyek Aktif</p>
                        <p className="text-4xl sm:text-5xl font-extrabold leading-none tracking-tight">{stats.activeProjects}</p>
                    </div>
                    <div className="mt-8 xl:mt-auto relative z-10">
                        <p className="text-xs font-medium text-white/90">Sedang Berjalan</p>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                        <FaCheckCircle className="text-lg" />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Proyek Selesai</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">{stats.completedProjects}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[140px] xl:min-h-[180px]">
                    <div className="w-10 h-10 rounded-full bg-[#f4ece3] flex items-center justify-center text-[#9c754d]">
                        <FaCommentDots />
                    </div>
                    <div className="mt-8 xl:mt-auto">
                        <p className="text-[10px] sm:text-xs font-bold text-dark-400 tracking-widest uppercase mb-1">Total Testimoni</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-none tracking-tight">{stats.totalTestimonials}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Aksi Cepat</h2>
                <p className="text-sm text-dark-500 font-medium">Akses cepat fitur utama manajemen</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-all relative overflow-hidden group flex flex-col">
                    <div className="absolute -bottom-8 -right-8 transition-transform duration-500 group-hover:scale-110">
                        <FaCompass className="text-[140px] text-dark-50" />
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F4F8] flex items-center justify-center text-[#658797] mb-6">
                            <FaCompass className="text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-dark-900 mb-3 tracking-tight">Kelola Proyek</h3>
                        <p className="text-sm text-dark-500 leading-relaxed font-medium mb-8">
                            Pantau progres, tambahkan proyek baru, atau perbarui status konstruksi.
                        </p>
                        <div className="mt-auto">
                            <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#658797] hover:text-dark-900 transition-colors">
                                Buka Manajemen <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-all relative overflow-hidden group flex flex-col">
                    <div className="absolute -bottom-8 -right-8 transition-transform duration-500 group-hover:scale-110">
                        <FaStar className="text-[140px] text-dark-50" />
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#f4ece3] flex items-center justify-center text-[#9c754d] mb-6">
                            <FaCommentDots className="text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-dark-900 mb-3 tracking-tight">Kelola Testimoni</h3>
                        <p className="text-sm text-dark-500 leading-relaxed font-medium mb-8">
                            Lihat ulasan klien, moderasi testimoni baru, dan publikasikan ke website.
                        </p>
                        <div className="mt-auto">
                            <Link to="/admin/testimonials" className="inline-flex items-center gap-2 text-sm font-bold text-[#9c754d] hover:text-dark-900 transition-colors">
                                Buka Testimoni <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] rounded-[2rem] p-8 shadow-md relative overflow-hidden group flex flex-col text-white">
                    <div className="absolute -bottom-8 -right-8 transition-transform duration-500 group-hover:scale-110">
                        <FaGlobe className="text-[140px] text-white/5" />
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                            <FaGlobe className="text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Lihat Website</h3>
                        <p className="text-sm text-white/70 leading-relaxed font-medium mb-8">
                            Buka tampilan website publik untuk melihat perubahan secara real-time.
                        </p>
                        <div className="mt-auto">
                            <Link to="/" target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-[#E5E9EC] hover:text-white transition-colors">
                                Kunjungi Situs <FaExternalLinkAlt className="text-xs" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Dashboard
