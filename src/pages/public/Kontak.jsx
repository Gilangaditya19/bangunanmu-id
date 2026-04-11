import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa'
import ContactForm from '../../components/ui/ContactForm'

const Kontak = () => {
    return (
        <div className="bg-[#f8f9fa] min-h-screen py-16 sm:py-24 font-sans">
            <div className="section-container">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 lg:justify-between">

                    <div className="flex-1 lg:max-w-md pt-4">
                        <p className="text-[#658797] font-bold text-xs tracking-widest uppercase mb-4">
                            HUBUNGI KAMI
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-900 leading-[1.15] tracking-tight mb-6">
                            Mari bangun sesuatu yang <br className="hidden lg:block " />
                            <span className="text-[#658797]">luar biasa bersama.</span>
                        </h1>
                        <p className="text-dark-500 text-[17px] mb-12 leading-relaxed max-w-sm">
                            Punya ide proyek? Kami sangat ingin mendengarnya dari Anda. Hubungi kami untuk pertanyaan, penawaran harga, atau sekadar menyapa.
                        </p>

                        <div className="space-y-4 mb-14">
                            
                            <a href="mailto:bangunanmu.id@gmail.com" className="bg-white px-6 py-5 rounded-2xl shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#658797] shrink-0">
                                    <FaEnvelope className="text-lg" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-dark-400 mb-1">Email</p>
                                    <p className="font-bold text-dark-900">bangunanmu.id@gmail.com</p>
                                </div>
                            </a>
                            
                            <a href="https://wa.me/6287765823731" target="_blank" rel="noopener noreferrer" className="bg-white px-6 py-5 rounded-2xl shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#658797] shrink-0">
                                    <FaPhone className="text-lg" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-dark-400 mb-1">Telepon</p>
                                    <p className="font-bold text-dark-900">0877 - 6582 - 3731</p>
                                </div>
                            </a>
                            
                            <a href="https://www.instagram.com/bangunanmu.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="bg-white px-6 py-5 rounded-2xl shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#658797] shrink-0">
                                    <FaInstagram className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-dark-400 mb-1">Instagram</p>
                                    <p className="font-bold text-dark-900">@bangunanmu.id</p>
                                </div>
                            </a>
                        </div>

                    </div>

                    <div className="flex-1 lg:max-w-2xl">

                        <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-lg mb-8">
                            <h2 className="text-2xl font-bold text-dark-900 mb-8">Kirim pesan kepada kami</h2>
                            <ContactForm />
                        </div>

                        <div className="relative w-full h-[260px] bg-[#B0BCC2] rounded-[2rem] overflow-hidden shadow-md flex items-center justify-center border-[6px] border-[#B0BCC2]/50">
                            
                            <div className="absolute inset-0 opacity-[0.15] bg-[length:40px_40px]"
                                style={{ backgroundImage: `linear - gradient(to right, #1e293b 1px, transparent 1px), linear - gradient(to bottom, #1e293b 1px, transparent 1px)` }}>
                            </div>

                            <svg className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                                
                                <path d="M0,150 Q100,120 200,150 T400,100" stroke="#f8fafc" strokeWidth="6" fill="none" />
                                <path d="M150,0 Q180,100 200,150 T300,300" stroke="#f8fafc" strokeWidth="8" fill="none" />
                                <path d="M50,0 L100,300 M250,0 L200,300 M350,0 L300,300" stroke="#f8fafc" strokeWidth="2" fill="none" />
                                <path d="M0,50 L400,100 M0,200 L400,250 M0,250 L400,280" stroke="#f8fafc" strokeWidth="2" fill="none" />
                                
                                <path d="M0,80 L400,120 M0,180 L400,200" stroke="#f8fafc" strokeWidth="1" fill="none" opacity="0.5" />
                                
                                <circle cx="120" cy="80" r="3" fill="#334155" opacity="0.6" />
                                <circle cx="300" cy="200" r="3" fill="#334155" opacity="0.6" />
                                <circle cx="250" cy="80" r="3" fill="#334155" opacity="0.6" />
                                <circle cx="80" cy="220" r="3" fill="#334155" opacity="0.6" />
                            </svg>

                            <div className="relative z-10 flex flex-col items-center">
                                
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none"></div>

                                <div className="w-14 h-14 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg relative z-20 mb-2">
                                    <div className="w-10 h-10 bg-[#658797] border-[3px] border-white rounded-full flex items-center justify-center text-white shadow-md">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="bg-white px-5 py-1.5 rounded-full shadow-md font-bold text-[13px] text-dark-900 relative z-20">
                                    Kantor Pusat Kami
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Kontak
