import { useState, useEffect, useRef, useCallback } from 'react'
import { getApprovedTestimonials } from '../../services/testimonialService'
import { Link, useSearchParams } from 'react-router-dom'
import { Home, Wrench, Building2, ChevronRight, ChevronLeft, Quote, Armchair, Paintbrush, Search, Hammer, HardHat, Handshake, Compass, Box, ClipboardCheck, CheckCircle2, Star } from 'lucide-react'
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

const TestimonialCarousel = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const autoPlayRef = useRef(null)

    // Cards visible: 1 on mobile, 3 on desktop
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
                            className={`rounded-full transition-all duration-300 ${
                                i === currentIndex
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
                <p className="text-dark-400 text-[10px] sm:text-[11px] font-medium leading-tight">{testi.company || testi.project || testi.role || 'Klien Bangunanmu'}</p>
            </div>
        </div>
        <p className="text-dark-600 text-sm leading-relaxed flex-1">
            {testi.testimonialText || testi.review || testi.text}
        </p>
    </div>
)

const Layanan = () => {
    const [searchParams] = useSearchParams()
    const activeTab = searchParams.get('tab') || 'konstruksi'

    const contents = {
        'konstruksi': {
            badge: "SOLUSI KONSTRUKSI TERPERCAYA",
            title: "Layanan Konstruksi",
            desc: "Wujudkan hunian impian dengan standar kualitas terbaik, transparansi biaya, dan tim profesional yang siap membantu dari awal hingga akhir.",
            heroImage: konstruksiHero,
            heroTitle: "Proyek Cluster Harmony",
            heroSub: "Jakarta Selatan, 2023",
            services: [
                {
                    title: 'Konstruksi Residensial/Perumahan',
                    desc: 'Tujuan kami adalah menciptakan hunian yang tidak hanya indah secara estetika, tetapi juga kokoh dan fungsional, guna menjamin kenyamanan serta kepuasan bagi penghuninya dalam jangka panjang. Melalui layanan Konstruksi Residensial kami, Anda dapat memercayakan kami untuk membangun ruang yang benar-benar terasa seperti rumah idaman.',
                    icon: <Home size={20} className="text-[#396680]" />,
                    link: '/kontak'
                },
                {
                    title: 'Konstruksi Komersial',
                    desc: 'Layanan Konstruksi Komersial kami berfokus pada penyediaan solusi bangunan yang berkualitas tinggi, efisien, dan berkelanjutan bagi berbagai bisnis dan ruang komersial. Kami memahami bahwa lingkungan komersial yang dirancang dengan baik sangat penting bagi efisiensi operasional, citra merek (brand image), serta kepuasan pelanggan.',
                    icon: <Building2 size={20} className="text-[#396680]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi & Survey',
                    shortTitle: 'Konsultasi',
                    description: 'Diskusi awal kebutuhan Anda dan survey lokasi untuk pemetaan awal yang sangat presisi sesuai regulasi.',
                    icon: <Search />,
                    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 01 : INISIASI',
                    buttonText: 'Mulai Konsultasi',
                    subIcon1: <Search size={16} className="text-[#396680]" />,
                    subText1: 'Survey Lokasi',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Analisa Awal'
                },
                {
                    step: 2,
                    title: 'Penandatanganan',
                    shortTitle: 'Kontrak',
                    description: 'Kesepakatan final atas RAB, timeline penyelesaian, dan biaya pekerjaan konstruksi secara tertulis hitam di atas putih.',
                    icon: <Handshake />,
                    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 02 : KESEPAKATAN',
                    buttonText: 'Draft Kontrak',
                    subIcon1: <Handshake size={16} className="text-[#396680]" />,
                    subText1: 'Legalitas',
                    subIcon2: <ClipboardCheck size={16} className="text-[#396680]" />,
                    subText2: 'MOU Final'
                },
                {
                    step: 3,
                    title: 'Proses Konstruksi',
                    shortTitle: 'Konstruksi',
                    description: 'Eksekusi fisik pembangunan di lapangan dengan pengawasan ketat dan laporan progres berkala melalui sistem yang transparan.',
                    icon: <HardHat />,
                    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 03 : EKSEKUSI',
                    buttonText: 'Pantau Proyek',
                    subIcon1: <HardHat size={16} className="text-[#396680]" />,
                    subText1: 'Sipil Aktif',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Laporan Berkala'
                },
                {
                    step: 4,
                    title: 'Serah Terima Kunci',
                    shortTitle: 'Serah Terima',
                    description: 'Inspeksi final bersama dan penyerahan bangunan siap huni beserta dokumen retensi dan garansi pemeliharaan struktur.',
                    icon: <Home />,
                    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 04 : FINAL',
                    buttonText: 'Hubungi Kami',
                    subIcon1: <Home size={16} className="text-[#396680]" />,
                    subText1: 'Handover',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Garansi Kualitas'
                }
            ]
        },
        'design-build': {
            badge: "Rancang Bangun",
            title: "Desain & Bangun",
            desc: "Layanan Desain & Bangun kami menyediakan solusi  terintegrasi bagi klien yang ingin mentransformasikan visi hunian mereka menjadi kenyataan tanpa kerumitan.",
            heroImage: designBuildHero,
            heroTitle: "Luxury Residence Kitchen",
            heroSub: "BSD City, 2024",
            services: [
                {
                    title: 'Desain & Konstruksi Rumah',
                    desc: 'Layanan lengkap mulai dari perancangan desain arsitektur hingga pembangunan fisik rumah impian Anda dalam satu paket terintegrasi.',
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
                    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1200&auto=format&fit=crop',
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
                    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1200&auto=format&fit=crop',
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
                    description: 'Finalisasi ruang lingkup pekerjaan interior agar tetap linear dengan bujet Anda, yang selanjutnya diakhiri kontrak.',
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
                    title: 'Final Inspection',
                    shortTitle: 'Final',
                    description: 'Pengecekan dan finishing setiap detail akhir sebelum kami melaksanakan serah terima kepemilikan hasil karya.',
                    icon: <ClipboardCheck />,
                    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 04 : SERAH TERIMA',
                    buttonText: 'Cek Lokasi',
                    subIcon1: <ClipboardCheck size={16} className="text-[#396680]" />,
                    subText1: 'Defect Audit',
                    subIcon2: <Home size={16} className="text-[#396680]" />,
                    subText2: 'Masa Pemeliharaan'
                }
            ]
        },
        'desain': {
            badge: "DESAIN ARSITEKTUR & INTERIOR",
            title: "Desain Arsitektur",
            desc: "Wujudkan konsep bangunan impian Anda melalui visualisasi 3D yang realistis dan perencanaan detail arsitektur maupun interior sebelum proses konstruksi dimulai.",
            heroImage: galleryArch2,
            heroTitle: "Modern Minimalist Blueprint",
            heroSub: "Perencanaan Design, 2024",
            services: [
                {
                    title: 'Desain Arsitektur',
                    desc: 'Layanan ini berfokus pada perencanaan struktur, fasad, dan tata letak ruang secara komprehensif, menghasilkan gambar kerja (DED) yang siap diaplikasikan di lapangan.',
                    icon: <Compass size={20} className="text-[#396680]" />,
                    link: '/kontak'
                },
                {
                    title: 'Design Interior',
                    desc: 'Layanan yang merancang estetika dan fungsionalitas ruang dalam, dari pemilihan palet warna hingga penentuan furnitur, untuk menciptakan harmoni visual.',
                    icon: <Paintbrush size={20} className="text-[#396680]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi & Konsep',
                    description: 'Diskusi awal untuk memahami kebutuhan spesifik, preferensi gaya, dan penentuan konsep design yang sesuai dengan anggaran Anda.',
                    icon: <Search />,
                    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1200&auto=format&fit=crop',
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
                    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1200&auto=format&fit=crop',
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
                    description: 'Pembuatan Rencana Anggaran Biaya (RAB) yang terperinci dan transparan berdasarkan design yang telah disetujui.',
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
                    description: 'Penyerahan dokumen Detail Engineering Design (DED) lengkap yang siap digunakan sebagai panduan pelaksanaan konstruksi.',
                    icon: <Wrench />,
                    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 05 : HANDOVER',
                    buttonText: 'Siap Bangun',
                    subIcon1: <Wrench size={16} className="text-[#396680]" />,
                    subText1: 'Dokumen DED',
                    subIcon2: <CheckCircle2 size={16} className="text-[#396680]" />,
                    subText2: 'Cetak Biru'
                }
            ]
        }
    }

    const currentContent = contents[activeTab] || contents['konstruksi']

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
                    <p className="text-dark-500 max-w-2xl mx-auto leading-relaxed text-lg">
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
                                <p className="text-dark-500 text-sm leading-relaxed mb-8">
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
                                    {activeTab === 'konstruksi' ? 'Konstruksi' : activeTab === 'desain' ? 'Desain Arsitektur' : 'Desain & Bangun'}
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
                                                <p className="text-dark-500 text-sm sm:text-base leading-relaxed mb-4 sm:mb-8 font-medium">
                                                    {item.description}
                                                </p>

                                                <div className="flex flex-wrap gap-4 mb-10">
                                                    {item.buttonText === 'Lihat Katalog' || item.buttonText === 'Cek Portofolio' || item.buttonText === 'Lihat Detail' || item.buttonText === 'Lihat Design' ? (
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
                                                    <div className="flex items-center gap-2 text-dark-500">
                                                        {item.subIcon1}
                                                        <span className="text-xs font-bold tracking-wider uppercase">{item.subText1}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-dark-500">
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

                            <div className="rounded-[40px] overflow-hidden shadow-lg h-[400px] lg:h-full">
                                <img src={galleryArch1} alt="Project 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>

                            <div className="flex flex-col gap-8 h-full">
                                <div className="grid grid-cols-2 gap-8 flex-1">
                                    <div className="rounded-[40px] overflow-hidden shadow-lg">
                                        <img src={galleryInt1} alt="Project 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="rounded-[40px] overflow-hidden shadow-lg">
                                        <img src={galleryArch2} alt="Project 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="relative rounded-[40px] overflow-hidden shadow-lg h-[300px]">
                                    <img src={galleryInt2} alt="Project 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
        </div>
    )
}

export default Layanan

