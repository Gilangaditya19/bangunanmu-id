import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import ContactForm from './ContactForm';

const ContactSection = () => {
    return (
        <section className="bg-dark-50 section-padding">
            <div className="section-container relative">
                
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative bg-[#FAFAFA] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden p-6 sm:p-8 lg:p-10 border border-dark-100/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-dark-900 tracking-tight text-center lg:text-left">
                                Mulai Diskusikan Proyekmu
                            </h2>
                            <p className="text-dark-500 text-base lg:text-lg mb-8 sm:mb-12 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                                Jangan ragu untuk berkonsultasi. Tim kami siap membantu mewujudkan ide Anda menjadi realitas.
                            </p>

                            <div className="space-y-6 sm:space-y-8">
                                <a href="https://wa.me/6287765823731" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 sm:gap-6 bg-white p-4 rounded-2xl shadow-sm lg:bg-transparent lg:p-0 lg:rounded-none lg:shadow-none transition-all hover:opacity-80">
                                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#EBEFEF] text-[#658797] rounded-full flex items-center justify-center text-lg sm:text-xl shadow-sm">
                                        <FaWhatsapp />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-dark-400 font-medium mb-0.5 sm:mb-1">Telepon / WhatsApp</p>
                                        <p className="text-base sm:text-xl text-dark-900 font-bold tracking-wide truncate">0877 - 6582 - 3731</p>
                                    </div>
                                </a>

                                <a href="mailto:bangunanmu.id@gmail.com" className="flex items-center gap-4 sm:gap-6 bg-white p-4 rounded-2xl shadow-sm lg:bg-transparent lg:p-0 lg:rounded-none lg:shadow-none transition-all hover:opacity-80">
                                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#EBEFEF] text-[#658797] rounded-full flex items-center justify-center text-lg sm:text-xl shadow-sm">
                                        <FaEnvelope />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-dark-400 font-medium mb-0.5 sm:mb-1">Email</p>
                                        <p className="text-base sm:text-xl text-dark-900 font-bold tracking-wide truncate">bangunanmu.id@gmail.com</p>
                                    </div>
                                </a>

                                <a href="https://www.instagram.com/bangunanmu.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 sm:gap-6 bg-white p-4 rounded-2xl shadow-sm lg:bg-transparent lg:p-0 lg:rounded-none lg:shadow-none transition-all hover:opacity-80">
                                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#EBEFEF] text-[#658797] rounded-full flex items-center justify-center text-lg sm:text-xl shadow-sm">
                                        <FaInstagram />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-dark-400 font-medium mb-0.5 sm:mb-1">Instagram</p>
                                        <p className="text-base sm:text-xl text-dark-900 font-bold tracking-wide truncate">@bangunanmu.id</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2rem] border border-dark-100/20 w-full h-full">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
