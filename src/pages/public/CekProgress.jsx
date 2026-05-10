import { useState } from 'react';
import { Search, CheckCircle2, Circle, Building2, Compass, Box, Wrench, MapPin, ArrowRight, User, Star, X, Loader2, HardHat, Layers, Home, Plug2, PaintRoller, Key, Hammer } from 'lucide-react';
import api from '../../services/api';

import siteUpdate1 from '../../assets/images/gallery_architecture_1_1772961143405.png';
import siteUpdate2 from '../../assets/images/gallery_architecture_2_1772961174580.png';
import siteUpdate3 from '../../assets/images/gallery_interior_1_1772961158421.png';

const CekProgress = () => {
    const [searchId, setSearchId] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [projectData, setProjectData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [showGallery, setShowGallery] = useState(false);

    const getStatusBadge = (status) => {
        const statuses = {
            pending: 'MENUNGGU',
            in_progress: 'BERJALAN',
            completed: 'SELESAI',
            cancelled: 'DIBATALKAN'
        };
        return statuses[status] || status;
    };

    const getMilestoneIcon = (title) => {
        const t = (title || '').toLowerCase();
        if (t.includes('desain') || t.includes('gambar') || t.includes('perencanaan') || t.includes('planning')) return <Compass size={18} />;
        if (t.includes('pondasi') || t.includes('galian') || t.includes('tanah') || t.includes('awal') || t.includes('bowplank')) return <HardHat size={18} />;
        if (t.includes('struktur') || t.includes('dinding') || t.includes('bata') || t.includes('lantai') || t.includes('beton') || t.includes('balok')) return <Layers size={18} />;
        if (t.includes('atap') || t.includes('genteng') || t.includes('rangka atap')) return <Home size={18} />;
        if (t.includes('listrik') || t.includes('pipa') || t.includes('air') || t.includes('kabel') || t.includes('sanitasi') || t.includes('mekanikal')) return <Plug2 size={18} />;
        if (t.includes('finishing') || t.includes('cat') || t.includes('keramik') || t.includes('interior') || t.includes('plafon')) return <PaintRoller size={18} />;
        if (t.includes('serah terima') || t.includes('kunci') || t.includes('handover')) return <Key size={18} />;
        if (t.includes('perbaikan') || t.includes('maintenance')) return <Hammer size={18} />;
        return <Building2 size={18} />;
    };

    const handleReviewSubmit = async () => {
        if (!projectData) return;
        
        setIsSubmittingReview(true);
        try {
            await api.post('/reviews', {
                projectCode: projectData.id,
                customerName: projectData.client,
                customerEmail: projectData.customerEmail || 'client@bangunanmu.id',
                rating: rating,
                comment: reviewComment
            });
            setReviewSuccess(true);
            setShowReviewModal(false);
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Gagal mengirimkan ulasan. Silakan coba lagi nanti.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedId = searchId.trim();
        if (!trimmedId) return;

        setLoading(true);
        setError('');
        setIsTracking(false);
        setReviewSuccess(false);

        try {
            const response = await api.get(`/projects/track/${trimmedId}`);
            const data = response.data.data;


            const mappedData = {
                id: data.projectCode,
                status: getStatusBadge(data.status),
                rawStatus: data.status,
                title: data.projectName,
                client: data.customerName,
                category: data.projectType === 'konstruksi' ? 'Konstruksi' : 'Design and Build',
                address: data.customerAddress || 'Alamat tidak ditampilkan demi privasi',
                overallProgress: data.progress,
                customerEmail: data.customerEmail,
                timeline: data.milestones.map((ms, index) => {
                    const icon = getMilestoneIcon(ms.title || ms.name);
                    
                    const statusStr = (ms.status || '').toLowerCase();
                    let status = 'upcoming';
                    let statusLabel = 'MENUNGGU';
                    let statusColor = 'bg-gray-100 text-gray-600 border-gray-200';

                    if (statusStr === 'completed') {
                        status = 'completed';
                        statusLabel = 'SELESAI';
                        statusColor = 'bg-green-50 text-green-700 border-green-100';
                    } else if (statusStr === 'in_progress' || statusStr === 'on_progress') {
                        status = 'in-progress';
                        statusLabel = 'BERJALAN';
                        statusColor = 'bg-blue-50 text-blue-700 border-blue-100';
                    }

                    const msDate = ms.targetDate || ms.endDate || ms.startDate || ms.actualCompletionDate;
                    let dateLabel = 'Belum ada jadwal pasti';
                    if (msDate) {
                        const formattedDate = new Date(msDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});
                        dateLabel = status === 'completed' ? `Selesai: ${formattedDate}` : `Target: ${formattedDate}`;
                    }

                    return {
                        id: ms.id || `stage-${index}`,
                        title: ms.title || ms.name || 'Tahapan Proyek',
                        status: status,
                        statusLabel: statusLabel,
                        statusColor: statusColor,
                        date: dateLabel,
                        icon: icon,
                        description: ms.description || '',
                        progress: ms.progress || 0
                    };
                }),
                siteUpdates: (data.documentFiles || []).map(doc => ({
                    id: doc.id,
                    image: doc.fileUrl,
                    date: new Date(doc.uploadedAt || Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}),
                    title: doc.name
                }))
            };

            setProjectData(mappedData);
            setIsTracking(true);


            try {
                const reviewResponse = await api.get(`/reviews/${searchId}`);
                if (reviewResponse.data && reviewResponse.data.success && reviewResponse.data.data) {
                    setReviewSuccess(true);
                } else {
                    setReviewSuccess(false);
                }
            } catch (revError) {

                setReviewSuccess(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Proyek tidak ditemukan. Periksa kembali ID Proyek Anda.');
        } finally {
            setLoading(false);
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
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            name="project_tracking_id"
                            placeholder="PRJ-2025-001"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            autoComplete="off"
                            spellCheck="false"
                            className="w-full py-4 pl-14 pr-32 rounded-full border-2 border-white/20 bg-white shadow-xl focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 transition-all font-medium text-lg placeholder-dark-300 relative z-10"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`absolute inset-y-2 right-2 px-8 font-bold rounded-full transition-colors shadow-md z-20 flex items-center justify-center gap-2 ${loading ? 'bg-[#527181] text-white/70 cursor-not-allowed' : 'bg-[#658797] hover:bg-[#527181] text-white'}`}
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            Lacak
                        </button>
                    </form>
                    
                    {error && (
                        <div className="mt-6 max-w-xl mx-auto p-4 bg-red-500/20 backdrop-blur-md rounded-2xl border-2 border-red-500 shadow-lg text-white font-bold animate-fadeIn text-center">
                            {error}
                        </div>
                    )}
                </div>
            </section>

            {isTracking && projectData && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-fadeInUp">

                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-dark-100 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-auto">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${projectData.rawStatus === 'completed' ? 'bg-green-100 text-green-700' : projectData.rawStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {projectData.status}
                                </span>
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#658797]/10 text-[#658797] uppercase tracking-wider">
                                    {projectData.category}
                                </span>
                                <span className="text-dark-400 text-sm font-medium">ID: {projectData.id}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-3">{projectData.title}</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-dark-500 font-medium">
                                <p className="flex items-center gap-2">
                                    <User size={16} className="text-[#658797] opacity-80" />
                                    {projectData.client}
                                </p>
                                <div className="hidden sm:block w-px h-4 bg-dark-200"></div>
                                <p className="flex items-center gap-2">
                                    <MapPin size={16} className="text-[#658797] opacity-80" />
                                    {projectData.address}
                                </p>
                            </div>
                        </div>
                        <div className="md:text-right flex flex-col items-start md:items-end">
                            <p className="text-dark-500 text-sm font-medium mb-2">Total Progres</p>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-5xl font-extrabold text-[#658797] leading-none tracking-tighter">
                                    {projectData.overallProgress}%
                                </span>
                            </div>
                            <div className="w-full md:w-48 h-2.5 bg-dark-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#658797] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${projectData.overallProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {projectData.rawStatus === 'completed' && !reviewSuccess && (
                        <div className="bg-[#658797] rounded-[2rem] p-8 md:p-10 shadow-lg border border-[#527181] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 transform transition-all hover:-translate-y-1">
                            <div>
                                <div className="flex items-center gap-2 text-yellow-400 mb-2 text-xl drop-shadow-sm">
                                    <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Proyek Telah Selesai!</h3>
                                <p className="text-white/80 font-medium">Bagaimana pengalaman Anda membangun bersama tim Bangunanmu.id?</p>
                            </div>
                            <button onClick={() => setShowReviewModal(true)} className="px-8 py-4 bg-white hover:bg-gray-100 text-[#658797] font-bold rounded-xl transition-all shadow-lg flex-shrink-0">
                                Berikan Ulasan Proyek
                            </button>
                        </div>
                    )}

                    {reviewSuccess && projectData.overallProgress === 100 && (
                        <div className="bg-green-50 rounded-[2rem] p-8 md:p-10 shadow-sm border border-green-200 mb-10 text-center animate-fadeIn flex flex-col items-center">
                            <CheckCircle2 size={48} className="text-green-500 mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-2">Terima Kasih atas Ulasan Anda!</h3>
                            <p className="text-dark-600 font-medium max-w-lg">Ulasan Anda sangat berarti bagi kami dan telah berhasil diteruskan ke tim manajemen. Senang bisa bekerjasama dengan Anda.</p>
                        </div>
                    )}

                    <div className="mb-10 lg:mb-16 w-full">
                        
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-dark-100">
                            <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-8 px-2">Status Saat Ini</h3>
                            
                            <div className="relative pl-4 md:pl-8">
                                
                                <div className="space-y-12">
                                    {projectData.timeline.map((stage, index) => {
                                        const isCompleted = stage.status === 'completed';
                                        const isInProgress = stage.status === 'in-progress';
                                        const isUpcoming = stage.status === 'upcoming';
                                        const isLast = index === projectData.timeline.length - 1;

                                        return (
                                            <div key={stage.id} className="relative flex gap-6 md:gap-8">
                                                
                                                <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-sm border-4 border-white transition-colors duration-500 relative z-20
                                                        ${isCompleted ? 'bg-[#658797] text-white' : ''}
                                                        ${isInProgress ? 'bg-white border-2 border-[#658797] text-[#658797] shadow-md' : ''}
                                                        ${isUpcoming ? 'bg-dark-50 border-dark-100 text-dark-300' : ''}
                                                    `}>
                                                        {stage.icon}
                                                    </div>
                                                    
                                                    {!isLast && (
                                                        <div className="absolute top-14 -bottom-12 w-0.5 bg-dark-100 z-10">
                                                            <div className={`w-full bg-[#658797] transition-all duration-1000 ${isCompleted ? 'h-full' : 'h-0'}`}></div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`flex-1 pt-3 ${isInProgress ? '' : 'pb-4'} ${isUpcoming ? 'opacity-80' : ''}`}>
                                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                                        <h4 className={`text-lg font-bold transition-colors duration-500 ${isUpcoming ? 'text-dark-500' : 'text-dark-900'}`}>
                                                            {stage.title}
                                                        </h4>
                                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wide border ${stage.statusColor}`}>
                                                            {stage.statusLabel}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs font-medium mb-3 ${isUpcoming ? 'text-dark-400' : 'text-[#658797]'}`}>{stage.date}</p>

                                                    
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
                                                                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                                    ) : (
                                                                        <Circle size={16} className="text-dark-300 mt-0.5 flex-shrink-0" />
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
                            {projectData.siteUpdates.length > 4 && (
                                <button 
                                    onClick={() => setShowGallery(true)}
                                    className="text-sm font-semibold text-dark-500 hover:text-dark-900 flex items-center gap-1 transition-colors"
                                >
                                    Lihat Semua <ArrowRight size={12} />
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {projectData.siteUpdates.slice(0, 4).map((update) => (
                                <div key={update.id} className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-sm"
                                    onClick={() => setLightboxImage({ src: update.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${update.image.substring(update.image.indexOf('/uploads/'))}` : '', alt: update.title })}
                                >
                                    <img 
                                        src={update.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${update.image.substring(update.image.indexOf('/uploads/'))}` : ''} 
                                        alt={update.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1">{update.date}</p>
                                        <h4 className="font-bold text-sm md:text-base leading-tight">{update.title}</h4>
                                    </div>
                                </div>
                            ))}
                            
                            {projectData.siteUpdates.length > 4 && (
                                <div 
                                    onClick={() => setShowGallery(true)}
                                    className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-dark-50 border-2 border-dashed border-dark-200 hover:border-[#658797] flex flex-col items-center justify-center cursor-pointer transition-colors group shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-dark-400 group-hover:text-[#658797] group-hover:scale-110 transition-all mb-3 text-xl">
                                        <Search size={18} />
                                    </div>
                                    <span className="font-bold text-dark-900 text-sm">Lihat Galeri</span>
                                    <span className="text-xs text-dark-400 font-medium">+{projectData.siteUpdates.length - 4} foto</span>
                                </div>
                            )}
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
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 bg-[#FAFAFA]">
                            <div className="text-center mb-8 bg-white p-6 rounded-2xl border border-dark-100 shadow-sm">
                                <p className="text-dark-500 font-bold mb-4 uppercase tracking-widest text-[#658797] text-xs">Rating Kepuasan</p>
                                <div className="flex justify-center gap-3 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} onClick={() => setRating(star)} className={`text-4xl transition-all duration-300 hover:scale-125 ${rating >= star ? 'text-yellow-400 drop-shadow-md' : 'text-dark-100'}`}>
                                            <Star size={36} fill={rating >= star ? "currentColor" : "none"} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-6 bg-white p-6 rounded-2xl border border-dark-100 shadow-sm">
                                <label className="block text-xs font-bold text-dark-500 mb-3 uppercase tracking-widest text-[#658797]">Ceritakan Pengalaman Anda</label>
                                <textarea 
                                    rows="4" 
                                    placeholder="Kualitas pekerjaannya sangat rapi, timnya profesional, dan selesai tepat waktu..." 
                                    className="w-full px-5 py-4 rounded-xl border border-dark-200 bg-dark-50 focus:bg-white focus:ring-2 focus:ring-[#658797] focus:outline-none resize-none transition-colors text-dark-900"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                ></textarea>
                            </div>
                            
                            <div className="mb-8">
                                <label className="flex items-start gap-4 cursor-pointer group bg-white p-5 rounded-2xl border border-dark-100 shadow-sm hover:border-[#658797] transition-colors">
                                    <div className="mt-0.5">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-[#658797] rounded-md border-dark-300 focus:ring-[#658797] cursor-pointer" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-dark-900 mb-0.5 group-hover:text-[#658797] transition-colors">Izinkan kami menampilkannya</p>
                                        <p className="text-xs text-dark-500">Gunakan nama <strong>"{projectData.client}"</strong> sebagai identitas ulasan yang mungkin ditampilkan di beranda situs kami.</p>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setShowReviewModal(false)} className="flex-1 py-4 bg-white border border-dark-200 hover:bg-dark-50 text-dark-900 font-bold rounded-xl transition-colors">Batal</button>
                                <button 
                                    onClick={handleReviewSubmit} 
                                    disabled={isSubmittingReview}
                                    className="flex-1 py-4 bg-[#658797] hover:bg-[#527181] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {isSubmittingReview ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Kirim Ulasan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showGallery && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-dark-100">
                        <div className="p-6 border-b border-[#527181] flex items-center justify-between bg-[#658797] text-white">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">Galeri Proyek</h2>
                            </div>
                            <button onClick={() => setShowGallery(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                {projectData.siteUpdates.map((update) => (
                                    <div key={update.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-dark-100 bg-white"
                                        onClick={() => setLightboxImage({ src: update.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${update.image.substring(update.image.indexOf('/uploads/'))}` : '', alt: update.title })}
                                    >
                                        <img 
                                            src={update.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${update.image.substring(update.image.indexOf('/uploads/'))}` : ''} 
                                            alt={update.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-white/90 mb-0.5">{update.date}</p>
                                            <h4 className="font-bold text-xs leading-tight line-clamp-1">{update.title}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
    );
};

export default CekProgress;
