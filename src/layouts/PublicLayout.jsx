import { useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'


const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [layananDropdown, setLayananDropdown] = useState(false)
    const location = useLocation()

    const navLinks = [
        { to: '/', label: 'Beranda' },
        { to: '/tentang', label: 'Tentang Kami' },
        {
            label: 'Layanan',
            dropdown: true,
            children: [
                { to: '/layanan?tab=konstruksi', label: 'Konstruksi' },
                { to: '/layanan?tab=design-build', label: 'Design and Build' },
            ],
        },
        { to: '/cek-progress', label: 'Cek Progress' },
        { to: '/kontak', label: 'Kontak' },
    ]

    const activeLinkClass = ({ isActive }) =>
        `relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${isActive ? 'bg-dark-100 text-dark-900 shadow-sm' : 'text-dark-500 hover:text-dark-900 hover:bg-dark-50'
        }`

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-dark-100 shadow-sm transition-all duration-300">
                <div className="section-container">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src="/logo.jpg" alt="Bangunanmu.id Logo" className="h-10 w-auto object-contain mix-blend-multiply flex-shrink-0" />
                            <span className="text-xl font-bold text-dark-900 tracking-tight">
                                Bangunanmu<span className="text-dark-500 font-normal">.id</span>
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center justify-center flex-1 ml-4 lg:ml-10">
                            <div className="flex items-center gap-1 bg-white border border-dark-100 px-2 py-1.5 rounded-full shadow-sm">
                                {navLinks.map((link, i) =>
                                    link.dropdown ? (
                                        <div
                                            key={i}
                                            className="relative"
                                            onMouseEnter={() => setLayananDropdown(true)}
                                            onMouseLeave={() => setLayananDropdown(false)}
                                        >
                                            <button className={`flex items-center gap-1 px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full ${location.pathname.startsWith('/layanan') ? 'bg-dark-100 text-dark-900 shadow-sm' : 'text-dark-500 hover:text-dark-900 hover:bg-dark-50'}`}>
                                                {link.label}
                                                <FaChevronDown className={`text-[10px] ml-1 transition-transform duration-300 ${layananDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            {layananDropdown && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 animate-fadeIn opacity-100 transform origin-top transition-all duration-200">
                                                    <div className="bg-white rounded-2xl shadow-xl border border-dark-100 py-3">
                                                        {link.children.map((child, j) => (
                                                            <Link
                                                                key={j}
                                                                to={child.to}
                                                                className="block px-5 py-2.5 mx-2 text-sm font-medium text-dark-600 rounded-xl hover:bg-dark-50 hover:text-dark-900 transition-colors"
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <NavLink key={i} to={link.to} end={link.to === '/'} className={activeLinkClass}>
                                            {link.label}
                                        </NavLink>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center justify-end">
                            <Link to="/kontak" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#658797] hover:bg-[#527181] text-white text-sm font-semibold rounded-full shadow-md transition-colors">
                                Mulai Proyek
                            </Link>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-dark-500 hover:text-dark-900 hover:bg-dark-50 rounded-xl transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-dark-100 shadow-xl animate-slideDown overflow-hidden">
                        <div className="section-container py-6 space-y-3">
                            {navLinks.map((link, i) =>
                                link.dropdown ? (
                                    <div key={i} className="bg-dark-50 rounded-2xl p-2">
                                        <button
                                            onClick={() => setLayananDropdown(!layananDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 font-medium text-dark-700 rounded-xl"
                                        >
                                            {link.label}
                                            <div className={`p-1 rounded-full bg-white shadow-sm transition-transform duration-300 ${layananDropdown ? 'rotate-180' : ''}`}>
                                                <FaChevronDown className="text-xs" />
                                            </div>
                                        </button>
                                        {layananDropdown && (
                                            <div className="px-2 pb-2 space-y-1 mt-1">
                                                {link.children.map((child, j) => (
                                                    <Link
                                                        key={j}
                                                        to={child.to}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block px-4 py-3 text-sm font-medium text-dark-500 hover:text-dark-900 hover:bg-white rounded-xl transition-all"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink
                                        key={i}
                                        to={link.to}
                                        end={link.to === '/'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `block px-6 py-3.5 font-medium rounded-2xl transition-all ${isActive ? 'bg-dark-100 text-dark-900' : 'text-dark-700 hover:bg-dark-50'}`
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                )
                            )}
                            <div className="pt-4 px-2">
                                <Link to="/kontak" onClick={() => setMobileMenuOpen(false)} className="inline-flex w-full items-center justify-center px-6 py-3.5 bg-[#658797] hover:bg-[#527181] text-white font-semibold rounded-xl shadow-md transition-colors">
                                    Mulai Proyek
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1 bg-[#FAFAFA]">
                <Outlet />
            </main>

            <footer className="bg-[#658797] text-white pt-20 pb-10 border-t border-white/10">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                        <div className="lg:col-span-6 pr-0 lg:pr-12">
                            <Link to="/" className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-auto bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0 border-2 border-white/20 p-1">
                                    <img src="/logo.jpg" alt="Bangunanmu.id Logo" className="h-full w-auto object-contain" />
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    Bangunanmu<span className="text-white/80 font-normal">.id</span>
                                </span>
                            </Link>
                            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-sm">
                                Jadikan simulasi dan merencanakan hunian impianmu jadi lebih transparan, aman & mudah dengan Bangunanmu.id. Wujudkan rumah idamanmu dengan kami.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://instagram.com/bangunanmu.id/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-[#658797] transition-all focus:ring-4 focus:ring-white/20">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <h4 className="font-semibold text-white mb-6">Layanan</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/layanan?tab=konstruksi" className="text-white/80 hover:text-white transition-colors text-sm">
                                        Konstruksi Bangunan
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/layanan?tab=design-build" className="text-white/80 hover:text-white transition-colors text-sm">
                                        Design and Build
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h4 className="font-semibold text-white mb-6">Perusahaan</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/tentang" className="text-white/80 hover:text-white transition-colors text-sm">
                                        Tentang Kami
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/kontak" className="text-white/80 hover:text-white transition-colors text-sm">
                                        Kontak
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col items-center justify-center gap-4">
                        <p className="text-white/60 text-xs">
                            &copy; {new Date().getFullYear()} Bangunanmu.id. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default PublicLayout
