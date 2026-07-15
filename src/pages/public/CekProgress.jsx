import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, CheckCircle2, Circle, Building2, Compass, Box, Wrench, MapPin, ArrowRight, User, Star, X, Loader2, HardHat, Layers, Home, Plug2, PaintRoller, Key, Hammer, Calendar } from 'lucide-react';
import api from '../../services/api';
import ScrollReveal from '../../components/ui/ScrollReveal';

import siteUpdate1 from '../../assets/images/gallery_architecture_1_1772961143405.png';
import siteUpdate2 from '../../assets/images/gallery_architecture_2_1772961174580.png';
import siteUpdate3 from '../../assets/images/gallery_interior_1_1772961158421.png';

const getPhotoUrl = (fileUrl) => {
    if (!fileUrl) return ''
    if (fileUrl.startsWith('http')) return fileUrl
    if (fileUrl.includes('/uploads/')) {
        return `${import.meta.env.VITE_API_URL.replace('/api', '')}${fileUrl.substring(fileUrl.indexOf('/uploads/'))}`
    }
    const base = import.meta.env.VITE_API_URL.replace('/api', '')
    return `${base}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
}

const CekProgress = () => {
    const [searchParams] = useSearchParams();
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
    const autoSearchDone = useRef(false);

    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam && !autoSearchDone.current) {
            autoSearchDone.current = true;
            setSearchId(idParam);
            const fakeEvent = { preventDefault: () => { } };
            setTimeout(() => {
                document.getElementById('cek-progress-form')?.requestSubmit();
            }, 100);
        }
    }, [searchParams]);

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

        const trimmedComment = reviewComment.trim();

        if (!trimmedComment) {
            toast.error('Silakan tulis ulasan Anda terlebih dahulu.');
            return;
        }

        if (trimmedComment.length < 10) {
            toast.error('Ulasan minimal 10 karakter.');
            return;
        }

        setIsSubmittingReview(true);
        try {
            await api.post('/testimonials', {
                name: projectData.client,
                email: projectData.customerEmail || 'client@bangunanmu.id',
                company: projectData.title,
                position: 'Klien',
                testimonialText: trimmedComment,
                rating: rating
            });

            const submittedReviews = JSON.parse(localStorage.getItem('submitted_reviews') || '{}');
            const storageId = (projectData?.id || searchId).trim().toUpperCase();
            submittedReviews[storageId] = true;
            localStorage.setItem('submitted_reviews', JSON.stringify(submittedReviews));

            setReviewSuccess(true);
            setShowReviewModal(false);
            toast.success('Terima kasih! Ulasan Anda berhasil dikirim.');
        } catch (error) {
            console.error('Failed to submit review:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Gagal mengirimkan ulasan.';
            toast.error(errorMessage);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedId = searchId.trim().toUpperCase();
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
                status: getStatusBadge((data.status || '').toLowerCase()),
                rawStatus: (data.status || '').toLowerCase(),
                title: data.projectName,
                client: data.customerName,
                category: data.projectType === 'konstruksi' ? 'Konstruksi' : data.projectType === 'design' ? 'Desain Arsitektur' : 'Desain & Bangun',
                address: data.customerAddress || 'Alamat tidak ditampilkan demi privasi',
                overallProgress: data.progress,
                customerEmail: data.customerEmail,
                startDate: data.startDate,
                estimatedEndDate: data.estimatedEndDate,
                timeline: data.milestones.map((ms, index) => {
                    const icon = getMilestoneIcon(ms.title || ms.name);

                    const statusStr = (ms.status || '').toLowerCase();
                    let status = 'upcoming';
                    let statusLabel = 'MENUNGGU';
                    let statusColor = 'bg-gray-100 text-gray-600 border-gray-200';

                    if (statusStr === 'completed' || statusStr === 'selesai') {
                        status = 'completed';
                        statusLabel = 'SELESAI';
                        statusColor = 'bg-green-50 text-green-700 border-green-100';
                    } else if (statusStr === 'in_progress' || statusStr === 'on_progress' || statusStr === 'berjalan') {
                        status = 'in-progress';
                        statusLabel = 'BERJALAN';
                        statusColor = 'bg-blue-50 text-blue-700 border-blue-100';
                    } else if (statusStr === 'pending' || statusStr === 'menunggu') {
                        status = 'upcoming';
                        statusLabel = 'MENUNGGU';
                        statusColor = 'bg-gray-100 text-gray-600 border-gray-200';
                    }

                    const msDate = ms.targetDate || ms.endDate || ms.startDate || ms.actualCompletionDate;
                    let dateLabel = 'Belum ada jadwal pasti';
                    if (msDate) {
                        const formattedDate = new Date(msDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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
                siteUpdates: (() => {
                    const photoList = (data.documentFiles && data.documentFiles.length > 0) ? data.documentFiles : (data.photos || []);

                    const parsePhotoDate = (url) => {
                        if (!url) return null;
                        const filename = url.split('/').pop() || '';
                        const match = filename.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
                        if (!match) return null;
                        const [, year, month, day, hour, minute] = match;
                        const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`); // UTC
                        return isNaN(date.getTime()) ? null : date;
                    };

                    const formatDate = (date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                    const formatTitle = (date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' • ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

                    return photoList.map((doc, index) => {
                        if (typeof doc === 'string') {
                            const parsed = parsePhotoDate(doc);
                            const fallback = new Date();
                            const dateObj = parsed || fallback;
                            return {
                                id: `photo-${index}`,
                                image: doc,
                                date: formatDate(dateObj),
                                title: parsed ? formatTitle(dateObj) : `Pembaruan #${index + 1}`
                            }
                        }
                        const url = doc.fileUrl || doc.photoUrl || doc.url || '';
                        const parsed = parsePhotoDate(url);
                        const dateObj = doc.uploadedAt ? new Date(doc.uploadedAt) : (parsed || new Date());
                        return {
                            id: doc.id || `photo-${index}`,
                            image: url,
                            date: formatDate(dateObj),
                            title: doc.name || formatTitle(dateObj)
                        }
                    });
                })()
            };

            setProjectData(mappedData);
            setIsTracking(true);


            try {
                const submittedReviews = JSON.parse(localStorage.getItem('submitted_reviews') || '{}');
                const checkId = trimmedId.toUpperCase();
                if (submittedReviews[checkId]) {
                    setReviewSuccess(true);
                } else {
                    try {
                        const reviewResponse = await api.get('/testimonials', {
                            params: { page: 1, limit: 100 }
                        });
                        const reviewList = reviewResponse.data?.data?.data || reviewResponse.data?.data || [];
                        const hasReview = Array.isArray(reviewList) && reviewList.some(
                            t => (t.name === data.customerName && t.company === data.projectName) ||
                                (t.email === (data.customerEmail || '') && data.customerEmail)
                        );
                        if (hasReview) {
                            submittedReviews[checkId] = true;
                            localStorage.setItem('submitted_reviews', JSON.stringify(submittedReviews));
                        }
                        setReviewSuccess(hasReview);
                    } catch (pubErr) {
                        setReviewSuccess(false);
                    }
                }
            } catch (revError) {
                setReviewSuccess(false);
            }
        } catch (err) {
            const rawMsg = err.response?.data?.message || err.response?.data?.error || 'Proyek tidak ditemukan. Periksa kembali ID Proyek Anda.';
            setError(rawMsg.replace(/project/gi, 'Proyek'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans">

            <section className="bg-[#396680] pt-24 pb-20 px-4 relative overflow-hidden border-b border-dark-100">

                <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <ScrollReveal variant="scaleUp" className="max-w-3xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Lacak Proyek Impian Anda
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-justify">
                        Lacak pembaruan pada proyek konstruksi atau interior anda. Masukkan ID Proyek unik anda di bawah ini untuk memulai.
                    </p>

                    <form id="cek-progress-form" onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-dark-400 group-focus-within:text-[#396680] transition-colors z-20">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            name="project_tracking_id"
                            placeholder="BGR-2026"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            autoComplete="off"
                            spellCheck="false"
                            className="w-full py-4 pl-14 pr-32 rounded-full border-2 border-white/20 bg-white shadow-xl focus:outline-none focus:border-[#396680] focus:ring-4 focus:ring-[#396680]/25 transition-all font-medium text-lg placeholder-dark-300 relative z-10"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`absolute inset-y-2 right-2 px-8 font-bold rounded-full transition-colors shadow-md z-20 flex items-center justify-center gap-2 ${loading ? 'bg-[#2d5166] text-white/70 cursor-not-allowed' : 'bg-[#396680] hover:bg-[#2d5166] text-white'}`}
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            Lacak
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 max-w-xl mx-auto px-6 py-3 bg-red-500/10 backdrop-blur-md rounded-full border border-red-500/35 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-white font-medium animate-fadeIn text-center text-sm flex items-center justify-center gap-2.5">
                            <span>{error}</span>
                        </div>
                    )}
                </ScrollReveal>
            </section>

            {isTracking && projectData && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

                    <ScrollReveal variant="fadeInUp" className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-[#e2e8f0] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-auto">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${projectData.rawStatus === 'completed' ? 'bg-green-100 text-green-700' : projectData.rawStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {projectData.status}
                                </span>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${projectData.category === 'Konstruksi' ? 'bg-amber-50 text-amber-700' :
                                    projectData.category === 'Desain & Bangun' ? 'bg-blue-50 text-blue-700' :
                                        'bg-purple-50 text-purple-700'
                                    }`}>
                                    {projectData.category}
                                </span>
                                <span className="text-black text-sm font-semibold">ID: {projectData.id}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">{projectData.title}</h2>
                            <div className="flex flex-col gap-2 text-black/95 font-medium">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                    <p className="flex items-center gap-2">
                                        <User size={16} className="text-[#396680] opacity-80" />
                                        {projectData.client}
                                    </p>
                                    <div className="hidden sm:block w-px h-4 bg-dark-300"></div>
                                    <p className="flex items-center gap-2">
                                        <MapPin size={16} className="text-[#396680] opacity-80" />
                                        {projectData.address}
                                    </p>
                                </div>
                                {(projectData.startDate || projectData.estimatedEndDate) && (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                                        {projectData.startDate && (
                                            <p className="flex items-center gap-2">
                                                <Calendar size={16} className="text-[#396680] opacity-80" />
                                                <span>Mulai: <strong className="text-black font-extrabold">{new Date(projectData.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                                            </p>
                                        )}
                                        {projectData.startDate && projectData.estimatedEndDate && (
                                            <div className="hidden sm:block w-px h-4 bg-dark-300"></div>
                                        )}
                                        {projectData.estimatedEndDate && (
                                            <p className="flex items-center gap-2">
                                                <Calendar size={16} className="text-[#396680] opacity-80" />
                                                <span>Estimasi Selesai: <strong className="text-black font-extrabold">{new Date(projectData.estimatedEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:text-right flex flex-col items-start md:items-end">
                            <p className="text-black text-sm font-semibold mb-2">Total Progres</p>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-5xl font-extrabold text-[#396680] leading-none tracking-tighter">
                                    {projectData.overallProgress}%
                                </span>
                            </div>
                            <div className="w-full md:w-48 h-2.5 bg-dark-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#396680] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${projectData.overallProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {projectData.rawStatus === 'completed' && !reviewSuccess && (
                        <div className="bg-[#396680] rounded-[2rem] p-8 md:p-10 shadow-lg border border-[#2d5166] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 transform transition-all hover:-translate-y-1">
                            <div>
                                <div className="flex items-center gap-2 text-yellow-400 mb-2 text-xl drop-shadow-sm">
                                    <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Proyek Telah Selesai!</h3>
                                <p className="text-white/80 font-medium">Bagaimana pengalaman Anda membangun bersama tim Bangunanmu.id?</p>
                            </div>
                            <button onClick={() => setShowReviewModal(true)} className="px-8 py-4 bg-white hover:bg-gray-100 text-[#396680] font-bold rounded-xl transition-all shadow-lg flex-shrink-0">
                                Berikan Ulasan Proyek
                            </button>
                        </div>
                    )}

                    {reviewSuccess && projectData.rawStatus === 'completed' && (
                        <div className="bg-green-50 rounded-[2rem] p-8 md:p-10 shadow-sm border border-green-200 mb-10 text-center animate-fadeIn flex flex-col items-center">
                            <CheckCircle2 size={48} className="text-green-500 mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold text-black mb-2">Terima Kasih atas Ulasan Anda!</h3>
                            <p className="text-black font-medium max-w-lg">Ulasan Anda sangat berarti bagi kami dan telah berhasil diteruskan ke tim manajemen. Senang bisa bekerjasama dengan Anda.</p>
                        </div>
                    )}

                    <ScrollReveal variant="fadeInUp" className="mb-10 lg:mb-16 w-full">

                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-[#e2e8f0]">
                            <h3 className="text-xl md:text-2xl font-bold text-black mb-8 px-2">Status Saat Ini</h3>

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
                                                        ${isCompleted ? 'bg-[#396680] text-white' : ''}
                                                        ${isInProgress ? 'bg-white border-2 border-[#396680] text-[#396680] shadow-md' : ''}
                                                        ${isUpcoming ? 'bg-dark-50 border-dark-100 text-dark-300' : ''}
                                                    `}>
                                                        {stage.icon}
                                                    </div>

                                                    {!isLast && (
                                                        <div className="absolute top-14 -bottom-12 w-0.5 bg-dark-100 z-10">
                                                            <div className={`w-full bg-[#396680] transition-all duration-1000 ${isCompleted ? 'h-full' : 'h-0'}`}></div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`flex-1 pt-3 ${isInProgress ? '' : 'pb-4'} ${isUpcoming ? 'opacity-80' : ''}`}>
                                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                                        <h4 className={`text-lg font-bold transition-colors duration-500 ${isUpcoming ? 'text-black/55' : 'text-black'}`}>
                                                            {stage.title}
                                                        </h4>
                                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wide border ${stage.statusColor}`}>
                                                            {stage.statusLabel}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs font-medium mb-3 ${isUpcoming ? 'text-black/60' : 'text-[#396680]'}`}>{stage.date}</p>


                                                    {stage.description && (
                                                        <div className="bg-white px-5 py-3 rounded-xl border border-dark-100 text-sm text-black shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] inline-block">
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
                                                                        <Circle size={16} className="text-dark-400 mt-0.5 flex-shrink-0" />
                                                                    )}
                                                                    <span className={`text-sm ${task.completed ? 'text-black font-semibold' : 'text-black/70 italic'}`}>
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
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInUp">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className="text-xl font-bold text-black">Pembaruan Lapangan</h3>
                            {projectData.siteUpdates.length > 4 && (
                                <button
                                    onClick={() => setShowGallery(true)}
                                    className="text-sm font-semibold text-black/85 hover:text-black flex items-center gap-1 transition-colors"
                                >
                                    Lihat Semua <ArrowRight size={12} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {projectData.siteUpdates.slice(0, 4).map((update) => (
                                <div key={update.id} className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-sm"
                                    onClick={() => setLightboxImage({ src: getPhotoUrl(update.image), alt: update.title })}
                                >
                                    <img
                                        src={getPhotoUrl(update.image)}
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
                                    className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-dark-50 border-2 border-dashed border-dark-200 hover:border-[#396680] flex flex-col items-center justify-center cursor-pointer transition-colors group shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-black/60 group-hover:text-[#396680] group-hover:scale-110 transition-all mb-3 text-xl">
                                        <Search size={18} />
                                    </div>
                                    <span className="font-bold text-black text-sm">Lihat Galeri</span>
                                    <span className="text-xs text-black/70 font-semibold">+{projectData.siteUpdates.length - 4} foto</span>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>

                </div>
            )}

            {showReviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg my-8 border border-dark-100">
                        <div className="p-6 border-b border-[#2d5166] flex items-center justify-between bg-[#396680] rounded-t-[2.5rem] text-white">
                            <h2 className="text-xl font-bold tracking-tight">Kirimkan Ulasan</h2>
                            <button onClick={() => setShowReviewModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 bg-[#FAFAFA] rounded-b-[2.5rem]">
                            <div className="text-center mb-8 bg-white p-6 rounded-2xl border border-dark-100 shadow-sm">
                                <p className="text-dark-500 font-bold mb-4 uppercase tracking-widest text-[#396680] text-xs">Rating Kepuasan</p>
                                <div className="flex justify-center gap-3 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} onClick={() => setRating(star)} className={`text-4xl transition-all duration-300 hover:scale-125 ${rating >= star ? 'text-yellow-400 drop-shadow-md' : 'text-dark-100'}`}>
                                            <Star size={36} fill={rating >= star ? "currentColor" : "none"} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6 bg-white p-6 rounded-2xl border border-dark-100 shadow-sm">
                                <label className="block text-xs font-bold text-dark-500 mb-3 uppercase tracking-widest text-[#396680]">Ceritakan Pengalaman Anda</label>
                                <textarea
                                    rows="4"
                                    placeholder="Testimoni minimal 10 karakter"
                                    className="w-full px-5 py-4 rounded-xl border border-black bg-dark-50 focus:bg-white focus:ring-2 focus:ring-[#396680] focus:outline-none resize-none transition-colors text-black"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setShowReviewModal(false)} className="flex-1 py-4 bg-white border border-black hover:bg-dark-50 text-black font-bold rounded-xl transition-colors">Batal</button>
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={isSubmittingReview}
                                    className="flex-1 py-4 bg-[#396680] hover:bg-[#2d5166] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
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
                        <div className="p-6 border-b border-[#2d5166] flex items-center justify-between bg-[#396680] text-white">
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
                                        onClick={() => setLightboxImage({ src: getPhotoUrl(update.image), alt: update.title })}
                                    >
                                        <img
                                            src={getPhotoUrl(update.image)}
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
