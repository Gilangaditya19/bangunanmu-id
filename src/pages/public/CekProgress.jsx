import { useState } from 'react';
import { FaSearch, FaCheckCircle, FaRegCircle, FaBuilding, FaDraftingCompass, FaCubes, FaWrench, FaMapMarkerAlt, FaArrowRight, FaUser, FaStar, FaTimes } from 'react-icons/fa';

import siteUpdate1 from '../../assets/images/gallery_architecture_1_1772961143405.png';
import siteUpdate2 from '../../assets/images/gallery_architecture_2_1772961174580.png';
import siteUpdate3 from '../../assets/images/gallery_interior_1_1772961158421.png';

const CekProgress = () => {
    const [searchId, setSearchId] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const mockProjectData = {
        id: 'BGN-2023-X',
        status: 'SELESAI',
        title: 'Modern Villa - Jakarta Selatan',
        client: 'Bapak Ahmad',
        address: 'Jalan Kemang Raya No. 12, Jakarta Selatan',
        overallProgress: 100,
        timeline: [
            {
                id: 'stage-1',
                title: 'Perencanaan & Desain',
                status: 'completed', 
                date: 'Selesai pada 10 Jan 2024',
                icon: <FaDraftingCompass />,
                description: 'Cetak biru final disetujui. Render 3D difinalisasi.'
            },
            {
                id: 'stage-2',
                title: 'Pekerjaan Struktural',
                status: 'completed',
                date: 'Selesai pada 20 Feb 2024',
                icon: <FaBuilding />,
                description: ''
            },
            {
                id: 'stage-3',
                title: 'Instalasi MEP',
                status: 'in-progress',
                date: 'Estimasi selesai: 15 Mar 2024',
                icon: <FaWrench />,
                tasks: [
                    { name: 'Pemasangan pipa kasar', completed: true },
                    { name: 'Kabel listrik (Lantai Dasar)', completed: true },
                    { name: 'Saluran HVAC', completed: false }
                ]
            },
            {
                id: 'stage-4',
                title: 'Penyelesaian (Finishing)',
                status: 'upcoming',
                date: 'Dijadwalkan untuk April 2024',
                icon: <FaCubes />,
                description: ''
            }
        ],
        siteUpdates: [
            { id: 1, image: siteUpdate1, date: 'Hari ini, 10:30', title: 'Pemasangan Kabel Ruang A' },
            { id: 2, image: siteUpdate2, date: 'Kemarin', title: 'Pengecekan Saluran Air' },
            { id: 3, image: siteUpdate3, date: '28 Feb', title: 'Struktur Selesai' }
        ]
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            
            setTimeout(() => {
                setIsTracking(true);
            }, 500);
        }
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans">
            
            <section className="bg-[#658797] pt-24 pb-20 px-4 relative overflow-hidden border-b border-dark-100">
                
                <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Lacak Proyek Impian Anda
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Pembaruan real-time pada proyek konstruksi atau interior Anda. Masukkan ID Proyek unik Anda di bawah ini untuk memulai.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-dark-400 group-focus-within:text-[#658797] transition-colors z-20">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="BGN-2023-X"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="w-full py-4 pl-14 pr-32 rounded-full border-2 border-white/20 bg-white shadow-xl focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 transition-all font-medium text-lg placeholder-dark-300 relative z-10"
                        />
                        <button
                            type="submit"
                            className="absolute inset-y-2 right-2 px-8 bg-[#658797] hover:bg-[#527181] text-white font-bold rounded-full transition-colors shadow-md z-20"
                        >
                            Lacak
                        </button>
                    </form>
                </div>
            </section>

            {isTracking && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-fadeInUp">

                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-dark-100 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-auto">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {mockProjectData.status}
                                </span>
                                <span className="text-dark-400 text-sm font-medium">ID: {mockProjectData.id}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-3">{mockProjectData.title}</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-dark-500 font-medium">
                                <p className="flex items-center gap-2">
                                    <FaUser className="text-[#658797] opacity-80" />
                                    {mockProjectData.client}
                                </p>
                                <div className="hidden sm:block w-px h-4 bg-dark-200"></div>
                                <p className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#658797] opacity-80" />
                                    {mockProjectData.address}
                                </p>
                            </div>
                        </div>
                        <div className="md:text-right flex flex-col items-start md:items-end">
                            <p className="text-dark-500 text-sm font-medium mb-2">Total Progres</p>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-5xl font-extrabold text-[#658797] leading-none tracking-tighter">
                                    {mockProjectData.overallProgress}%
                                </span>
                            </div>
                            <div className="w-full md:w-48 h-2.5 bg-dark-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#658797] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${mockProjectData.overallProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {mockProjectData.status === 'SELESAI' && !reviewSuccess && (
                        <div className="bg-gradient-to-r from-yellow-50 to-[#FAFAFA] rounded-[2rem] p-8 md:p-10 shadow-sm border border-yellow-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 transform transition-all hover:shadow-md">
                            <div>
                                <div className="flex items-center gap-2 text-yellow-500 mb-2 text-xl">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-2">Proyek Telah Selesai!</h3>
                                <p className="text-dark-500 font-medium">Bagaimana pengalaman Anda membangun bersama tim Bangunanmu.id?</p>
                            </div>
                            <button onClick={() => setShowReviewModal(true)} className="px-8 py-4 bg-dark-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg flex-shrink-0">
                                Berikan Ulasan Proyek
                            </button>
                        </div>
                    )}

                    {reviewSuccess && (
                        <div className="bg-green-50 rounded-[2rem] p-8 md:p-10 shadow-sm border border-green-200 mb-10 text-center animate-fadeIn flex flex-col items-center">
                            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-2">Terima Kasih atas Ulasan Anda!</h3>
                            <p className="text-dark-600 font-medium max-w-lg">Ulasan Anda sangat berarti bagi kami dan telah berhasil diteruskan ke tim manajemen. Senang bisa bekerjasama dengan Anda.</p>
                        </div>
                    )}

                    <div className="mb-10 lg:mb-16 w-full">
                        
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-dark-100">
                            <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-8 px-2">Status Saat Ini</h3>
                            
                            <div className="relative pl-4 md:pl-8">
                                
                                <div className="absolute top-8 bottom-8 left-[35px] md:left-[51px] w-0.5 bg-dark-100"></div>
                                
                                <div 
                                    className="absolute top-8 left-[35px] md:left-[51px] w-0.5 bg-[#658797]"
                                    style={{ height: 'calc(50% + 2rem)' }} 
                                ></div>

                                <div className="space-y-12">
                                    {mockProjectData.timeline.map((stage) => {
                                        const isCompleted = stage.status === 'completed';
                                        const isInProgress = stage.status === 'in-progress';
                                        const isUpcoming = stage.status === 'upcoming';

                                        return (
                                            <div key={stage.id} className={`relative flex gap-6 md:gap-8 ${isUpcoming ? 'opacity-50' : ''}`}>
                                                
                                                <div className="relative z-10 flex-shrink-0">
                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-sm border-4 border-white
                                                        ${isCompleted ? 'bg-[#658797] text-white' : ''}
                                                        ${isInProgress ? 'bg-white border-2 border-[#658797] text-[#658797] shadow-md' : ''}
                                                        ${isUpcoming ? 'bg-dark-100 text-dark-400' : ''}
                                                    `}>
                                                        {stage.icon}
                                                    </div>
                                                </div>

                                                <div className={`flex-1 pt-3 ${isInProgress ? '' : 'pb-4'}`}>
                                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                                        <h4 className={`text-lg font-bold ${isUpcoming ? 'text-dark-400' : 'text-dark-900'}`}>
                                                            {stage.title}
                                                        </h4>
                                                        {isInProgress && (
                                                            <span className="px-2.5 py-0.5 bg-dark-100 text-dark-600 text-[10px] font-bold rounded-sm uppercase tracking-wide">
                                                                Sedang Berjalan
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-dark-400 text-xs font-medium mb-3">{stage.date}</p>
                                                    
                                                    {stage.description && (
                                                        <div className="bg-white px-5 py-3 rounded-xl border border-dark-100 text-sm text-dark-600 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] inline-block">
                                                            {stage.description}
                                                        </div>
                                                    )}

                                                    {isInProgress && stage.tasks && (
                                                        <div className="mt-4 space-y-2.5">
                                                            {stage.tasks.map((task, idx) => (
                                                                <div key={idx} className="flex items-start gap-3">
                                                                    {task.completed ? (
                                                                        <FaCheckCircle className="text-green-500 mt-0.5 text-sm flex-shrink-0" />
                                                                    ) : (
                                                                        <FaRegCircle className="text-dark-300 mt-0.5 text-sm flex-shrink-0" />
                                                                    )}
                                                                    <span className={`text-sm ${task.completed ? 'text-dark-900 font-medium' : 'text-dark-500 italic'}`}>
                                                                        {task.name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className="text-xl font-bold text-dark-900">Pembaruan Lapangan</h3>
                            <button className="text-sm font-semibold text-dark-500 hover:text-dark-900 flex items-center gap-1 transition-colors">
                                Lihat Semua <FaArrowRight className="text-xs" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {mockProjectData.siteUpdates.map((update) => (
                                <div key={update.id} className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-sm">
                                    <img src={update.image} alt={update.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1">{update.date}</p>
                                        <h4 className="font-bold text-sm md:text-base leading-tight">{update.title}</h4>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-dark-50 border-2 border-dashed border-dark-200 hover:border-[#658797] flex flex-col items-center justify-center cursor-pointer transition-colors group shadow-sm">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-dark-400 group-hover:text-[#658797] group-hover:scale-110 transition-all mb-3 text-xl">
                                    <FaSearch />
                                </div>
                                <span className="font-bold text-dark-900 text-sm">Lihat Galeri</span>
                                <span className="text-xs text-dark-400 font-medium">+24 foto</span>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {showReviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-dark-100">
                        <div className="p-6 border-b border-[#527181] flex items-center justify-between bg-[#658797] text-white">
                            <h2 className="text-xl font-bold tracking-tight">Kirimkan Ulasan</h2>
                            <button onClick={() => setShowReviewModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-8 bg-[#FAFAFA]">
                            <div className="text-center mb-8 bg-white p-6 rounded-2xl border border-dark-100 shadow-sm">
                                <p className="text-dark-500 font-bold mb-4 uppercase tracking-widest text-[#658797] text-xs">Rating Kepuasan</p>
                                <div className="flex justify-center gap-3 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} onClick={() => setRating(star)} className={`text-4xl transition-all duration-300 hover:scale-125 ${rating >= star ? 'text-yellow-400 drop-shadow-md' : 'text-dark-100'}`}>
                                            <FaStar />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-6 bg-white p-6 rounded-2xl border border-dark-100 shadow-sm">
                                <label className="block text-xs font-bold text-dark-500 mb-3 uppercase tracking-widest text-[#658797]">Ceritakan Pengalaman Anda</label>
                                <textarea rows="4" placeholder="Kualitas pekerjaannya sangat rapi, timnya profesional, dan selesai tepat waktu..." className="w-full px-5 py-4 rounded-xl border border-dark-200 bg-dark-50 focus:bg-white focus:ring-2 focus:ring-[#658797] focus:outline-none resize-none transition-colors text-dark-900"></textarea>
                            </div>
                            
                            <div className="mb-8">
                                <label className="flex items-start gap-4 cursor-pointer group bg-white p-5 rounded-2xl border border-dark-100 shadow-sm hover:border-[#658797] transition-colors">
                                    <div className="mt-0.5">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-[#658797] rounded-md border-dark-300 focus:ring-[#658797] cursor-pointer" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-dark-900 mb-0.5 group-hover:text-[#658797] transition-colors">Izinkan kami menampilkannya</p>
                                        <p className="text-xs text-dark-500">Gunakan nama <strong>"{mockProjectData.client}"</strong> sebagai identitas ulasan yang mungkin ditampilkan di beranda situs kami.</p>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setShowReviewModal(false)} className="flex-1 py-4 bg-white border border-dark-200 hover:bg-dark-50 text-dark-900 font-bold rounded-xl transition-colors">Batal</button>
                                <button onClick={() => {
                                    setShowReviewModal(false);
                                    setReviewSuccess(true);
                                }} className="flex-1 py-4 bg-[#658797] hover:bg-[#527181] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">Kirim Ulasan</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CekProgress;
