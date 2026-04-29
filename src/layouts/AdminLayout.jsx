import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaCommentDots, FaSignOutAlt, FaSearch, FaBell, FaCompass, FaExternalLinkAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logoutUser()
        navigate('/admin/login')
    }

    const sidebarLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <div className="grid grid-cols-2 gap-0.5 w-4 h-4"><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div></div> }, // Fake dashboard icon
        { to: '/admin/projects', label: 'Kelola Proyek', icon: <FaCompass /> },
        { to: '/admin/testimonials', label: 'Kelola Testimoni', icon: <FaCommentDots /> },
    ]

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex font-sans text-dark-900 relative overflow-hidden">
            <div className="fixed -bottom-16 right-16 pointer-events-none z-0 opacity-10">
                <FaCompass className="text-[250px] text-dark-400" />
            </div>
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-[#E2E8EC] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
            >
                <div className="px-8 pt-8 pb-10 flex items-center gap-3">
                    <img src="/logo.jpg" alt="Bangunanmu.id Logo" className="h-10 w-auto object-contain mix-blend-multiply flex-shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-dark-900 tracking-tight leading-tight">
                            Bangunanmu<span className="font-medium text-dark-500">.id</span>
                        </span>
                        <span className="text-[8px] font-bold text-[#658797] tracking-widest uppercase mt-0.5">
                            Konstruksi & Design and Build
                        </span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-dark-400">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <nav className="px-4 space-y-2 flex-1">
                    {sidebarLinks.map((link, i) => {
                        const isActive = location.pathname.startsWith(link.to)
                        return (
                            <NavLink
                                key={i}
                                to={link.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-4 px-6 py-3.5 rounded-lg font-bold text-[15px] transition-all relative ${isActive
                                    ? 'text-[#658797] bg-white shadow-sm'
                                    : 'text-dark-500 hover:text-dark-900 hover:bg-dark-100/50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#658797] rounded-r-md"></div>
                                )}
                                <div className={`text-lg ${isActive ? 'text-[#658797]' : 'text-dark-400'}`}>
                                    {link.icon}
                                </div>
                                <span>{link.label}</span>
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="p-6">
                    <div className="bg-[#D9E1E5] rounded-2xl p-3 flex flex-row items-center gap-3 shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-dark-900 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=1a202c&color=fff`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-extrabold text-dark-900 truncate">Admin Bangunanmu</p>
                            <p className="text-[10px] text-dark-500 font-medium">Super Admin</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-dark-400 hover:text-red-500 transition-colors" title="Logout">
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
                />
            )}

            <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen relative z-10 w-full overflow-x-hidden">
                <header className="px-4 sm:px-8 pt-8 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-lg shadow-sm text-dark-500">
                            <FaBars />
                        </button>

                        <div className="relative w-full max-w-lg">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300">
                                <FaSearch />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari proyek atau testimoni..."
                                className="w-full pl-11 pr-4 py-3 bg-white rounded-full border-none shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#658797]/30 text-dark-900 placeholder:text-dark-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-auto md:ml-0">
                        <button className="relative text-dark-500 hover:text-dark-900 transition-colors">
                            <FaBell className="text-xl" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#E5E9EC] rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-dark-900 hidden sm:block">
                                Halo, <span className="font-bold">{user?.name || 'Admin'}</span>
                            </span>
                            <div className="w-8 h-8 rounded-full bg-dark-900 overflow-hidden shadow-sm">
                                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=1a202c&color=fff`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-8 flex-1 w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
