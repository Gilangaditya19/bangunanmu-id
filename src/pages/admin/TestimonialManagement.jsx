import { useState, useEffect } from 'react'
import { getAllTestimonials, updateTestimonialStatus, deleteTestimonial } from '../../services/testimonialService'
import { Star, Eye, EyeOff, Trash2, Pencil, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const TestimonialManagement = () => {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)


    const [filterStatus, setFilterStatus] = useState('Semua Status')
    const [appliedFilters, setAppliedFilters] = useState({ status: 'Semua Status' })
    const [currentPage, setCurrentPage] = useState(1)
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, limit: 10, total: 0, pages: 1, hasNextPage: false, hasPrevPage: false })

    const fetchTestimonials = async (page = currentPage) => {
        setLoading(true)
        try {
            const params = { page, limit: 10 }
            
            // Filter status: kirim ke backend jika bukan 'Semua Status'
            if (appliedFilters.status === 'Diterbitkan') {
                params.status = 'approved'
            } else if (appliedFilters.status === 'Menunggu' || appliedFilters.status === 'Disembunyikan') {
                params.status = 'pending'
            }
            // 'Semua Status' = tidak kirim param status (ambil semua)

            const response = await getAllTestimonials(params)

            if (response.success && response.data && Array.isArray(response.data.data)) {
                setTestimonials(response.data.data)
                if (response.data.pagination) setPaginationMeta(response.data.pagination)
            } else if (Array.isArray(response.data)) {
                setTestimonials(response.data)
                setPaginationMeta({ page: 1, limit: 10, total: response.data.length, pages: 1, hasNextPage: false, hasPrevPage: false })
            } else {
                setTestimonials([])
                setPaginationMeta({ page: 1, limit: 10, total: 0, pages: 1, hasNextPage: false, hasPrevPage: false })
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
            setTestimonials([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestimonials(currentPage)
    }, [currentPage, appliedFilters])

    const handleToggleApproval = async (id, currentStatus) => {
        try {
            await updateTestimonialStatus(id, !currentStatus)
            fetchTestimonials()
        } catch (error) {
            console.error('Error updating testimonial:', error)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus testimoni ini?')) return
        try {
            await deleteTestimonial(id)
            fetchTestimonials()
        } catch (error) {
            console.error('Error deleting testimonial:', error)
        }
    }



    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-100'}`} />
        ))
    }

    const handleApplyFilters = () => {
        setAppliedFilters({ status: filterStatus })
        setCurrentPage(1)
    }

    const displayData = testimonials;

    return (
        <div className="pb-12 max-w-7xl mx-auto w-full font-sans">
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
                <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a202c] tracking-tight mb-2">Manajemen Testimoni</h1>
                    <p className="text-dark-500 font-medium text-sm sm:text-base">Kelola ulasan dan umpan balik dari klien Anda untuk membangun kepercayaan.</p>
                </div>
                
                <div className="bg-white rounded-full sm:rounded-[40px] px-8 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 min-w-max border border-dark-100/50">
                    <div className="pl-6 py-4 pr-12">
                        <p className="text-[9px] sm:text-[10px] font-extrabold text-dark-300 tracking-widest uppercase mb-1">Total Testimoni</p>
                        <p className="text-3xl sm:text-4xl font-extrabold text-dark-900 leading-none">{paginationMeta.total || (testimonials || []).length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-md border border-dark-100/30 hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-end gap-4 lg:gap-6 w-full mb-8">
                <div className="flex-1 w-full relative">
                    <label className="block text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-2">Status</label>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border border-dark-100/80 bg-[#F9F9FB] text-dark-900 font-bold text-sm focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="Semua Status">Semua Status</option>
                        <option value="Diterbitkan">Diterbitkan</option>
                        <option value="Disembunyikan">Disembunyikan</option>
                    </select>
                    <div className="absolute right-4 bottom-3.5 text-dark-400 pointer-events-none">
                        <ChevronDown size={14} />
                    </div>
                </div>
                <div className="w-full sm:w-auto flex-shrink-0">
                    <button 
                        onClick={handleApplyFilters}
                        className="w-full sm:w-auto px-8 py-3 bg-[#396680] hover:bg-[#2d5166] text-white font-bold text-sm rounded-xl shadow-md transition-all"
                    >
                        Terapkan Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-md border border-dark-100/30 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead>
                            <tr className="border-b border-dark-100/60">
                                <th className="px-8 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white">Info Klien</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white">Rating & Ulasan</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-50/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-dark-400 font-medium">Memuat data manajemen testimoni...</td>
                                </tr>
                            ) : displayData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-dark-400 font-medium">Belum ada testimoni yang cocok dengan filter.</td>
                                </tr>
                            ) : (
                                displayData.map((testi, idx) => {

                                    let statusStr = testi.isApproved ? 'Diterbitkan' : 'Disembunyikan';
                                    let statusClasses = 'bg-dark-100 text-dark-600';
                                    let isHidden = !testi.isApproved;
                                    
                                    if (testi.isApproved) {
                                        statusClasses = 'bg-green-100 text-green-700';
                                    } else {
                                        statusClasses = 'bg-dark-100 text-dark-600';
                                    }

                                    return (
                                         <tr key={testi.id || idx} className="hover:bg-dark-50/20 transition-colors group">
                                            
                                            <td className="px-8 py-6 align-top">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full border-2 border-[#E2E8EC] shadow-sm overflow-hidden flex-shrink-0 bg-dark-50">
                                                        <img src={`https://ui-avatars.com/api/?name=${testi.name}&background=396680&color=fff&size=100`} alt={testi.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-dark-900 text-[15px] mb-0.5">{testi.name}</p>
                                                        <p className="text-[12px] text-[#396680] font-medium tracking-wide">
                                                            {testi.company || testi.project || `Proyek ${testi.name}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6 align-top max-w-[300px]">
                                                <div className="flex gap-1 mb-3">
                                                    {renderStars(testi.rating || 5)}
                                                </div>
                                                <p className="text-dark-500 font-medium italic text-sm leading-relaxed pr-4">
                                                    "{testi.testimonialText || testi.review || 'Tidak ada ulasan'}"
                                                </p>
                                            </td>

                                            <td className="px-6 py-6 align-top text-center pt-8">
                                                <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${statusClasses}`}>
                                                    {statusStr}
                                                </span>
                                            </td>

                                            <td className="px-8 py-6 align-top pt-7">
                                                <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleToggleApproval(testi._id || testi.id, testi.isApproved)} 
                                                        className="w-8 h-8 rounded-full bg-[#F4F6F8] border border-[#EAECEE] flex items-center justify-center text-dark-400 hover:text-[#396680] hover:bg-[#EAECEE] transition-all" 
                                                        title="Sembunyikan/Tampilkan"
                                                    >
                                                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(testi._id || testi.id)}
                                                        className="w-8 h-8 rounded-full bg-[#fce8e8] border border-[#facaca] flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 transition-all shadow-sm" 
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-dark-100/60 flex items-center justify-between bg-white text-sm mt-auto">
                    <span className="text-[11px] font-medium text-dark-400 tracking-wide">
                        Menampilkan <strong className="text-dark-900 font-extrabold">{displayData.length > 0 ? `${(paginationMeta.page - 1) * paginationMeta.limit + 1}-${Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)}` : '0'}</strong> dari <strong className="text-dark-900 font-extrabold">{paginationMeta.total}</strong> testimoni
                    </span>
                    {paginationMeta.pages > 1 && (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => { if (paginationMeta.hasPrevPage) setCurrentPage(currentPage - 1) }}
                                disabled={!paginationMeta.hasPrevPage}
                                className={`w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center transition-colors ${paginationMeta.hasPrevPage ? 'text-dark-400 hover:bg-dark-50 hover:text-dark-900 cursor-pointer' : 'text-dark-200 cursor-not-allowed'}`}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: paginationMeta.pages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === paginationMeta.pages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                                    acc.push(p)
                                    return acc
                                }, [])
                                .map((item, idx) =>
                                    item === '...' ? (
                                        <span key={`dots-${idx}`} className="text-dark-300 px-1">...</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setCurrentPage(item)}
                                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                                                item === currentPage
                                                    ? 'bg-[#396680] text-white shadow-md'
                                                    : 'bg-transparent text-dark-600 hover:bg-dark-50'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )
                            }
                            <button
                                onClick={() => { if (paginationMeta.hasNextPage) setCurrentPage(currentPage + 1) }}
                                disabled={!paginationMeta.hasNextPage}
                                className={`w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center transition-colors ${paginationMeta.hasNextPage ? 'text-dark-400 hover:bg-dark-50 hover:text-dark-900 cursor-pointer' : 'text-dark-200 cursor-not-allowed'}`}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TestimonialManagement
