import { useState, useEffect, useRef, useCallback } from 'react'
import { getApprovedTestimonials } from '../../services/testimonialService'
import { Link, useSearchParams } from 'react-router-dom'
import { Home, Wrench, Building2, ChevronRight, ChevronLeft, Quote, Armchair, Paintbrush, Search, Hammer, HardHat, Handshake, Compass, Box, ClipboardCheck, CheckCircle2, Star, X } from 'lucide-react'
import WhatsAppButton from '../../components/WhatsAppButton'
import ShinyText from '../../components/ui/ShinyText'
import ScrollStack, { ScrollStackItem } from '../../components/ui/ScrollStack'
import ScrollReveal from '../../components/ui/ScrollReveal'

import konstruksiHero from '../../assets/images/konstruksi_hero_1772961128913.png'
import galleryArch1 from '../../assets/images/gallery_architecture_1_1772961143405.png'
import galleryInt1 from '../../assets/images/gallery_interior_1_1772961158421.png'
import galleryArch2 from '../../assets/images/gallery_architecture_2_1772961174580.png'
import galleryInt2 from '../../assets/images/gallery_interior_2_1772961189672.png'
import avatar1 from '../../assets/images/avatar_testi_1_1772961205686.png'
import avatar2 from '../../assets/images/avatar_testi_2_1772961220122.png'
import avatar3 from '../../assets/images/avatar_testi_3_1772961238354.png'
import designBuildHero from '../../assets/images/design_build_hero_1772964545081.png'
import tentangGalleryProyek from '../../assets/images/tentang_gallery_proyek.png'
import tentangGalleryProyek4 from '../../assets/images/tentang_gallery_proyek4.png'
import lemariSepatu from '../../assets/images/desain_lemari_sepatu.png'
import desainKamarAdik from '../../assets/images/desain_kamar_adik.png'
import desainGarasi from '../../assets/images/desain_garasi.jpg'
import desainBangunSipil from '../../assets/images/desain_bangun_sipil.jpg'
import tahapKonstruksi from '../../assets/images/tahap_konstruksi.jpg'
import desainBangunInterior from '../../assets/images/desain_bangun_interior.jpg'
import tanggaMelayang from '../../assets/images/tangga_melayang.jpeg'
import bintaroRenovasi from '../../assets/images/portfolio_bintaro_renovasi.png'
import serahTerima from '../../assets/images/serah_terima.jpg'
import berandaGalleryProyek from '../../assets/images/beranda_gallery_proyek.jpg'
import beforePortfolioBintaroRenovasi from '../../assets/images/before_portfolio_bintaro_renovasi.png'
import proyekPatimban from '../../assets/images/proyek_patimban.jpg'
import afterLemariSepatu from '../../assets/images/after_lemari_sepatu.PNG'
import desainKamarTidur from '../../assets/images/desain_kamar_tidur.png'
import portfolioDeraykhaOutfit from '../../assets/images/portfolio_deraykha_outfit.jpg'

