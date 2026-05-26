import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'
import {
    getAllProjects, createProject, updateProject, updateProjectStatus, deleteProject,
    getMilestones, addMilestone, updateMilestone, deleteMilestone,
    getDocuments, uploadDocument, deleteDocument
} from '../../services/projectService'
import { Plus, Pencil, Trash2, X, Building2, TrendingUp, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, Circle, Upload, Image, Loader2 } from 'lucide-react'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { sendProjectIdToClient } from '../../utils/whatsapp'

const getPhotoUrl = (fileUrl) => {
    if (!fileUrl) return ''
    // Jika sudah URL lengkap (http/https), gunakan langsung
    if (fileUrl.startsWith('http')) return fileUrl
    // Jika mengandung /uploads/, extract dari situ
    if (fileUrl.includes('/uploads/')) {
        return `${import.meta.env.VITE_API_URL.replace('/api', '')}${fileUrl.substring(fileUrl.indexOf('/uploads/'))}`
    }
    // Jika path relatif, gabungkan dengan base URL
    const base = import.meta.env.VITE_API_URL.replace('/api', '')
    return `${base}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
}

const ProjectManagement = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showTimelineModal, setShowTimelineModal] = useState(false)
    const [showGalleryModal, setShowGalleryModal] = useState(false)
    const [lightboxImage, setLightboxImage] = useState(null)
    const [activeProject, setActiveProject] = useState(null)
    const [showAllDocs, setShowAllDocs] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, confirmText: 'Hapus' })
    const [milestones, setMilestones] = useState([])
    const [documents, setDocuments] = useState([])
    const [msLoading, setMsLoading] = useState(false)
    const [docLoading, setDocLoading] = useState(false)
    const [uploadingDoc, setUploadingDoc] = useState(false)
    const [newMs, setNewMs] = useState({ title: '', status: 'pending', targetDate: '', description: '' })
    const [editingMs, setEditingMs] = useState(null)
    const [newDoc, setNewDoc] = useState({ file: null, description: '' })
    const [editingProject, setEditingProject] = useState(null)


    const [filterCategory, setFilterCategory] = useState('Semua Kategori')
    const [filterStatus, setFilterStatus] = useState('Semua Status')
    const [appliedFilters, setAppliedFilters] = useState({ category: 'Semua Kategori', status: 'Semua Status' })
    const [currentPage, setCurrentPage] = useState(1)
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, limit: 10, total: 0, pages: 1, hasNextPage: false, hasPrevPage: false })
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        email: '',
        phone: '',
        address: '',
        category: 'Konstruksi',
        status: 'pending',
        startDate: '',
        estimatedEndDate: '',
    })

    const fetchProjects = async (page = currentPage) => {
        setLoading(true)
        try {
            let beStatus = undefined;
            if (appliedFilters.status === 'MENUNGGU') beStatus = 'pending';
            else if (appliedFilters.status === 'BERJALAN') beStatus = 'in_progress';
            else if (appliedFilters.status === 'SELESAI') beStatus = 'completed';
            else if (appliedFilters.status === 'DIBATALKAN') beStatus = 'cancelled';

            let beProjectType = undefined;
            if (appliedFilters.category === 'Konstruksi') beProjectType = 'konstruksi';
            else if (appliedFilters.category === 'Design and Build') beProjectType = 'design_and_build';
            else if (appliedFilters.category === 'Design') beProjectType = 'design';

            const response = await getAllProjects({ 
                page, 
                limit: 10,
                status: beStatus,
                projectType: beProjectType
            })
            setProjects(response.data)
            if (response.pagination) {
                setPaginationMeta(response.pagination)
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects(currentPage)
    }, [currentPage, appliedFilters])

    // Close modals on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (lightboxImage) setLightboxImage(null)
                else if (showGalleryModal) setShowGalleryModal(false)
                else if (showTimelineModal) setShowTimelineModal(false)
                else if (showModal) { setShowModal(false); resetForm() }
            }
        }
        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [showModal, showTimelineModal, showGalleryModal, lightboxImage])

    const resetForm = () => {
        setFormData({ title: '', client: '', email: '', phone: '', address: '', category: 'Konstruksi', status: 'pending', startDate: '', estimatedEndDate: '' })
        setEditingProject(null)
    }

    const openCreate = () => {
        resetForm()
        setShowModal(true)
    }

    const openEdit = (project) => {
        setEditingProject(project)
        setFormData({
            title: project.title,
            client: project.client,
            email: project.email || '',
            phone: project.phone || '',
            address: project.address || '',
            category: project.category,
            status: project.status,
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            estimatedEndDate: project.estimatedEndDate ? new Date(project.estimatedEndDate).toISOString().split('T')[0] : '',
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData)
                if (formData.status !== editingProject.status) {
                    await updateProjectStatus(editingProject.id, formData.status)
                }
                toast.success('Proyek berhasil diperbarui')
            } else {
                const response = await createProject(formData)
                const newProjectCode = response?.data?.projectCode
                toast.success('Proyek berhasil dibuat')
                
                if (newProjectCode && formData.phone) {
                    setConfirmDialog({
                        isOpen: true,
                        type: 'info',
                        title: 'Kirim ID Proyek ke Klien?',
                        message: `Proyek berhasil dibuat dengan ID: ${newProjectCode}. Apakah Anda ingin mengirim ID ini ke nomor WhatsApp klien (${formData.phone}) sekarang?`,
                        confirmText: 'Kirim WhatsApp',
                        onConfirm: () => {
                            sendProjectIdToClient({
                                phone: formData.phone,
                                clientName: formData.client,
                                projectCode: newProjectCode,
                                projectName: formData.title
                            })
                        }
                    })
                }
            }
            setShowModal(false)
            resetForm()
            fetchProjects()
        } catch (error) {
            console.error('Error saving project:', error)
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan proyek.')
        }
    }

    const handleDelete = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Hapus Proyek',
            message: 'Proyek ini akan dihapus permanen beserta semua data terkait (timeline, foto, dll). Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Hapus Proyek',
            onConfirm: async () => {
                try {
                    await deleteProject(id)
                    toast.success('Proyek berhasil dihapus')
                    fetchProjects()
                } catch (error) {
                    console.error('Error deleting project:', error)
                    toast.error(error.response?.data?.message || 'Gagal menghapus proyek.')
                }
            }
        })
    }





    const openTimeline = async (project) => {
        setActiveProject(project)
        setShowTimelineModal(true)
        setMsLoading(true)
        try {
            const response = await getMilestones(project.id)
            setMilestones(response.data)
        } catch (error) {
            console.error('Error fetching milestones:', error)
        } finally {
            setMsLoading(false)
        }
    }

    const handleAddMilestone = async () => {
        if (!newMs.title) return
        const statusMap = { pending: 'PENDING', in_progress: 'ON_PROGRESS', completed: 'COMPLETED' }
        const beStatus = statusMap[newMs.status] || newMs.status.toUpperCase()
        try {
            if (editingMs) {
                await updateMilestone(activeProject.id, editingMs.id, {
                    title: newMs.title,
                    name: newMs.title,
                    status: beStatus,
                    description: newMs.description,
                    targetDate: newMs.targetDate ? new Date(newMs.targetDate).toISOString() : null,
                    progress: newMs.status === 'completed' ? 100 : 0
                })
                setEditingMs(null)
            } else {
                await addMilestone(activeProject.id, {
                    title: newMs.title,
                    name: newMs.title,
                    status: beStatus,
                    description: newMs.description,
                    targetDate: newMs.targetDate ? new Date(newMs.targetDate).toISOString() : null,
                    progress: newMs.status === 'completed' ? 100 : 0
                })
            }
            setNewMs({ title: '', status: 'pending', targetDate: '', description: '' })
            toast.success(editingMs ? 'Tahapan berhasil diperbarui' : 'Tahapan berhasil ditambahkan')
        } catch (error) {
            toast.error('Gagal menyimpan tahapan.')
            return
        }
        // Refresh data terpisah - jangan masuk catch utama
        try {
            const response = await getMilestones(activeProject.id)
            setMilestones(response.data)
            fetchProjects()
        } catch (e) {
            // Refresh gagal tapi data sudah tersimpan, tidak perlu alert
        }
    }

    const openEditMs = (ms) => {
        setEditingMs(ms)
        // Map status backend (uppercase) ke value dropdown (lowercase)
        const statusMap = { 'PENDING': 'pending', 'ON_PROGRESS': 'in_progress', 'COMPLETED': 'completed' }
        setNewMs({
            title: ms.title,
            status: statusMap[ms.status] || ms.status?.toLowerCase() || 'pending',
            description: ms.description || '',
            targetDate: ms.targetDate ? new Date(ms.targetDate).toISOString().split('T')[0] : ''
        })
    }

    const handleDeleteMilestone = (msId) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Hapus Tahapan',
            message: 'Tahapan ini akan dihapus dari timeline proyek. Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Hapus Tahapan',
            onConfirm: async () => {
                try {
                    await deleteMilestone(activeProject.id, msId)
                    const response = await getMilestones(activeProject.id)
                    setMilestones(response.data)
                    fetchProjects()
                    toast.success('Tahapan berhasil dihapus')
                } catch (error) {
                    toast.error('Gagal menghapus tahapan.')
                }
            }
        })
    }





    const openGallery = async (project) => {
        setActiveProject(project)
        setShowGalleryModal(true)
        setShowAllDocs(false)
        setDocLoading(true)
        try {
            const response = await getDocuments(project.id)
            setDocuments(response.data)
        } catch (error) {
            console.error('Error fetching documents:', error)
        } finally {
            setDocLoading(false)
        }
    }

    const handleUploadDoc = async () => {
        if (!newDoc.file) return
        setUploadingDoc(true)
        try {
            await uploadDocument(activeProject.id, newDoc.file, newDoc.description)
            setNewDoc({ file: null, description: '' })
            const response = await getDocuments(activeProject.id)
            setDocuments(response.data)
            toast.success('Foto berhasil diunggah')
        } catch (error) {
            toast.error('Gagal mengunggah foto.')
        } finally {
            setUploadingDoc(false)
        }
    }

    const handleDeleteDoc = (docId) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Hapus Foto',
            message: 'Foto ini akan dihapus permanen dari dokumentasi proyek. Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Hapus Foto',
            onConfirm: async () => {
                try {
                    await deleteDocument(activeProject.id, docId)
                    const response = await getDocuments(activeProject.id)
                    setDocuments(response.data)
                    toast.success('Foto berhasil dihapus')
                } catch (error) {
                    toast.error('Gagal menghapus foto.')
                }
            }
        })
    }

    const handleApplyFilters = () => {
        setAppliedFilters({ category: filterCategory, status: filterStatus })
        setCurrentPage(1)
    }

    const filteredProjects = projects;

    return (
        <div className="pb-12 max-w-7xl mx-auto w-full">

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight mb-2">Manajemen Proyek</h1>
                    <p className="text-dark-500 font-medium">Pantau dan kelola semua proyek konstruksi Anda secara real-time.</p>
                </div>
                <div className="mt-2 md:mt-0 flex-shrink-0">
                    <button onClick={openCreate} className="px-6 py-3.5 bg-[#396680] hover:bg-[#2d5166] text-white font-bold rounded-full shadow-md transition-all flex items-center gap-2">
                        <Plus size={18} /> Tambah Proyek Baru
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mb-8">

                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex items-center justify-between w-full lg:w-[280px] relative overflow-hidden flex-shrink-0">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-1">Total Proyek</p>
                        <p className="text-4xl font-extrabold text-dark-900">{paginationMeta.total || projects.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex-1 flex flex-col sm:flex-row items-end gap-4 lg:gap-6">
                    <div className="flex-1 w-full relative">
                        <label className="block text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-2">Kategori</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#396680]/40 bg-transparent text-dark-900 font-bold text-sm focus:outline-none focus:border-[#396680] appearance-none cursor-pointer"
                        >
                            <option value="Semua Kategori">Semua Kategori</option>
                            <option value="Konstruksi">Konstruksi</option>
                            <option value="Design and Build">Desain & Bangun</option>
                            <option value="Design">Desain Arsitektur</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 text-dark-300 pointer-events-none">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <label className="block text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#396680]/40 bg-transparent text-dark-900 font-bold text-sm focus:outline-none focus:border-[#396680] appearance-none cursor-pointer"
                        >
                            <option value="Semua Status">Semua Status</option>
                            <option value="MENUNGGU">MENUNGGU</option>
                            <option value="BERJALAN">BERJALAN</option>
                            <option value="SELESAI">SELESAI</option>
                            <option value="DIBATALKAN">DIBATALKAN</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 text-dark-300 pointer-events-none">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="w-full sm:w-auto flex-shrink-0">
                        <button
                            onClick={handleApplyFilters}
                            className="w-full sm:w-auto px-8 py-3 bg-dark-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all"
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead>
                            <tr className="border-b border-dark-100/60">
                                <th className="px-8 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white">Proyek</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white">Klien & Alamat</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white">Kategori</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white">Status</th>
                                <th className="px-8 py-5 text-[10px] font-extrabold text-dark-300 uppercase tracking-widest bg-white text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-50/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-dark-400 font-medium">Memuat data manajemen proyek...</td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-dark-400 font-medium">Belum ada proyek yang cocok dengan filter.</td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => {

                                    const isKonstruksi = project.category?.toLowerCase().includes('konstruksi');
                                    let statusColorText = 'text-blue-500';
                                    let statusDot = 'bg-blue-500';
                                    let statusLabel = 'BERJALAN';

                                    if (project.status === 'completed') {
                                        statusColorText = 'text-green-500';
                                        statusDot = 'bg-green-500';
                                        statusLabel = 'SELESAI';
                                    } else if (project.status === 'pending') {
                                        statusColorText = 'text-orange-500';
                                        statusDot = 'bg-orange-500';
                                        statusLabel = 'MENUNGGU';
                                    } else if (project.status === 'cancelled') {
                                        statusColorText = 'text-red-500';
                                        statusDot = 'bg-red-500';
                                        statusLabel = 'DIBATALKAN';
                                    }

                                    return (
                                        <tr key={project.id} className="hover:bg-dark-50/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-dark-900 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                                        <img src={`https://ui-avatars.com/api/?name=${project.title}&background=1a202c&color=fff&size=100`} alt={project.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dark-900 text-[15px] mb-0.5">{project.title}</p>
                                                        <p className="text-[11px] text-dark-400 font-mono tracking-wider">ID: {project.id || `PRJ-2024-${Math.floor(Math.random() * 900) + 100}`}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-bold text-dark-600 text-sm">
                                                <div className="max-w-[150px] leading-tight flex flex-col gap-1">
                                                    <span className="text-dark-900">{project.client}</span>
                                                    <span className="text-[11px] text-dark-400 font-medium line-clamp-1">{project.address || 'Alamat belum diatur'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${isKonstruksi ? 'bg-[#F0F4F8] text-[#396680]' : 'bg-[#F4F4F4] text-dark-500'}`}>
                                                    {project.category === 'desain' ? 'Desain Arsitektur' : project.category === 'Design' ? 'Desain Arsitektur' : project.category === 'Design and Build' ? 'Desain & Bangun' : (project.category || (isKonstruksi ? 'Konstruksi' : 'Desain & Bangun'))}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                                                    <span className={`text-[13px] font-bold ${statusColorText}`}>{statusLabel}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(project)} className="text-dark-300 hover:text-dark-900 transition-colors" title="Edit">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)} className="text-dark-300 hover:text-red-500 transition-colors" title="Hapus">
                                                        <Trash2 size={18} />
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

                <div className="px-8 py-5 border-t border-dark-100/60 flex items-center justify-between bg-white text-sm">
                    <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">
                        Menampilkan {filteredProjects.length > 0 ? `${(paginationMeta.page - 1) * paginationMeta.limit + 1}-${Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)}` : '0'} Dari {paginationMeta.total} Proyek
                    </span>
                    {paginationMeta.pages > 1 && (
                        <div className="flex items-center gap-2">
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
                                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${item === currentPage
                                                    ? 'bg-[#396680] text-white shadow-sm'
                                                    : 'bg-transparent text-dark-500 hover:bg-dark-50 hover:text-dark-900'
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

            {showModal && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-dark-100">
                            <h2 className="text-xl font-bold text-dark-900">
                                {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                            </h2>
                            <button onClick={() => { setShowModal(false); resetForm() }} className="text-dark-400 hover:text-dark-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Judul Proyek</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    minLength={5} className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" placeholder="Minimal 5 karakter" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Nama Klien</label>
                                    <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" placeholder='Minimal 3 Karakter' required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">No. Whatsapp/HP Klien</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        pattern="[0-9]{10,15}" title="Nomor telepon harus 10-15 digit angka saja"
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" placeholder="087712314562 (10-15 digit angka)" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Email Klien</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" placeholder="email@contoh.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Alamat Proyek</label>
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" placeholder="Minimal 10 Karakter" />
                                </div>
                            </div>
                            <div className={`grid ${editingProject ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Kategori</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680]">
                                        <option value="Konstruksi">Konstruksi</option>
                                        <option value="Design and Build">Desain & Bangun</option>
                                        <option value="Design">Desain Arsitektur</option>
                                    </select>
                                </div>
                                {editingProject && (
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-1">Status Proyek</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680]">
                                            <option value="pending">MENUNGGU</option>
                                            <option value="in_progress">BERJALAN</option>
                                            <option value="completed">SELESAI</option>
                                            <option value="cancelled">DIBATALKAN</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Tanggal Mulai</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Estimasi Selesai</label>
                                    <input type="date" value={formData.estimatedEndDate} onChange={(e) => setFormData({ ...formData, estimatedEndDate: e.target.value })}
                                        min={formData.startDate}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:border-transparent" required />
                                </div>
                            </div>
                            {editingProject && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-1">Total Progres ({editingProject.progress || 0}%)</label>
                                        <div className="w-full bg-dark-100 rounded-lg h-3 overflow-hidden">
                                            <div className="h-full bg-[#396680] rounded-lg transition-all duration-500" style={{ width: `${editingProject.progress || 0}%` }} />
                                        </div>
                                        <p className="text-[10px] text-dark-400 mt-1.5 italic">Progres dihitung otomatis dari rata-rata seluruh tahapan.</p>
                                    </div>
                                </div>
                            )}

                            {editingProject && (
                                <div className="pt-4 border-t border-dark-100">
                                    <h4 className="text-sm font-bold text-dark-900 mb-3 flex items-center gap-2">Data Lanjutan (Terhubung ke Cek Progress di Halaman User)</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button type="button" onClick={() => openTimeline(editingProject)} className="w-full px-4 py-3 rounded-xl border-2 border-[#396680]/40 bg-dark-50 text-dark-500 text-sm font-bold hover:border-[#396680] hover:text-[#396680] hover:bg-white transition-all text-center">
                                            + Manajemen Timeline Tahapan
                                        </button>
                                        <button type="button" onClick={() => openGallery(editingProject)} className="w-full px-4 py-3 rounded-xl border-2 border-[#396680]/40 bg-dark-50 text-dark-500 text-sm font-bold hover:border-[#396680] hover:text-[#396680] hover:bg-white transition-all text-center">
                                            + Unggah Pembaruan Lapangan
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-dark-400 mt-2 italic"></p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="btn-secondary flex-1">Batal</button>
                                <button type="submit" className="btn-primary flex-1">{editingProject ? 'Simpan Perubahan' : 'Tambah Proyek'}</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showTimelineModal && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

                        <div className="p-6 md:p-8 border-b border-[#2d5166] flex items-center justify-between bg-[#396680] text-white">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-white text-[#396680] rounded shadow-sm text-[10px] font-bold tracking-widest uppercase">Mockup Data</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Manajemen Timeline</h2>
                                <p className="text-white/80 text-sm">Menyusun urutan tahapan & checklist proyek</p>
                            </div>
                            <button onClick={() => setShowTimelineModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA]">
                            <div className="space-y-4 mb-8">
                                {msLoading ? (
                                    <p className="text-center py-8 text-dark-400">Memuat tahapan...</p>
                                ) : milestones.length === 0 ? (
                                    <p className="text-center py-8 text-dark-400 italic">Belum ada tahapan. Tambahkan di bawah.</p>
                                ) : (
                                    milestones.map((stage) => (
                                        <div key={stage.id} className="bg-white p-5 rounded-2xl border-2 border-[#396680]/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                            <div className="mt-1">
                                                {(stage.status === 'completed' || stage.status === 'COMPLETED') ? (
                                                    <CheckCircle2 className="text-green-500 text-xl" />
                                                ) : (stage.status === 'in_progress' || stage.status === 'ON_PROGRESS') ? (
                                                    <div className="w-5 h-5 rounded-full border-4 border-[#396680] bg-white"></div>
                                                ) : (
                                                    <Circle className="text-dark-300 text-xl" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-dark-900 text-lg">{stage.title}</h4>
                                                        {(stage.status === 'in_progress' || stage.status === 'ON_PROGRESS') && <span className="text-[10px] px-2 py-0.5 bg-[#396680]/10 text-[#396680] font-bold uppercase rounded-sm">Sedang Berjalan</span>}
                                                        {(stage.status === 'completed' || stage.status === 'COMPLETED') && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 font-bold uppercase rounded-sm">Selesai</span>}
                                                        {(stage.status === 'pending' || stage.status === 'PENDING') && <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 font-bold uppercase rounded-sm">Menunggu</span>}
                                                    </div>
                                                    <div className="flex gap-2 text-dark-300">
                                                        <button onClick={() => openEditMs(stage)} className="hover:text-[#396680] transition-colors"><Pencil size={14} /></button>
                                                        <button onClick={() => handleDeleteMilestone(stage.id)} className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                                <p className="text-dark-400 text-xs font-medium mb-1">{stage.description}</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[#396680] text-[10px] font-bold uppercase tracking-widest">{stage.status === 'COMPLETED' ? 'SELESAI' : stage.status === 'ON_PROGRESS' ? 'BERJALAN' : stage.status === 'PENDING' ? 'MENUNGGU' : stage.status}</p>
                                                    {stage.targetDate && (
                                                        <p className="text-dark-300 text-[10px] font-bold uppercase tracking-widest">
                                                            Target: {new Date(stage.targetDate).toLocaleDateString('id-ID')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="bg-white p-5 md:p-6 rounded-2xl border-2 border-[#396680]/40">
                                <h4 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                                    {editingMs ? <Pencil size={18} className="text-dark-400" /> : <Plus size={18} className="text-dark-400" />} {editingMs ? 'Edit Tahapan' : 'Tambah Tahap Baru'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-500 mb-1">Judul Tahapan</label>
                                        <input type="text" value={newMs.title} onChange={(e) => setNewMs({ ...newMs, title: e.target.value })} placeholder="Misal: Finishing Interior" className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-500 mb-1">Status</label>
                                        <select value={newMs.status} onChange={(e) => setNewMs({ ...newMs, status: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:outline-none text-sm font-medium">
                                            <option value="pending">MENUNGGU</option>
                                            <option value="in_progress">BERJALAN</option>
                                            <option value="completed">SELESAI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-500 mb-1">Target Selesai</label>
                                        <input type="date" value={newMs.targetDate} onChange={(e) => setNewMs({ ...newMs, targetDate: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-500 mb-1">Keterangan Singkat</label>
                                        <input type="text" value={newMs.description} onChange={(e) => setNewMs({ ...newMs, description: e.target.value })} placeholder="Opsional..." className="w-full px-4 py-2.5 rounded-lg border-2 border-[#396680]/40 focus:ring-2 focus:ring-[#396680] focus:border-[#396680] focus:outline-none text-sm font-medium" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleAddMilestone} className="flex-1 py-3 bg-[#396680] hover:bg-[#2d5166] text-white text-sm font-bold rounded-xl transition-all shadow-md">
                                        {editingMs ? 'Simpan Perubahan' : 'Tambah Tahapan'}
                                    </button>
                                    {editingMs && (
                                        <button type="button" onClick={() => { setEditingMs(null); setNewMs({ title: '', status: 'pending', targetDate: '', description: '' }) }} className="px-4 py-3 bg-dark-100 text-dark-500 text-sm font-bold rounded-xl hover:bg-dark-200 transition-all">Batal</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showGalleryModal && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

                        <div className="p-6 md:p-8 border-b border-[#2d5166] flex items-center justify-between bg-[#396680] text-white">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-white text-[#396680] rounded shadow-sm text-[10px] font-bold tracking-widest uppercase">Mockup Data</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Pembaruan Lapangan</h2>
                                <p className="text-white/80 text-sm">Unggah dan kelola dokumentasi visual progres proyek</p>
                            </div>
                            <button onClick={() => setShowGalleryModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA]">

                            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#396680]/40 mb-8 flex flex-col items-center justify-center text-center hover:bg-dark-50/30 transition-colors">
                                <div className="w-16 h-16 bg-[#F0F4F8] rounded-full flex items-center justify-center text-[#396680] mb-4 shadow-sm">
                                    <Upload size={32} />
                                </div>
                                <h4 className="font-bold text-dark-900 text-lg mb-1">Unggah Foto Pembaruan Baru</h4>
                                <p className="text-dark-400 text-sm mb-5">Mendukung format gambar JPG, PNG (Maks 5MB)</p>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                        <label className="flex-1 px-4 py-3 rounded-xl border-2 border-[#396680]/40 text-sm cursor-pointer hover:bg-dark-50 transition-colors flex items-center gap-2">
                                            <span className="px-3 py-1 bg-[#396680]/10 text-[#396680] font-bold text-xs rounded-lg">Pilih File</span>
                                            <span className="text-dark-500 truncate">{newDoc.file ? newDoc.file.name : 'Belum ada file dipilih'}</span>
                                            <input type="file" onChange={(e) => setNewDoc({ ...newDoc, file: e.target.files[0] })} className="hidden" accept="image/jpeg,image/png" />
                                        </label>
                                        <button type="button" onClick={handleUploadDoc} disabled={uploadingDoc} className="px-6 py-3 bg-[#396680] hover:bg-[#2d5166] text-white text-sm font-bold rounded-xl transition-all shadow-md whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                            {uploadingDoc ? <><Loader2 size={16} className="animate-spin" /> Mengunggah...</> : 'Unggah Foto'}
                                        </button>
                                    </div>
                                    {newDoc.file && (
                                        <div className="relative w-full max-w-[200px] aspect-video rounded-xl overflow-hidden border-2 border-[#396680]/20 cursor-pointer" onClick={() => setLightboxImage({ src: URL.createObjectURL(newDoc.file), alt: newDoc.file.name })}>
                                            <img src={URL.createObjectURL(newDoc.file)} alt="Preview" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setNewDoc({ ...newDoc, file: null }) }} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h4 className="font-bold text-dark-900 mb-5 flex items-center gap-2">
                                <Image size={20} className="text-dark-400" /> Daftar Dokumentasi Tersimpan
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {docLoading ? (
                                    <p className="col-span-4 text-center py-8 text-dark-400">Memuat galeri...</p>
                                ) : documents.length === 0 ? (
                                    <p className="col-span-4 text-center py-8 text-dark-400 italic">Belum ada foto yang diunggah.</p>
                                ) : (
                                    (showAllDocs ? documents : documents.slice(0, 4)).map((photo) => (
                                        <div key={photo.id} className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden group shadow-sm bg-white border border-dark-100 flex flex-col hover:shadow-md transition-shadow">
                                            <div className="h-[65%] sm:h-3/4 relative overflow-hidden bg-dark-50 cursor-pointer" onClick={() => setLightboxImage({ src: getPhotoUrl(photo.fileUrl), alt: photo.name })}>
                                                <img
                                                    src={getPhotoUrl(photo.fileUrl)}
                                                    alt={photo.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />

                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleDeleteDoc(photo.fileUrl)} className="w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-3 lg:p-4 bg-white flex-1 flex flex-col justify-center border-t border-dark-100">
                                                <p className="text-[10px] sm:text-xs font-bold text-dark-400 uppercase tracking-wider mb-1 line-clamp-1">
                                                    {(() => {
                                                        const match = (photo.fileUrl || '').split('/').pop()?.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
                                                        if (match) {
                                                            const d = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:00Z`);
                                                            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                                                        }
                                                        return new Date(photo.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                                                    })()}
                                                </p>
                                                <h5 className="font-bold text-dark-900 text-xs sm:text-sm leading-tight line-clamp-2">
                                                    {(() => {
                                                        const match = (photo.fileUrl || '').split('/').pop()?.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
                                                        if (match) {
                                                            const d = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:00Z`);
                                                            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
                                                        }
                                                        return photo.name;
                                                    })()}
                                                </h5>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {!showAllDocs && documents.length > 4 && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setShowAllDocs(true)}
                                        className="px-6 py-2 bg-dark-50 hover:bg-dark-100 text-[#396680] font-bold rounded-full text-sm transition-all border border-dark-200"
                                    >
                                        Lihat Semua ({documents.length} Foto)
                                    </button>
                                </div>
                            )}

                            {showAllDocs && documents.length > 4 && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setShowAllDocs(false)}
                                        className="px-6 py-2 bg-dark-50 hover:bg-dark-100 text-dark-500 font-bold rounded-full text-sm transition-all border border-dark-200"
                                    >
                                        Sembunyikan Sebagian
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {lightboxImage && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn cursor-zoom-out"
                    onClick={() => setLightboxImage(null)}
                    onKeyDown={(e) => e.key === 'Escape' && setLightboxImage(null)}
                    tabIndex={0}
                    ref={(el) => el && el.focus()}
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
                </div>,
                document.body
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                type={confirmDialog.type || 'danger'}
            />
        </div>
    )
}

export default ProjectManagement



