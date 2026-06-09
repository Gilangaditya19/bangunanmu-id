import { MessageCircle, Mail } from 'lucide-react';

const Instagram = ({ size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
import ContactForm from './ContactForm';

const ContactSection = () => {
    return (
        <section className="bg-dark-50 section-padding">
            <div className="section-container relative">
                
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative bg-[#f8f9fa] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden p-6 sm:p-8 lg:p-10 border border-dark-100/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        
                        <div className="flex flex-col justify-center">
                            <p className="text-[#396680] font-bold text-xs tracking-widest uppercase mb-4 text-center lg:text-left">
                                HUBUNGI KAMI
                            </p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-dark-900 tracking-tight text-center lg:text-left">
                                Mari bangun sesuatu yang <span className="text-[#396680]">luar biasa bersama.</span>
                            </h2>
                            <p className="text-dark-900 text-base lg:text-lg mb-8 sm:mb-12 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                                Jangan ragu untuk berkonsultasi. Tim kami siap membantu mewujudkan ide Anda menjadi realitas.
                            </p>

                            <div className="space-y-4">
                                <a href="https://wa.me/6281368227031" target="_blank" rel="noopener noreferrer" className="bg-white px-6 py-5 rounded-2xl shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#396680] shrink-0">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-dark-600 mb-1">Telepon/Whatsapp</p>
                                        <p className="font-bold text-dark-900">0813 - 6822 - 7031</p>
                                    </div>
                                </a>

                                <a href="https://mail.google.com/mail/?view=cm&to=bangunanmu.id@gmail.com" target="_blank" rel="noopener noreferrer" className="bg-white px-6 py-5 rounded-2xl shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#396680] shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-dark-600 mb-1">Email</p>
                                        <p className="font-bold text-dark-900">bangunanmu.id@gmail.com</p>
                                    </div>
                                </a>

                                <a href="https://www.instagram.com/bangunanmu.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="bg-white px-6 py-5 rounded-2xl shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#396680] shrink-0">
                                        <Instagram size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-dark-600 mb-1">Instagram</p>
                                        <p className="font-bold text-dark-900">@bangunanmu.id</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2rem] border-2 border-[#396680] w-full h-full">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
