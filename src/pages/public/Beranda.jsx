import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHome, FaBuilding, FaCouch, FaSearch, FaCheckCircle, FaTools, FaHardHat, FaHandshake, FaFileAlt } from 'react-icons/fa';
import ContactSection from '../../components/ui/ContactSection';
import ShinyText from '../../components/ui/ShinyText';
import Typewriter from '../../components/ui/Typewriter';
import Stepper, { Step } from '../../components/ui/Stepper';

const Beranda = () => {
    const [progressQuery, setProgressQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [visibleCount, setVisibleCount] = useState(4);

    const portfolioItems = [
        {
            id: 1,
            category: 'Perumahan',
            title: 'Modern Tropical Villa',
            location: 'Bali, Indonesia',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 2,
            category: 'Interior',
            title: 'Minimalist Master Bedroom',
            location: 'Jakarta Selatan',
            image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 3,
            category: 'Interior',
            title: 'Japandi Kitchen Set',
            location: 'Tangerang Selatan',
            image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 4,
            category: 'Komersial',
            title: 'Glass Pavilion',
            location: 'Bogor, Jawa Barat',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 5,
            category: 'Perumahan',
            title: 'Scandinavian Family Home',
            location: 'Bandung, Jawa Barat',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 6,
            category: 'Komersial',
            title: 'Creative Office Space',
            location: 'Jakarta Pusat',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
        }
    ];

    const filteredPortfolio = portfolioItems.filter(item => activeFilter === 'Semua' || item.category === activeFilter);
    const visiblePortfolio = filteredPortfolio.slice(0, visibleCount);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setVisibleCount(4);
    };

    return (
        <div className="flex flex-col min-h-screen">
            
            <section className="relative px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-16 sm:mb-24">
                <div className="max-w-[1400px] mx-auto relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-dark-900 min-h-[600px] sm:min-h-[700px] flex items-center shadow-2xl">
                    
                    <div className="absolute inset-0 z-0">
                        
                        <img
                            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
                            alt="Construction Team"
                            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
                    </div>

                    <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 max-w-max">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <ShinyText text="Rekomendasi Jasa Konstruksi No.1" disabled={false} speed={3} className="text-sm font-medium text-white/90" />
                        </div>

                        <h1 className="text-4xl sm:text-6xl text-white font-bold tracking-tight mb-6 max-w-4xl leading-[1.1] min-h-[1.2em] flex items-center justify-center">
                            <Typewriter
                                texts={["Mulai Bangun Mimpimu", "Bersama Bangunanmu.id"]}
                                typingSpeed={100}
                                deletingSpeed={50}
                                pauseTime={2500}
                                className="text-white"
                            />
                        </h1>

                        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed font-light">
                            Wujudkan Rumah Impian yang Nyaman dan Fungsional.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/kontak" className="inline-flex items-center justify-center px-8 py-4 bg-white text-dark-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-xl">
                                Mulai Proyek
                            </Link>
                            <a href="#layanan-kami" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border border-white/20 font-semibold rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                                Lihat Portofolio
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding section-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-[2px] bg-dark-200"></div>
                            <span className="text-sm font-semibold tracking-wider text-dark-400 uppercase">TENTANG KAMI</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-bold text-dark-900 tracking-tight leading-tight">
                            Solusi Hunian <br />
                            <span className="text-[#658797]">Kreatif & Terpercaya</span>
                        </h2>
                        <p className="text-dark-500 text-lg leading-relaxed">
                            Kami adalah Bangunanmu.id, tim berdedikasi yang menghadirkan solusi unggul di bidang konstruksi dan desain interior, khususnya untuk hunian. Berbekal pengalaman lebih dari empat tahun, kami memahami pentingnya menciptakan rumah yang nyaman, fungsional, dan dirancang secara khusus sesuai dengan visi Anda.
                        </p>

                        <div className="p-8 bg-white rounded-3xl shadow-lg border border-dark-50 relative">
                            <p className="text-xl font-medium text-dark-800 italic relative z-10">
                                "Kami menghidupkan visi hunian Anda melalui inovasi teknologi, integritas terpercaya, dan kolaborasi yang mendalam."
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div>
                                <p className="text-4xl font-bold text-dark-900 mb-2">10<span className="text-[#658797]">+</span></p>
                                <p className="text-sm text-dark-500 font-medium">Proyek Selesai</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-dark-900 mb-2">100<span className="text-[#658797]">%</span></p>
                                <p className="text-sm text-dark-500 font-medium">Kepuasan Klien</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        
                        <div className="flex gap-4 h-[280px] sm:h-[320px]">
                            
                            <div className="flex-[1.4] rounded-[1.5rem] overflow-hidden shadow-lg">
                                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" alt="Interior Details" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-[0.8] flex flex-col gap-4">
                                
                                <div className="flex-1 rounded-[1.5rem] overflow-hidden shadow-lg">
                                    <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop" alt="Team Discussion" className="w-full h-full object-cover" />
                                </div>

                                <div className="bg-[#658797] text-white p-5 rounded-[1.5rem] shadow-lg flex flex-col items-center justify-center gap-2 h-[120px]">
                                    <FaCouch className="text-2xl" />
                                    <span className="text-sm font-semibold text-center leading-tight">Design and Build</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[200px] sm:h-[240px] rounded-[1.5rem] overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop" alt="Modern House Exterior" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="layanan-kami" className="bg-dark-50 py-24">
                <div className="section-container">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Layanan Kami</h2>
                            <p className="text-dark-500 text-lg">Solusi lengkap untuk wujudkan bangunan idaman</p>
                        </div>
                        <Link to="/layanan" className="inline-flex items-center gap-2 text-[#658797] font-semibold hover:text-[#527181] transition-colors group">
                            Lihat Detail Layanan
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="bg-white rounded-[2rem] p-4 shadow-xl hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-8">
                                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop" alt="Konstruksi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#658797] shadow-lg">
                                    <FaBuilding className="text-xl" />
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 pt-0">
                                <h3 className="text-2xl font-bold text-dark-900 mb-4">Layanan Konstruksi</h3>
                                <p className="text-dark-500 mb-8 line-clamp-2">Pembangunan rumah tinggal, ruko, hingga proyek komersial dengan basis struktur kuat dan presisi akurat.</p>

                                <ul className="space-y-3 mb-10">
                                    {['Desain 3D Realistis', 'Sipil & Arsitektur', 'Pemeliharaan Struktur'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-dark-600 font-medium">
                                            <FaCheckCircle className="text-[#658797] text-sm" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/kontak" className="block w-full text-center py-4 rounded-xl border-2 border-dark-100 text-dark-700 font-semibold hover:bg-dark-50 hover:border-dark-200 transition-colors">
                                    Konsultasi Gratis
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-4 shadow-xl hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-8">
                                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop" alt="Design and Build" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#658797] shadow-lg">
                                    <FaCouch className="text-xl" />
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 pt-0">
                                <h3 className="text-2xl font-bold text-dark-900 mb-4">Design and Build</h3>
                                <p className="text-dark-500 mb-8 line-clamp-2">Kustomisasi interior dan layout desain yang presisi untuk nuansa senada di setiap sudut ruangan.</p>

                                <ul className="space-y-3 mb-10">
                                    {['Kitchen Set Custom', 'Interior Design', 'Pekerjaan Design and Build'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-dark-600 font-medium">
                                            <FaCheckCircle className="text-[#658797] text-sm" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/layanan?tab=design-build" className="block w-full text-center py-4 rounded-xl border-2 border-dark-100 text-dark-700 font-semibold hover:bg-dark-50 hover:border-dark-200 transition-colors">
                                    Lihat Katalog
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="section-container">
                    <div className="bg-[#527181] rounded-[3rem] p-8 sm:p-16 relative overflow-hidden shadow-2xl">
                    
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-dark-900 opacity-10 rounded-full mix-blend-overlay filter blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <ShinyText 
                                text="Transparansi 100%" 
                                speed={3} 
                                className="text-white/90 text-xs font-bold uppercase tracking-widest" 
                            />
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Pantau Proyekmu</h2>
                        <p className="text-white/80 text-lg mb-10">
                            Masukkan ID/Kode proyek untuk melihat progress konstruksi real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-dark-400" />
                                <input
                                    type="text"
                                    placeholder="Contoh: BGN-2023-001"
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                                    value={progressQuery}
                                    onChange={(e) => setProgressQuery(e.target.value)}
                                />
                            </div>
                            <Link to="/cek-progress" className="flex items-center justify-center px-8 py-4 bg-white text-[#527181] font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg">
                                Cek Progress
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="section-container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-6">Portofolio Terbaru</h2>

                        <div className="flex flex-wrap justify-center gap-3">
                            {['Semua', 'Perumahan', 'Komersial', 'Interior'].map((filterItem) => (
                                <button
                                    key={filterItem}
                                    onClick={() => handleFilterChange(filterItem)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filterItem
                                        ? 'bg-dark-900 text-white'
                                        : 'bg-white border border-dark-200 text-dark-600 hover:border-dark-900'
                                        }`}
                                >
                                    {filterItem}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                        {visiblePortfolio.map((item) => (
                            <div key={item.id} className="group relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-lg">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-white/80">{item.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {visibleCount < filteredPortfolio.length && (
                        <div className="text-center">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 4)}
                                className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-dark-200 text-dark-700 font-semibold rounded-full hover:border-[#658797] hover:text-[#658797] transition-colors"
                            >
                                Lihat Lebih Banyak
                            </button>
                        </div>
                    )}
                </div>
            </section >

            <section className="py-24 bg-white">
                <div className="section-container">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 bg-white backdrop-blur-sm border border-dark-100 shadow-sm rounded-full mb-6 relative">
                            <ShinyText 
                                text="Roadmap Kolaborasi" 
                                theme="dark"
                                speed={3} 
                                className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase" 
                            />
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-2">
                            <span className="text-dark-900 drop-shadow-sm">Membangun Hunian</span><br />
                            <span className="text-[#658797]">Masa Depan Anda</span>
                        </h2>
                    </div>

                    <div className="w-full lg:max-w-6xl mx-auto">
                        <Stepper
                            initialStep={1}
                            onStepChange={(step) => console.log('Step changed to:', step)}
                            onFinalStepCompleted={() => console.log('All steps completed!')}
                            stepCircleContainerClassName="scale-90 md:scale-100"
                            contentClassName="mt-4"
                            renderStepIndicator={({ step, isActive, isCompleted }) => {
                                const stepIcons = {
                                    1: <FaSearch />,
                                    2: <FaFileAlt />,
                                    3: <FaTools />,
                                    4: <FaCheckCircle />
                                };
                                const stepLabels = {
                                    1: "KONSULTASI & SURVEY",
                                    2: "DESAIN & PENAWARAN",
                                    3: "PROSES PEMBANGUNAN",
                                    4: "SERAH TERIMA & GARANSI"
                                };
                                return (
                                    <div className="flex flex-col items-center justify-center relative">
                                        <div className="text-sm md:text-base">
                                            {stepIcons[step]}
                                        </div>
                                        
                                        <div className={`absolute top-full mt-4 md:mt-5 w-[55px] sm:w-[80px] md:w-max text-center ${isActive || isCompleted ? 'text-dark-900 font-bold' : 'text-dark-300 font-medium md:font-bold'} text-[6.5px] sm:text-[8px] md:text-[10px] uppercase tracking-wider md:tracking-widest leading-[1.2] break-words`}>
                                            {stepLabels[step]}
                                        </div>
                                    </div>
                                );
                            }}
                        >
                            
                            <Step>
                                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                                    
                                    <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[450px]">
                                        <img 
                                            src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1200&auto=format&fit=crop" 
                                            alt="Konsultasi" 
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">PHASE 01 : INISIASI</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                                        <h3 className="text-3xl font-bold text-dark-900 mb-4 tracking-tight">Konsultasi & Survey</h3>
                                        <p className="text-dark-500 text-base leading-relaxed mb-8 font-medium">
                                            Diskusi mendalam mengenai visi hunian Anda, kebutuhan ruang, hingga tinjauan lokasi langsung untuk memastikan fondasi yang tepat. Kami percaya setiap struktur dimulai dari pemahaman yang kuat akan karakter penghuninya.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 mb-10">
                                            <Link to="/kontak" className="inline-flex px-8 py-3.5 bg-[#658797] text-white font-bold rounded-full shadow-md hover:bg-[#527181] transition-all transform hover:-translate-y-0.5">
                                                Mulai Konsultasi
                                            </Link>
                                            
                                        </div>

                                        <div className="flex flex-row gap-8 pt-6 border-t border-dark-100">
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaSearch className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Survey Lokasi</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaCheckCircle className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Analisa Kebutuhan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Step>

                            <Step>
                                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                                    <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[450px]">
                                        <img 
                                            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop" 
                                            alt="Perencanaan" 
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">PHASE 02 : PERENCANAAN</span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                                        <h3 className="text-3xl font-bold text-dark-900 mb-4 tracking-tight">Desain & Penawaran</h3>
                                        <p className="text-dark-500 text-base leading-relaxed mb-8 font-medium">
                                            Masuk ke tahap visualisasi dengan pemodelan 3D realistis. Kami menyusun Rencana Anggaran Biaya (RAB) yang sepenuhnya transparan serta timeline pengerjaan yang terstruktur rapi.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 mb-10">
                                            <a href="#layanan-kami" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#658797] text-white font-bold rounded-full shadow-md hover:bg-[#527181] transition-all transform hover:-translate-y-0.5">
                                                Lihat Portofolio
                                            </a>
                                        </div>

                                        <div className="flex flex-row gap-8 pt-6 border-t border-dark-100">
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaTools className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Visualisasi 3D</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaCheckCircle className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Penyusunan RAB</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Step>

                            <Step>
                                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                                    <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[450px]">
                                        <img 
                                            src="https://images.unsplash.com/photo-1541888081622-152e00780f2d?q=80&w=1200&auto=format&fit=crop" 
                                            alt="Pembangunan" 
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">PHASE 03 : EKSEKUSI</span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                                        <h3 className="text-3xl font-bold text-dark-900 mb-4 tracking-tight">Proses Pembangunan</h3>
                                        <p className="text-dark-500 text-base leading-relaxed mb-8 font-medium">
                                            Eksekusi pembangunan di lapangan dilakukan secara profesional oleh tukang dan teknisi bersertifikasi. Anda akan mendapatkan laporan progress berkala secara real-time dari sistem kami.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 mb-10">
                                            <Link to="/cek-progress" className="inline-flex px-8 py-3.5 bg-[#658797] text-white font-bold rounded-full shadow-md hover:bg-[#527181] transition-all transform hover:-translate-y-0.5">
                                                Pantau Proyek
                                            </Link>
                                        </div>

                                        <div className="flex flex-row gap-8 pt-6 border-t border-dark-100">
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaHardHat className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Kontrol Kualitas</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaCheckCircle className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Laporan Harian</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Step>

                            <Step>
                                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                                    <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[450px]">
                                        <img 
                                            src="https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop" 
                                            alt="Serah Terima" 
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">PHASE 04 : FINAL</span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                                        <h3 className="text-3xl font-bold text-dark-900 mb-4 tracking-tight">Serah Terima & Garansi</h3>
                                        <p className="text-dark-500 text-base leading-relaxed mb-8 font-medium">
                                            Inspeksi akhir bersama untuk memastikan setiap detailnya sempurna. Penyerahan kunci dilakukan bersama dengan penyerahan dokumen garansi retensi bangunan sebagai jaminan kualitas final.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 mb-10">
                                            <Link to="/kontak" className="inline-flex px-8 py-3.5 bg-[#658797] text-white font-bold rounded-full shadow-md hover:bg-[#527181] transition-all transform hover:-translate-y-0.5">
                                                Hubungi Kami
                                            </Link>
                                        </div>

                                        <div className="flex flex-row gap-8 pt-6 border-t border-dark-100">
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaHandshake className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Inspeksi Akhir</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-dark-500">
                                                <FaCheckCircle className="text-[#658797]" />
                                                <span className="text-xs font-bold tracking-wider uppercase">Garansi Retensi</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Step>
                        </Stepper>
                    </div>
                </div>
            </section>

            < ContactSection />

        </div >
    );
};

export default Beranda;