const TestimonialCarousel = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const autoPlayRef = useRef(null)

    const getVisibleCount = () => {
        if (typeof window === 'undefined') return 3
        if (window.innerWidth < 768) return 1
        return 3
    }
    const [visibleCount, setVisibleCount] = useState(getVisibleCount())

    useEffect(() => {
        const handleResize = () => setVisibleCount(getVisibleCount())
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const maxIndex = Math.max(0, testimonials.length - visibleCount)

    const goTo = useCallback((index) => {
        setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
    }, [maxIndex])

    const goNext = useCallback(() => {
        setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
    }, [maxIndex])

    const goPrev = useCallback(() => {
        setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1)
    }, [maxIndex])

    // Auto-play
    useEffect(() => {
        if (isAutoPlaying && testimonials.length > visibleCount) {
            autoPlayRef.current = setInterval(goNext, 5000)
        }
        return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
    }, [isAutoPlaying, goNext, testimonials.length, visibleCount])

    // Touch handlers for swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX
        setIsAutoPlaying(false)
    }
    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX
    }
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current
        if (Math.abs(diff) > 50) {
            diff > 0 ? goNext() : goPrev()
        }
        setTimeout(() => setIsAutoPlaying(true), 3000)
    }

    if (testimonials.length === 0) return null

    // If <= visibleCount, just show grid, no carousel needed
    if (testimonials.length <= visibleCount) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testi, i) => (
                    <TestimonialCard key={i} testi={testi} />
                ))}
            </div>
        )
    }

    const totalDots = maxIndex + 1

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Carousel track */}
            <div
                className="overflow-hidden py-12 -my-12 px-6 -mx-6"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                    }}
                >
                    {testimonials.map((testi, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 px-4"
                            style={{ width: `${100 / visibleCount}%` }}
                        >
                            <TestimonialCard testi={testi} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation arrows */}
            <button
                onClick={() => { goPrev(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 3000) }}
                className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-dark-100 shadow-lg flex items-center justify-center text-dark-500 hover:text-[#396680] hover:border-[#396680]/30 hover:shadow-xl transition-all z-10"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={() => { goNext(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 3000) }}
                className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-dark-100 shadow-lg flex items-center justify-center text-dark-500 hover:text-[#396680] hover:border-[#396680]/30 hover:shadow-xl transition-all z-10"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dot indicators */}
            {totalDots > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalDots }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => { goTo(i); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 3000) }}
                            className={`rounded-full transition-all duration-300 ${i === currentIndex
                                ? 'w-8 h-2.5 bg-[#396680]'
                                : 'w-2.5 h-2.5 bg-dark-200 hover:bg-dark-300'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const TestimonialCard = ({ testi }) => (
    <div className="bg-white p-10 rounded-[40px] border border-[#396680]/30 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_60px_-10px_rgba(57,102,128,0.15)] hover:border-[#396680]/50 hover:-translate-y-1.5 transition-all duration-500 relative text-left h-full flex flex-col group">
        <div className="flex items-center gap-4 mb-6">
            <img
                src={testi.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testi.name)}&background=396680&color=fff&rounded=true&bold=true`}
                alt={testi.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-[#F0F4F8] shadow-sm"
            />
            <div>
                <h4 className="font-bold text-dark-900 text-sm mb-1">{testi.name}</h4>
                <div className="flex items-center gap-1 mb-1.5">
                    {[...Array(5)].map((_, starIndex) => (
                        <Star key={starIndex} size={12} fill={starIndex < (testi.rating || 5) ? "currentColor" : "none"} className={`${starIndex < (testi.rating || 5) ? 'text-yellow-400' : 'text-dark-100'}`} />
                    ))}
                </div>
                <p className="text-dark-600 text-[10px] sm:text-[11px] font-medium leading-tight">{testi.company || testi.project || testi.role || 'Klien Bangunanmu'}</p>
            </div>
        </div>
        <p className="text-dark-900 text-sm leading-relaxed flex-1">
            {testi.testimonialText || testi.review || testi.text}
        </p>
    </div>
)

const Layanan = () => {
    const [searchParams] = useSearchParams()
    const activeTab = searchParams.get('tab') || 'konstruksi'
    const [lightboxImage, setLightboxImage] = useState(null)

    const contents = {
        'konstruksi': {
            badge: "Solusi Konsultasi & Desain Terpercaya",
            title: "Konsultasi & Desain",
            desc: "Pintu masuk terbaik sebelum membangun. Kami bantu wujudkan konsep desain lengkap dengan estimasi biaya yang realistis sehingga kamu membangun dengan mata terbuka dan hati yang tenang.",
            heroImage: tentangGalleryProyek4,
            heroTitle: "Rendering Kitchen Set",
            heroSub: "",
            gallery: {
                big: { src: tentangGalleryProyek, alt: "Konsultasi" },
                small1: { src: desainKamarAdik, alt: "Desain Kamar Tidur" },
                small2: { src: desainGarasi, alt: "Desain Luar" },
                wide: { src: lemariSepatu, alt: "Custom Furniture & Lemari Sepatu" }
            },
            services: [
                {
                    title: 'Konsultasi Perencanaan & Layout',
                    desc: 'Layanan konsultasi mendalam untuk menerjemahkan kebutuhan hunian Anda ke dalam perencanaan denah layout 2D. Kami memastikan alur sirkulasi udara, pencahayaan alami, dan efisiensi ruang terancang secara optimal sebelum pembangunan fisik dimulai.',
                    icon: <Compass size={20} className="text-[#396680]" />,
                    link: '/kontak'
                },
                {
                    title: 'Desain Arsitektur & Visualisasi 3D',
                    desc: 'Pembuatan konsep rancangan arsitektur dan interior lengkap dengan visualisasi rendering 3D fotorealistik yang mendetail. Memberikan Anda gambaran nyata tentang bentuk bangunan, pemilihan kombinasi material, serta warna secara akurat.',
                    icon: <Paintbrush size={20} className="text-[#396680]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi & Konsep',
                    description: 'Diskusi awal untuk memahami kebutuhan spesifik, preferensi gaya, dan penentuan konsep desain yang sesuai dengan anggaran Anda.',
                    icon: <Search />,
                    image: tentangGalleryProyek,
                    badge: 'TAHAP 01 : KONSEPTUAL',
                    buttonText: 'Mulai Konsultasi',
                    subIcon1: <Search size={16} className="text-[#396680]" />,
                    subText1: 'Brainstorming',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Moodboard'
                },
                {
                    step: 2,
                    title: 'Pengembangan Denah',
                    description: 'Pembuatan layout 2D untuk memastikan alur sirkulasi yang optimal dan pembagian zona ruang yang efisien.',
                    icon: <Compass />,
                    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 02 : LAYOUTING',
                    buttonText: 'Lihat Detail',
                    subIcon1: <Compass size={16} className="text-[#396680]" />,
                    subText1: 'Zonasi',
                    subIcon2: <Box size={16} className="text-[#396680]" />,
                    subText2: 'Denah 2D'
                },
                {
                    step: 3,
                    title: 'Visualisasi 3D',
                    shortTitle: '3D Render',
                    description: 'Presentasi hasil render 3D fotorealistik yang memberikan gambaran jelas tentang bentuk, warna, dan material bangunan Anda.',
                    icon: <Box />,
                    image: desainKamarAdik,
                    badge: 'TAHAP 03 : VISUALISASI',
                    buttonText: 'Cek Portofolio',
                    subIcon1: <Paintbrush size={16} className="text-[#396680]" />,
                    subText1: 'Modeling 3D',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Rendering'
                },
                {
                    step: 4,
                    title: 'Penyusunan RAB',
                    shortTitle: 'RAB',
                    description: 'Pembuatan Rencana Anggaran Biaya (RAB) yang terperinci dan transparan berdasarkan desain yang telah disetujui.',
                    icon: <ClipboardCheck />,
                    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 04 : ESTIMASI',
                    buttonText: 'Atur Anggaran',
                    subIcon1: <ClipboardCheck size={16} className="text-[#396680]" />,
                    subText1: 'Perhitungan',
                    subIcon2: <Handshake size={16} className="text-[#396680]" />,
                    subText2: 'Optimasi Biaya'
                },
                {
                    step: 5,
                    title: 'Gambar Kerja Final',
                    shortTitle: 'DED Final',
                    description: 'Penyerahan dokumen Detail Engineering Desain (DED) lengkap yang siap digunakan sebagai panduan pelaksanaan konstruksi.',
                    icon: <Wrench />,
                    image: desainKamarTidur,
                    badge: 'TAHAP 05 : HANDOVER',
                    buttonText: 'Siap Bangun',
                    subIcon1: <Wrench size={16} className="text-[#396680]" />,
                    subText1: 'Dokumen DED',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Cetak Biru'
                }
            ]
        },
        'design-build': {
            badge: "Rancang Bangun",
            title: "Desain & Bangun Sipil",
            desc: "Layanan Desain & Bangun Sipil merupakan solusi menyeluruh dari desain hingga konstruksi rumah tinggal. Satu tanggung jawab penuh tidak ada celah antara desain yang dijanjikan dan bangunan yang berdiri.",
            heroImage: desainBangunSipil,
            heroTitle: "Desain & Bangun Sipil",
            heroSub: "",
            gallery: {
                big: { src: bintaroRenovasi, alt: "Sesudah Renovasi Rumah Bintaro" },
                small1: { src: beforePortfolioBintaroRenovasi, alt: "Sebelum Renovasi Bintaro" },
                small2: { src: berandaGalleryProyek, alt: "Taman Japandi" },
                wide: { src: proyekPatimban, alt: "Proyek Patimban" }
            },
            services: [
                {
                    title: 'Desain & Bangun Sipil',
                    desc: 'Solusi menyeluruh dari desain hingga konstruksi rumah tinggal. Satu tanggung jawab penuh sehingga tidak ada celah antara desain yang dijanjikan dan bangunan yang berdiri.',
                    icon: <Paintbrush size={20} className="text-[#396680]" />,
                    link: '/kontak'
                },
                {
                    title: 'Renovasi Total',
                    desc: 'Perombakan menyeluruh bangunan lama Anda dengan desain baru yang modern, termasuk perencanaan ulang tata ruang dan eksekusi pembangunan.',
                    icon: <Home size={20} className="text-[#396680]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi Briefing',
                    description: 'Penggalian ide secara detail, gaya design yang diinginkan pelanggan, serta pengukuran ruang di awal secara spesifik.',
                    icon: <Search />,
                    image: tentangGalleryProyek,
                    badge: 'TAHAP 01 : PENGGALIAN',
                    buttonText: 'Jadwalkan Sesi',
                    subIcon1: <Search size={16} className="text-[#396680]" />,
                    subText1: 'Brainstorming',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Pengukuran'
                },
                {
                    step: 2,
                    title: 'Design & Material',
                    description: 'Presentasi visualisasi 3D fotorealistik lengkap dengan referensi serta pemilihan sampel material fisik yang diaplikasikan.',
                    icon: <Box />,
                    image: desainBangunInterior,
                    badge: 'TAHAP 02 : VISUALISASI',
                    buttonText: 'Lihat Katalog',
                    subIcon1: <Paintbrush size={16} className="text-[#396680]" />,
                    subText1: 'Moodboard',
                    subIcon2: <Box size={16} className="text-[#396680]" />,
                    subText2: 'Sample Fisik'
                },
                {
                    step: 3,
                    title: 'Tinjau Anggaran',
                    shortTitle: 'Anggaran',
                    description: 'Finalisasi rencana anggaran biaya (RAB) dan penandatanganan kontrak kerja rancang bangun untuk kepastian hukum.',
                    icon: <Handshake />,
                    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 03 : KESEPAKATAN',
                    buttonText: 'Atur Anggaran',
                    subIcon1: <Hammer size={16} className="text-[#396680]" />,
                    subText1: 'Optimasi Biaya',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Approval'
                },
                {
                    step: 4,
                    title: 'Proses Pembangunan',
                    shortTitle: 'Konstruksi',
                    description: 'Eksekusi pembangunan fisik di lapangan dengan pengawasan ketat dan laporan progres berkala melalui sistem yang transparan.',
                    icon: <HardHat />,
                    image: tahapKonstruksi,
                    badge: 'TAHAP 04 : EKSEKUSI',
                    buttonText: 'Pantau Proyek',
                    subIcon1: <HardHat size={16} className="text-[#396680]" />,
                    subText1: 'Sipil Aktif',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Laporan Berkala'
                },
                {
                    step: 5,
                    title: 'Final Inspection',
                    shortTitle: 'Final',
                    description: 'Pengecekan dan finishing setiap detail akhir sebelum kami melaksanakan serah terima kepemilikan hasil karya.',
                    icon: <ClipboardCheck />,
                    image: tanggaMelayang,
                    badge: 'TAHAP 05 : SERAH TERIMA',
                    buttonText: 'Cek Lokasi',
                    subIcon1: <ClipboardCheck size={16} className="text-[#396680]" />,
                    subText1: 'Defect Audit',
                    subIcon2: <Home size={16} className="text-[#396680]" />,
                    subText2: 'Masa Pemeliharaan'
                }
            ]
        },
        'desain': {
            badge: "Rancang Bangun",
            title: "Desain & Bangun Interior",
            desc: "Transformasi ruang dalam rumah yang selaras dengan karakter dan gaya hidup penghuninya. Dari konsep hingga instalasi, kami tangani semuanya.",
            heroImage: desainBangunInterior,
            heroTitle: "Desain & Bangun Interior",
            heroSub: "",
            gallery: {
                big: { src: portfolioDeraykhaOutfit, alt: "Interior Deraykha Outfit" },
                small1: { src: lemariSepatu, alt: "Desain Lemari Sepatu" },
                small2: { src: afterLemariSepatu, alt: "Realisasi Lemari Sepatu" },
                wide: { src: desainKamarTidur, alt: "Desain Kamar Tidur" }
            },
            services: [
                {
                    title: 'Desain Arsitektur',
                    desc: 'Layanan ini berfokus pada perencanaan struktur, fasad, dan tata letak ruang secara komprehensif, menghasilkan gambar kerja (DED) yang siap diaplikasikan di lapangan.',
                    icon: <Compass size={20} className="text-[#396680]" />,
                    link: '/kontak'
                },
                {
                    title: 'Desain Interior',
                    desc: 'Layanan yang merancang estetika dan fungsionalitas ruang dalam, dari pemilihan palet warna hingga penentuan furnitur, untuk menciptakan harmoni visual.',
                    icon: <Paintbrush size={20} className="text-[#396680]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi Briefing',
                    description: 'Penggalian ide tata ruang secara detail, gaya interior/furnitur yang diinginkan, serta pengukuran ruang (survey lokasi) secara spesifik.',
                    icon: <Search />,
                    image: tentangGalleryProyek,
                    badge: 'TAHAP 01 : PENGGALIAN',
                    buttonText: 'Jadwalkan Sesi',
                    subIcon1: <Search size={16} className="text-[#396680]" />,
                    subText1: 'Brainstorming',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Pengukuran'
                },
                {
                    step: 2,
                    title: 'Desain & Pemilihan Material',
                    description: 'Presentasi visualisasi 3D interior fotorealistik lengkap dengan pemilihan sampel material fisik (HPL, kain, cat, finishing) yang diaplikasikan.',
                    icon: <Box />,
                    image: desainBangunInterior,
                    badge: 'TAHAP 02 : VISUALISASI',
                    buttonText: 'Lihat Katalog',
                    subIcon1: <Paintbrush size={16} className="text-[#396680]" />,
                    subText1: 'Moodboard',
                    subIcon2: <Box size={16} className="text-[#396680]" />,
                    subText2: 'Sample Fisik'
                },
                {
                    step: 3,
                    title: 'Rencana Anggaran & Kontrak',
                    shortTitle: 'Anggaran',
                    description: 'Finalisasi Rencana Anggaran Biaya (RAB) pengerjaan interior & custom furniture secara detail dan transparan sebelum penandatanganan kontrak.',
                    icon: <Handshake />,
                    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 03 : KESEPAKATAN',
                    buttonText: 'Atur Anggaran',
                    subIcon1: <ClipboardCheck size={16} className="text-[#396680]" />,
                    subText1: 'Optimasi Biaya',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Approval'
                },
                {
                    step: 4,
                    title: 'Produksi & Instalasi',
                    shortTitle: 'Instalasi',
                    description: 'Pembuatan custom furniture di workshop kami, dilanjutkan dengan instalasi dan fit-out interior di lapangan dengan pengawasan ketat.',
                    icon: <Hammer />,
                    image: lemariSepatu,
                    badge: 'TAHAP 04 : EKSEKUSI',
                    buttonText: 'Pantau Proyek',
                    subIcon1: <Hammer size={16} className="text-[#396680]" />,
                    subText1: 'Produksi Workshop',
                    subIcon2: <Wrench size={16} className="text-[#396680]" />,
                    subText2: 'Instalasi Fit-out'
                },
                {
                    step: 5,
                    title: 'Final Inspection & Handover',
                    shortTitle: 'Final',
                    description: 'Pengecekan akhir kualitas (Quality Control), pembersihan area (styling), dan serah terima hasil pengerjaan interior beserta masa garansi pemeliharaan.',
                    icon: <ClipboardCheck />,
                    image: desainKamarAdik,
                    badge: 'TAHAP 05 : SERAH TERIMA',
                    buttonText: 'Cek Hasil',
                    subIcon1: <ClipboardCheck size={16} className="text-[#396680]" />,
                    subText1: 'Quality Control',
                    subIcon2: <Home size={16} className="text-[#396680]" />,
                    subText2: 'Garansi'
                }
            ]
        }
    }

    const currentContent = contents[activeTab] || contents['konstruksi']
    const defaultGallery = {
        big: { src: tentangGalleryProyek, alt: "Konsultasi" },
        small1: { src: desainKamarAdik, alt: "Desain Kamar Tidur" },
        small2: { src: desainGarasi, alt: "Desain Luar" },
        wide: { src: lemariSepatu, alt: "Custom Furniture & Lemari Sepatu" }
    }
    const currentGallery = currentContent.gallery || defaultGallery

    const [testimonials, setTestimonials] = useState([])
    const [loadingTesti, setLoadingTesti] = useState(true)

    const dummyTestimonials = [
        {
            name: 'Budi Santoso',
            project: 'Rumah Tinggal, Depok',
            image: avatar1,
            rating: 5,
            testimonialText: '"Sangat puas dengan hasil kerjanya. Transparansi soal biaya dan timnya sangat komunikatif. Rumah impian saya jadi kenyataan tanpa drama."'
        },
        {
            name: 'Siti Aminah',
            project: 'Design & Build Dapur, Bekasi',
            image: avatar2,
            rating: 5,
            testimonialText: '"Awalnya ragu renovasi total, tapi tim Bangunanmu meyakinkan dengan design 3D yang detail. Hasil akhirnya persis seperti di gambar!"'
        },
        {
            name: 'Raka Adhitama',
            project: 'Modern Villa, Jakarta Selatan',
            image: avatar3,
            rating: 5,
            testimonialText: '"Pengerjaan tepat waktu, bahkan lebih awal dari jadwal. Kualitas struktur sangat kokoh. Sangat merepresentasikan ulasan bintang lima!"'
        }
    ]

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await getApprovedTestimonials()
                if (res.success && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    setTestimonials(res.data.data)
                } else if (Array.isArray(res.data) && res.data.length > 0) {
                    setTestimonials(res.data)
                } else {
                    setTestimonials(dummyTestimonials)
                }
            } catch (err) {
                console.error("Gagal mengambil data testimoni:", err)
                setTestimonials(dummyTestimonials)
            } finally {
                setLoadingTesti(false)
            }
        }
        fetchTestimonials()
    }, [])

    return (
        <div className="bg-[#FAFAFA] min-h-screen">

            <section className="pt-16 pb-12">
                <div className="section-container text-center">
                    <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-[#396680]/10 border border-[#396680]/20 shadow-sm">
                        <ShinyText
                            text={currentContent.badge}
                            theme="brand"
                            speed={3}
                            className="text-[10px] font-bold uppercase tracking-widest"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6 tracking-tight">{currentContent.title}</h1>
                    <p className="text-dark-900 max-w-2xl mx-auto leading-relaxed text-lg text-justify">
                        {currentContent.desc}
                    </p>
                </div>
            </section>

            <div className="section-container pb-24">

                <div className="space-y-24">

                    <ScrollReveal variant="scaleUp" className="relative h-[450px] md:h-[550px] w-full rounded-[40px] overflow-hidden shadow-2xl group">
                        <img
                            src={currentContent.heroImage}
                            alt={currentContent.heroTitle}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                        <div className="absolute bottom-12 left-12 text-white">
                            <h3 className="text-2xl font-bold mb-1">{currentContent.heroTitle}</h3>
                            <p className="text-white/80 text-sm">{currentContent.heroSub}</p>
                        </div>
                    </ScrollReveal>

                    <div className={`grid grid-cols-1 ${currentContent.services.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8`}>
                        {currentContent.services.map((card, i) => (
                            <ScrollReveal key={i} variant="fadeInUp" delay={i * 150} className="bg-white p-10 rounded-[40px] border border-dark-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="w-14 h-14 bg-dark-50 rounded-2xl flex items-center justify-center mb-8">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-dark-900 mb-4">{card.title}</h3>
                                <p className="text-dark-900 text-sm leading-relaxed mb-8">
                                    {card.desc}
                                </p>
                                <Link
                                    to={card.link}
                                    className="inline-flex items-center gap-2 text-dark-900 font-bold text-sm hover:gap-3 transition-all"
                                >
                                    Lihat Detail <ChevronRight size={14} />
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>

                    <section className="pt-24 pb-12 bg-white -mx-4 px-4 sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
                        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
                            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#396680]/10 border border-[#396680]/20 shadow-sm rounded-full mb-6 relative">
                                <ShinyText
                                    text="Roadmap Kolaborasi"
                                    theme="brand"
                                    speed={3}
                                    className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase"
                                />
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-2">
                                <span className="text-dark-900 drop-shadow-sm">Tahapan Kerja</span><br />
                                <span className="text-[#396680]">
                                    {activeTab === 'konstruksi' ? 'Konstruksi' : activeTab === 'desain' ? 'Desain & Bangun Interior' : 'Desain & Bangun Sipil'}
                                </span>
                            </h2>
                        </div>

                        <ScrollReveal variant="fadeInUp" className="w-full lg:max-w-6xl mx-auto">
                            <ScrollStack
                                itemDistance={500}
                                stepLabels={currentContent.roadmap.map(item => ({
                                    icon: item.icon,
                                    label: item.shortTitle || item.title
                                }))}
                            >
                                {currentContent.roadmap.map((item, index) => (
                                    <ScrollStackItem key={index}>
                                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row">
                                            <div className="w-full md:w-1/2 relative min-h-[200px] md:min-h-[450px]">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
                                            </div>
                                            <div className="w-full md:w-1/2 p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
                                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-900 mb-2 sm:mb-4 tracking-tight">{item.title}</h3>
                                                <p className="text-dark-900 text-sm sm:text-base leading-relaxed mb-4 sm:mb-8 font-medium">
                                                    {item.description}
                                                </p>

                                                <div className="flex flex-wrap gap-4 mb-10">
                                                    {item.buttonText === 'Lihat Katalog' || item.buttonText === 'Cek Portofolio' || item.buttonText === 'Lihat Detail' || item.buttonText === 'Lihat Desain' ? (
                                                        <button onClick={() => document.getElementById('galeri-proyek')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex px-8 py-3.5 bg-[#396680] text-white font-bold rounded-full shadow-md hover:bg-[#2d5166] transition-all transform hover:-translate-y-0.5">
                                                            {item.buttonText}
                                                        </button>
                                                    ) : item.buttonText === 'Pantau Proyek' || item.buttonText === 'Cek Lokasi' ? (
                                                        <Link to="/cek-progress" className="inline-flex px-8 py-3.5 bg-[#396680] text-white font-bold rounded-full shadow-md hover:bg-[#2d5166] transition-all transform hover:-translate-y-0.5">
                                                            {item.buttonText}
                                                        </Link>
                                                    ) : (
                                                        <Link to="/kontak" className="inline-flex px-8 py-3.5 bg-[#396680] text-white font-bold rounded-full shadow-md hover:bg-[#2d5166] transition-all transform hover:-translate-y-0.5">
                                                            {item.buttonText}
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="flex flex-row gap-8 pt-6 border-t border-dark-100">
                                                    <div className="flex items-center gap-2 text-dark-800">
                                                        {item.subIcon1}
                                                        <span className="text-xs font-bold tracking-wider uppercase">{item.subText1}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-dark-800">
                                                        {item.subIcon2}
                                                        <span className="text-xs font-bold tracking-wider uppercase">{item.subText2}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollStackItem>
                                ))}
                            </ScrollStack>
                        </ScrollReveal>
                    </section>

                    <ScrollReveal variant="fadeInUp" id="galeri-proyek" className="pt-12 scroll-mt-24">
                        <h2 className="text-3xl font-bold text-dark-900 mb-12">Galeri Proyek</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[800px]">

                            <div className="rounded-[40px] overflow-hidden shadow-lg h-[400px] lg:h-full cursor-pointer"
                                onClick={() => setLightboxImage({ src: currentGallery.big.src, alt: currentGallery.big.alt })}
                            >
                                <img src={currentGallery.big.src} alt={currentGallery.big.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>

                            <div className="flex flex-col gap-8 h-full">
                                <div className="grid grid-cols-2 gap-8 flex-1">
                                    <div className="rounded-[40px] overflow-hidden shadow-lg cursor-pointer"
                                        onClick={() => setLightboxImage({ src: currentGallery.small1.src, alt: currentGallery.small1.alt })}
                                    >
                                        <img src={currentGallery.small1.src} alt={currentGallery.small1.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="rounded-[40px] overflow-hidden shadow-lg cursor-pointer"
                                        onClick={() => setLightboxImage({ src: currentGallery.small2.src, alt: currentGallery.small2.alt })}
                                    >
                                        <img src={currentGallery.small2.src} alt={currentGallery.small2.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="relative rounded-[40px] overflow-hidden shadow-lg h-[300px] cursor-pointer"
                                    onClick={() => setLightboxImage({ src: currentGallery.wide.src, alt: currentGallery.wide.alt })}
                                >
                                    <img src={currentGallery.wide.src} alt={currentGallery.wide.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp" className="pt-12 text-center">
                        <h2 className="text-3xl font-bold text-dark-900 mb-2">Kata Mereka</h2>
                        <p className="text-dark-500 mb-16 text-sm">Pengalaman klien membangun bersama kami</p>

                        {loadingTesti ? (
                            <p className="text-center py-8 text-dark-400">Memuat testimoni...</p>
                        ) : (
                            <TestimonialCarousel testimonials={testimonials} />
                        )}
                    </ScrollReveal>

                    <ScrollReveal variant="scaleUp" className="bg-[#396680] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#396680]/20 transition-all duration-500 hover:scale-[1.01]">
                        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative tracking-tight">Mulai Bangun Mimpimu Sekarang</h2>
                        <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg relative leading-relaxed">
                            Konsultasikan rencana {activeTab === 'konstruksi' ? 'pembangunan atau renovasi' : activeTab === 'desain' ? 'desain arsitektur atau interior' : 'desain interior atau furnitur kustom'} Anda dengan tim ahli kami secara gratis.
                        </p>
                        <div className="relative">
                            <WhatsAppButton label="Konsultasi Gratis via WhatsApp" size="lg" variant="white" />
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-zoom-out"
                    onClick={() => setLightboxImage(null)}
                    onKeyDown={(e) => e.key === 'Escape' && setLightboxImage(null)}
                    tabIndex={0}
                    ref={(el) => el && el.focus()}
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors z-10"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={lightboxImage.src}
                        alt={lightboxImage.alt}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-4 py-2 rounded-full">{lightboxImage.alt}</p>
                </div>
            )}
        </div>
    )
}

export default Layanan

