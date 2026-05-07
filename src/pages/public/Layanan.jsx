import { useState, useEffect } from 'react'
import { getApprovedTestimonials } from '../../services/testimonialService'
import { Link, useSearchParams } from 'react-router-dom'
import { FaHome, FaWrench, FaBuilding, FaChevronRight, FaQuoteRight, FaCouch, FaPaintBrush, FaSearch, FaTools, FaHardHat, FaHandshake, FaDraftingCompass, FaCubes, FaClipboardCheck, FaCheckCircle, FaStar } from 'react-icons/fa'
import WhatsAppButton from '../../components/WhatsAppButton'
import ShinyText from '../../components/ui/ShinyText'
import Stepper, { Step } from '../../components/ui/Stepper'

import konstruksiHero from '../../assets/images/konstruksi_hero_1772961128913.png'
import galleryArch1 from '../../assets/images/gallery_architecture_1_1772961143405.png'
import galleryInt1 from '../../assets/images/gallery_interior_1_1772961158421.png'
import galleryArch2 from '../../assets/images/gallery_architecture_2_1772961174580.png'
import galleryInt2 from '../../assets/images/gallery_interior_2_1772961189672.png'
import avatar1 from '../../assets/images/avatar_testi_1_1772961205686.png'
import avatar2 from '../../assets/images/avatar_testi_2_1772961220122.png'
import avatar3 from '../../assets/images/avatar_testi_3_1772961238354.png'
import designBuildHero from '../../assets/images/design_build_hero_1772964545081.png'

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
                    icon: <FaHome className="text-xl text-[#658797]" />,
                    link: '/kontak'
                },
                {
                    title: 'Konstruksi Komersial',
                    desc: 'Layanan Konstruksi Komersial kami berfokus pada penyediaan solusi bangunan yang berkualitas tinggi, efisien, dan berkelanjutan bagi berbagai bisnis dan ruang komersial. Kami memahami bahwa lingkungan komersial yang dirancang dengan baik sangat penting bagi efisiensi operasional, citra merek (brand image), serta kepuasan pelanggan.',
                    icon: <FaBuilding className="text-xl text-[#658797]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi & Survey',
                    description: 'Diskusi awal kebutuhan Anda dan survey lokasi untuk pemetaan awal yang sangat presisi sesuai regulasi.',
                    icon: <FaSearch />,
                    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 01 : INISIASI',
                    buttonText: 'Mulai Konsultasi',
                    subIcon1: <FaSearch className="text-[#658797]" />,
                    subText1: 'Survey Lokasi',
                    subIcon2: <FaCheckCircle className="text-[#658797]" />,
                    subText2: 'Analisa Awal'
                },
                {
                    step: 2,
                    title: 'Desain Arsitektur',
                    description: 'Pembuatan desain perancangan awal 3D dan Rencana Anggaran Biaya yang transparan secara menyeluruh.',
                    icon: <FaDraftingCompass />,
                    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 02 : DESAIN',
                    buttonText: 'Lihat Desain',
                    subIcon1: <FaDraftingCompass className="text-[#658797]" />,
                    subText1: 'Perancangan 3D',
                    subIcon2: <FaClipboardCheck className="text-[#658797]" />,
                    subText2: 'Review RAB'
                },
                {
                    step: 3,
                    title: 'Penandatanganan',
                    description: 'Kesepakatan final atas desain, timeline penyelesaian, dan biaya pekerjaan konstruksi secara tertulis hitam di atas putih.',
                    icon: <FaHandshake />,
                    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 03 : KESEPAKATAN',
                    buttonText: 'Draft Kontrak',
                    subIcon1: <FaHandshake className="text-[#658797]" />,
                    subText1: 'Legalitas',
                    subIcon2: <FaClipboardCheck className="text-[#658797]" />,
                    subText2: 'MOU Final'
                },
                {
                    step: 4,
                    title: 'Proses Konstruksi',
                    description: 'Eksekusi fisik pembangunan di lapangan dengan pengawasan ketat dan laporan progres berkala melalui sistem yang transparan.',
                    icon: <FaHardHat />,
                    image: 'https://images.unsplash.com/photo-1541888081622-152e00780f2d?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 04 : EKSEKUSI',
                    buttonText: 'Pantau Proyek',
                    subIcon1: <FaHardHat className="text-[#658797]" />,
                    subText1: 'Sipil Aktif',
                    subIcon2: <FaCheckCircle className="text-[#658797]" />,
                    subText2: 'Laporan Berkala'
                },
                {
                    step: 5,
                    title: 'Serah Terima Kunci',
                    description: 'Inspeksi final bersama dan penyerahan bangunan siap huni beserta dokumen retensi dan garansi pemeliharaan struktur.',
                    icon: <FaHome />,
                    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop',
                    badge: 'PHASE 05 : FINAL',
                    buttonText: 'Hubungi Kami',
                    subIcon1: <FaHome className="text-[#658797]" />,
                    subText1: 'Handover',
                    subIcon2: <FaCheckCircle className="text-[#658797]" />,
                    subText2: 'Garansi Kualitas'
                }
            ]
        },
        'design-build': {
            badge: "DESAIN & INTERIOR EKSKLUSIF",
            title: "Design and Build",
            desc: "Layanan Design and Build kami menyediakan solusi  terintegrasi bagi klien yang ingin mentransformasikan visi hunian mereka menjadi kenyataan tanpa kerumitan.",
            heroImage: designBuildHero,
            heroTitle: "Luxury Residence Kitchen",
            heroSub: "BSD City, 2024",
            services: [
                {
                    title: 'Interior Design',
                    desc: 'Layanan ini berfokus pada pengoptimalan fungsi dan estetika ruang di dalam bangunan untuk meningkatkan kualitas hidup serta kenyamanan penghuninya.',
                    icon: <FaPaintBrush className="text-xl text-[#658797]" />,
                    link: '/kontak'
                },
                {
                    title: 'Outdoor Area Design',
                    desc: 'Layanan ini berfokus pada transformasi area terbuka di sekitar bangunan agar menjadi ruang yang fungsional dan memiliki nilai tambah bagi properti.',
                    icon: <FaHome className="text-xl text-[#658797]" />,
                    link: '/kontak'
                }
            ],
            roadmap: [
                {
                    step: 1,
                    title: 'Konsultasi Briefing',
                    description: 'Penggalian ide secara detail, gaya desain yang diinginkan pelanggan, serta pengukuran ruang di awal secara spesifik.',
                    icon: <FaSearch />,
                    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 01 : PENGGALIAN',
                    buttonText: 'Jadwalkan Sesi',
                    subIcon1: <FaSearch className="text-[#658797]" />,
                    subText1: 'Brainstorming',
                    subIcon2: <FaCheckCircle className="text-[#658797]" />,
                    subText2: 'Pengukuran'
                },
                {
                    step: 2,
                    title: 'Desain & Material',
                    description: 'Presentasi visualisasi 3D fotorealistik lengkap dengan referensi serta pemilihan sampel material fisik yang diaplikasikan.',
                    icon: <FaCubes />,
                    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 02 : VISUALISASI',
                    buttonText: 'Lihat Katalog',
                    subIcon1: <FaPaintBrush className="text-[#658797]" />,
                    subText1: 'Moodboard',
                    subIcon2: <FaCubes className="text-[#658797]" />,
                    subText2: 'Sample Fisik'
                },
                {
                    step: 3,
                    title: 'Tinjau Anggaran',
                    description: 'Finalisasi ruang lingkup pekerjaan interior agar tetap linear dengan bujet Anda, yang selanjutnya diakhiri kontrak.',
                    icon: <FaHandshake />,
                    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 03 : KESEPAKATAN',
                    buttonText: 'Atur Anggaran',
                    subIcon1: <FaTools className="text-[#658797]" />,
                    subText1: 'Optimasi Biaya',
                    subIcon2: <FaCheckCircle className="text-[#658797]" />,
                    subText2: 'Approval'
                },
                {
                    step: 4,
                    title: 'Pabrikasi & Instalasi',
                    description: 'Pabrikasi custom furniture di workshop kami untuk menghemat waktu, dilanjutkan instalasi final di panel lokasi.',
                    icon: <FaWrench />,
                    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 04 : PRODUKSI',
                    buttonText: 'Pantau Proyek',
                    subIcon1: <FaWrench className="text-[#658797]" />,
                    subText1: 'Workshop',
                    subIcon2: <FaHardHat className="text-[#658797]" />,
                    subText2: 'Fitting Akhir'
                },
                {
                    step: 5,
                    title: 'Final Inspection',
                    description: 'Pengecekan dan finishing setiap detail akhir sebelum kami melaksanakan serah terima kepemilikan hasil karya.',
                    icon: <FaClipboardCheck />,
                    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
                    badge: 'TAHAP 05 : SERAH TERIMA',
                    buttonText: 'Cek Lokasi',
                    subIcon1: <FaClipboardCheck className="text-[#658797]" />,
                    subText1: 'Defect Audit',
                    subIcon2: <FaHome className="text-[#658797]" />,
                    subText2: 'Masa Pemeliharaan'
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
            project: 'Desain & Build Dapur, Bekasi',
            image: avatar2,
            rating: 5,
            testimonialText: '"Awalnya ragu renovasi total, tapi tim Bangunanmu meyakinkan dengan desain 3D yang detail. Hasil akhirnya persis seperti di gambar!"'
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
                    <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-dark-900 border border-dark-800 shadow-lg">
                        <ShinyText text={currentContent.badge} speed={3} className="text-[10px] font-bold uppercase tracking-widest" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6 tracking-tight">{currentContent.title}</h1>
                    <p className="text-dark-500 max-w-2xl mx-auto leading-relaxed text-lg">
                        {currentContent.desc}
                    </p>
                </div>
            </section>

            <div className="section-container pb-24">

                <div className="space-y-24">

                    <div className="relative h-[450px] md:h-[550px] w-full rounded-[40px] overflow-hidden shadow-2xl group">
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
                    </div>

                    <div className={`grid grid-cols-1 ${currentContent.services.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8`}>
                        {currentContent.services.map((card, i) => (
                            <div key={i} className="bg-white p-10 rounded-[40px] border border-dark-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
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
                                    Lihat Detail <FaChevronRight className="text-[10px]" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    <section className="pt-24 pb-12 bg-white -mx-4 px-4 sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
                        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
                            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-dark-50 border border-dark-100 shadow-sm rounded-full mb-6 relative">
                                <ShinyText
                                    text="Roadmap Pelayanan"
                                    theme="dark"
                                    speed={3}
                                    className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase"
                                />
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-2">
                                <span className="text-dark-900 drop-shadow-sm">Tahapan Kerja</span><br />
                                <span className="text-[#658797]">{activeTab === 'konstruksi' ? 'Konstruksi & Sipil' : 'Interior & Furnitur'}</span>
                            </h2>
                        </div>

                        <div className="w-full lg:max-w-6xl mx-auto">
                            <Stepper
                                initialStep={1}
                                onStepChange={(step) => { console.log(step); }}
                                onFinalStepCompleted={() => console.log("All steps completed!")}
                                backButtonText="Sebelumnya"
                                nextButtonText="Selanjutnya"
                                stepCircleContainerClassName="scale-90 md:scale-100"
                                contentClassName="mt-4"
                                renderStepIndicator={({ step, isActive, isCompleted }) => {
                                    const item = currentContent.roadmap[step - 1];
                                    return (
                                        <div className="flex flex-col items-center justify-center relative">
                                            <div className="text-sm md:text-base">
                                                {item.icon}
                                            </div>
                                            <div className={`absolute top-full mt-4 md:mt-5 w-[55px] sm:w-[80px] md:w-max text-center ${isActive || isCompleted ? 'text-dark-900 font-bold' : 'text-dark-300 font-medium md:font-bold'} text-[6.5px] sm:text-[8px] md:text-[10px] uppercase tracking-wider md:tracking-widest leading-[1.2] break-words`}>
                                                {item.title}
                                            </div>
                                        </div>
                                    );
                                }}
                            >
                                {currentContent.roadmap.map((item, index) => (
                                    <Step key={index}>
                                        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
                                            <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[450px]">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-6 left-6 inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                                    <ShinyText text={item.badge} speed={3} className="text-[10px] font-bold tracking-widest uppercase" />
                                                </div>
                                            </div>
                                            <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                                                <h3 className="text-3xl font-bold text-dark-900 mb-4 tracking-tight">{item.title}</h3>
                                                <p className="text-dark-500 text-base leading-relaxed mb-8 font-medium">
                                                    {item.description}
                                                </p>

                                                <div className="flex flex-wrap gap-4 mb-10">
                                                    {item.buttonText === 'Lihat Katalog' ? (
                                                        <a href="#galeri-proyek" className="inline-flex px-8 py-3.5 bg-[#658797] text-white font-bold rounded-full shadow-md hover:bg-[#527181] transition-all transform hover:-translate-y-0.5">
                                                            {item.buttonText}
                                                        </a>
                                                    ) : (
                                                        <Link to="/kontak" className="inline-flex px-8 py-3.5 bg-[#658797] text-white font-bold rounded-full shadow-md hover:bg-[#527181] transition-all transform hover:-translate-y-0.5">
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
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    </section>

                    <section id="galeri-proyek" className="pt-12 scroll-mt-24">
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
                                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                                        <span className="text-[10px] font-bold text-dark-900">Interior Renovation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="pt-12 text-center">
                        <h2 className="text-3xl font-bold text-dark-900 mb-2">Kata Mereka</h2>
                        <p className="text-dark-500 mb-16 text-sm">Pengalaman klien membangun bersama kami</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {loadingTesti ? (
                                <p className="text-center col-span-1 md:col-span-3 py-8 text-dark-400">Memuat testimoni...</p>
                            ) : testimonials.slice(0, 3).map((testi, i) => (
                                <div key={i} className="bg-white p-10 rounded-[40px] border border-dark-100 shadow-sm relative text-left h-full flex flex-col">
                                    <FaQuoteRight className="absolute top-10 right-10 text-dark-100 text-3xl" />
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={testi.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testi.name)}&background=658797&color=fff&rounded=true&bold=true`} alt={testi.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-[#F0F4F8] shadow-sm" />
                                        <div>
                                            <h4 className="font-bold text-dark-900 text-sm mb-1">{testi.name}</h4>
                                            <div className="flex items-center gap-1 mb-1.5">
                                                {[...Array(5)].map((_, starIndex) => (
                                                    <FaStar key={starIndex} className={`text-[11px] sm:text-xs ${starIndex < (testi.rating || 5) ? 'text-yellow-400' : 'text-dark-100'}`} />
                                                ))}
                                            </div>
                                            <p className="text-dark-400 text-[10px] sm:text-[11px] font-medium leading-tight">{testi.project || testi.role || 'Klien Bangunanmu'}</p>
                                        </div>
                                    </div>
                                    <p className="text-dark-600 text-sm italic leading-relaxed flex-1">
                                        "{testi.testimonialText || testi.review || testi.text}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="bg-[#658797] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#658797]/20 transition-all duration-500 hover:scale-[1.01]">
                        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative tracking-tight">Mulai Bangun Mimpimu Sekarang</h2>
                        <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg relative leading-relaxed">
                            Konsultasikan rencana {activeTab === 'konstruksi' ? 'pembangunan atau renovasi' : 'desain interior atau furnitur kustom'} Anda dengan tim ahli kami secara gratis.
                        </p>
                        <div className="relative">
                            <WhatsAppButton label="Konsultasi Gratis via WhatsApp" size="lg" variant="white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layanan

