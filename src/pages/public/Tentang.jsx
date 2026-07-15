import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Lightbulb, Palette, Shield, ArrowRight } from 'lucide-react';
import ShinyText from '../../components/ui/ShinyText';
import ScrollReveal from '../../components/ui/ScrollReveal';
import tentangGalleryProyek from '../../assets/images/tentang_gallery_proyek.png';
import tentangGalleryProyek2 from '../../assets/images/tentang_gallery_proyek2.png';
import tentangGalleryProyek3 from '../../assets/images/tentang_gallery_proyek3.png';
import tentangGalleryProyek4 from '../../assets/images/tentang_gallery_proyek4.png';

const Tentang = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">

            <section className="relative px-4 sm:px-6 lg:px-8 mt-4 sm:mt-12 mb-16 sm:mb-24 overflow-hidden">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    <ScrollReveal variant="fadeInLeft" className="space-y-8 z-10 relative">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#396680]/10 border border-[#396680]/20 shadow-sm max-w-max">
                            <ShinyText
                                text="PENGALAMAN LEBIH DARI 4 TAHUN"
                                theme="brand"
                                speed={3}
                                className="text-[10px] font-bold tracking-widest uppercase"
                            />
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-bold text-dark-900 tracking-tight leading-[1.1]">
                            Siapa <br />
                            <span className="text-[#396680]">Kami?</span>
                        </h1>

                        <p className="text-lg text-dark-900 max-w-lg leading-relaxed">
                            PT Solusi Bangun Berkah (Bangunanmu.id) lahir dari satu keyakinan sederhana: membangun rumah seharusnya tidak terasa menegangkan. Kami adalah tim design & build residensial yang menemani klien dari sketsa pertama hingga kunci diserahkan dengan komunikasi yang jujur, jadwal yang dipegang, dan hasil yang bisa dipertanggungjawabkan. Lebih dari setengah dekade, kami hadir bukan hanya sebagai kontraktor, tapi sebagai mitra yang bertanggung jawab bahkan di kondisi paling sulit sekalipun.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/layanan" className="inline-flex items-center justify-center px-8 py-4 bg-[#396680] text-white font-semibold rounded-full hover:bg-[#2d5166] transition-colors shadow-lg shadow-[#396680]/30 group">
                                Lihat Portfolio
                                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInRight" delay={200} className="relative h-[550px] sm:h-[650px] lg:h-[600px] w-full mt-12 lg:mt-0">

                        <div className="absolute top-[40%] left-[5%] w-[300px] h-[300px] bg-yellow-100/50 rounded-full mix-blend-multiply filter blur-[80px] z-0 transform -translate-y-1/2"></div>

                        <div className="absolute top-0 left-0 w-[58%] h-[60%] lg:w-[55%] lg:h-[70%] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-10 hover:-translate-y-1 transition-transform duration-500 bg-white">
                            <img src={tentangGalleryProyek} alt="Galeri Proyek Bangunanmu.id" className="w-full h-full object-cover" />
                        </div>

                        <div className="absolute top-[10%] right-0 w-[38%] h-[35%] lg:w-[35%] lg:h-[45%] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-xl z-20 hover:-translate-y-1 transition-transform duration-500 bg-white">
                            <img src={tentangGalleryProyek2} alt="Kolaborasi Proyek Bangunanmu.id" className="w-full h-full object-cover" />
                        </div>

                        <div className="absolute bottom-[5%] left-[15%] w-[45%] h-[40%] lg:w-[50%] lg:h-[45%] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl z-30 ring-[6px] lg:ring-[8px] ring-white bg-white hover:-translate-y-1 transition-transform duration-500">
                            <img src={tentangGalleryProyek3} alt="Presentasi Desain Bangunanmu.id" className="w-full h-full object-cover" />
                        </div>

                        <div className="absolute bottom-[15%] right-[5%] w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden shadow-xl z-40 ring-[6px] ring-white bg-white hover:-translate-y-1 transition-transform duration-500">
                            <img src={tentangGalleryProyek4} alt="Desain Dapur Bangunanmu.id" className="w-full h-full object-cover" />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-24 bg-[#FAFAFA]">
                <div className="section-container">
                    <ScrollReveal variant="fadeInUp" className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
                        <div className="lg:col-span-7">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-xs font-bold tracking-widest text-[#396680] uppercase">VISI & MISI</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold text-dark-900 tracking-tight leading-tight">
                                Lebih dari Sekadar Kontraktor, <br />
                                Partner Kreatif untuk Mewujudkan Visi Anda.
                            </h2>
                        </div>
                        <div className="lg:col-span-5">
                            <p className="text-dark-900 text-lg leading-relaxed">
                                Kami hadir sebagai penyedia solusi konstruksi dan interior berbasis teknologi, serta dikenal atas komitmen kami terhadap kualitas, transparansi, dan kepuasan klien. Kami bertekad untuk menetapkan standar baru dalam konstruksi dengan mengintegrasikan teknologi mutakhir seperti Building Information Modeling (BIM) dan Augmented Reality (AR), guna menciptakan ruang luar biasa yang membangun kepercayaan serta melampaui harapan klien.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <ScrollReveal variant="fadeInUp" delay={0} className="bg-white p-8 md:p-10 rounded-[40px] shadow-lg md:shadow-sm hover:shadow-xl transition-all duration-300 border border-dark-200 md:border-dark-100 hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-dark-50 flex items-center justify-center mb-8 border border-dark-100/50">
                                <Lightbulb size={24} className="text-[#396680]" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-4">Inovasi Tanpa Batas</h3>
                            <p className="text-dark-900 text-sm leading-relaxed">
                                Pemanfaatan teknologi terkini, termasuk Building Information Modeling (BIM) dan Augmented Reality (AR), guna menjamin proses yang terintegrasi serta transparan dari awal hingga akhir.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal variant="fadeInUp" delay={150} className="bg-white p-8 md:p-10 rounded-[40px] shadow-lg md:shadow-sm hover:shadow-xl transition-all duration-300 border border-dark-200 md:border-dark-100 hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-dark-50 flex items-center justify-center mb-8 border border-dark-100/50">
                                <Palette size={24} className="text-[#396680]" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-4">Transparansi</h3>
                            <p className="text-dark-900 text-sm leading-relaxed">
                                Membangun kepercayaan melalui komunikasi yang jelas, praktik kerja yang etis, serta komitmen terhadap kualitas.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal variant="fadeInUp" delay={300} className="bg-white p-8 md:p-10 rounded-[40px] shadow-lg md:shadow-sm hover:shadow-xl transition-all duration-300 border border-dark-200 md:border-dark-100 hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-dark-50 flex items-center justify-center mb-8 border border-dark-100/50">
                                <Shield size={24} className="text-[#396680]" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-4">Kolaborasi</h3>
                            <p className="text-dark-900 text-sm leading-relaxed">
                                Bekerja sama secara erat dengan klien untuk mewujudkan visi mereka, serta memadukan ide-ide klien dengan keahlian yang kami miliki.
                            </p>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="section-container">
                    <ScrollReveal variant="scaleUp" className="bg-[#396680] rounded-[3rem] p-12 sm:p-16 text-white shadow-2xl shadow-[#396680]/30 relative overflow-hidden">

                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
                            <div className="lg:col-span-4">
                                <h2 className="text-3xl font-bold mb-3 tracking-tight">Dampak Nyata</h2>
                                <p className="text-white/80 font-medium">Angka tidak pernah berbohong.</p>
                            </div>
                            <div className="lg:col-span-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-4">
                                    <div className="text-center sm:text-left">
                                        <p className="text-5xl font-bold mb-2">10<span className="text-white/60">+</span></p>
                                        <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Proyek Selesai</p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-5xl font-bold mb-2">99<span className="text-white/60">%</span></p>
                                        <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Klien Puas</p>
                                    </div>
                                    <div className="text-center sm:text-left col-span-2 sm:col-span-1">
                                        <p className="text-5xl font-bold mb-2">4<span className="text-white/60">+</span></p>
                                        <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Tahun</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-32 bg-[#FAFAFA] text-center">
                <ScrollReveal variant="fadeInUp" className="section-container max-w-4xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-dark-900 mb-6 tracking-tight leading-tight">
                        Siap Mewujudkan Ruang Impian <br className="hidden sm:block" />
                        Anda?
                    </h2>
                    <p className="text-lg text-dark-900 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Jangan biarkan ide Anda hanya menjadi angan-angan. Mari berdiskusi dan mulai membangun masa depan hari ini.
                    </p>
                    <Link to="/kontak" className="inline-flex items-center justify-center px-10 py-5 bg-[#396680] text-white font-bold rounded-full hover:bg-[#2d5166] hover:scale-105 transition-all duration-300 shadow-xl shadow-[#396680]/20 text-lg">
                        Mulai Konsultasi Gratis
                    </Link>
                </ScrollReveal>
            </section>
        </div>
    );
};

export default Tentang;
