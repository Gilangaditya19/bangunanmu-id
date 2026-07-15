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
    if (fileUrl.startsWith('http')) return fileUrl
    if (fileUrl.includes('/uploads/')) {
        return `${import.meta.env.VITE_API_URL.replace('/api', '')}${fileUrl.substring(fileUrl.indexOf('/uploads/'))}`
    }
    const base = import.meta.env.VITE_API_URL.replace('/api', '')
    return `${base}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
}

const displayCategory = (cat) => {
    const c = (cat || '').toLowerCase()
    if (c === 'konstruksi') return 'Konsultasi & Desain'
    if (c === 'design_and_build' || c === 'design and build') return 'Desain & Bangun Sipil'
    if (c === 'design' || c === 'desain') return 'Desain & Bangun Interior'
    return cat || 'Konsultasi & Desain'
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
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { }, confirmText: 'Hapus' })
    const [milestones, setMilestones] = useState([])
    const [documents, setDocuments] = useState([])
    const [msLoading, setMsLoading] = useState(false)
    const [docLoading, setDocLoading] = useState(false)
    const [uploadingDoc, setUploadingDoc] = useState(false)
    const [newMs, setNewMs] = useState({ title: '', status: 'pending', targetDate: '', description: '' })
    const [editingMs, setEditingMs] = useState(null)
    const [newDoc, setNewDoc] = useState({ files: [], description: '' })
    const [previewUrls, setPreviewUrls] = useState([])
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
            const errData = error.response?.data
            let errMsg = errData?.errors?.[0] || errData?.message || 'Terjadi kesalahan saat menyimpan proyek.'
            errMsg = errMsg.replace(/customer/gi, 'klien')
            toast.error(errMsg)
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
        try {
            if (editingMs) {
                await updateMilestone(activeProject.id, editingMs.id, {
                    title: newMs.title,
                    status: newMs.status,
                    targetDate: newMs.targetDate ? new Date(newMs.targetDate).toISOString() : undefined,
                    description: newMs.description
                })
                toast.success('Tahapan berhasil diperbarui')
            } else {
                await addMilestone(activeProject.id, {
                    title: newMs.title,
                    status: newMs.status,
                    targetDate: newMs.targetDate ? new Date(newMs.targetDate).toISOString() : undefined,
                    description: newMs.description
                })
                toast.success('Tahapan berhasil ditambahkan')
            }
            setNewMs({ title: '', status: 'pending', targetDate: '', description: '' })
            setEditingMs(null)
            const response = await getMilestones(activeProject.id)
            setMilestones(response.data)
            fetchProjects()
        } catch (error) {
            const errData = error.response?.data
            let errMsg = errData?.errors?.[0] || errData?.message || 'Gagal menyimpan tahapan.'
            errMsg = errMsg.replace(/milestone/gi, 'tahapan')
            toast.error(errMsg)
            return
        }
        try {
            const response = await getMilestones(activeProject.id)
            setMilestones(response.data)
            fetchProjects()
        } catch (e) {
        }
    }

    const openEditMs = (ms) => {
        setEditingMs(ms)
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
        if (newDoc.files.length === 0) return
        setUploadingDoc(true)
        let successCount = 0
        let failCount = 0
        try {
            for (const file of newDoc.files) {
                try {
                    await uploadDocument(activeProject.id, file, newDoc.description)
                    successCount++
                } catch (error) {
                    failCount++
                    console.error('Upload error for', file.name, error)
                }
            }
            previewUrls.forEach(url => URL.revokeObjectURL(url))
            setPreviewUrls([])
            setNewDoc({ files: [], description: '' })
            const response = await getDocuments(activeProject.id)
            setDocuments(response.data)
            if (failCount === 0) {
                toast.success(`${successCount} foto berhasil diunggah`)
            } else {
                toast.success(`${successCount} foto berhasil, ${failCount} gagal diunggah`)
            }
        } catch (error) {
            toast.error('Gagal mengunggah foto.')
        } finally {
            setUploadingDoc(false)
        }
    }

    const handleFileSelect = async (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length === 0) return

        e.target.value = ''

        const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', '']
        const processedFiles = []
        const newUrls = []

        const loadingToast = selectedFiles.length > 1 ? toast.loading(`Memproses ${selectedFiles.length} foto...`) : null

        for (const file of selectedFiles) {
            const isValidExt = /\.(jpe?g|png|heic|heif)$/i.test(file.name)
            if (!validTypes.includes(file.type) && !isValidExt) {
                toast.error(`${file.name}: Format tidak didukung.`)
                continue
            }

            if (file.size > 20 * 1024 * 1024) {
                toast.error(`${file.name}: Ukuran terlalu besar (maks 20MB).`)
                continue
            }

            const isHeic = /\.(heic|heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif'
            let processedFile = file

            if (isHeic) {
                try {
                    const heic2any = (await import('heic2any')).default
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.8
                    })
                    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
                    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
                    processedFile = new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() })
                } catch (err) {
                    console.error('HEIC conversion error:', err)
                    toast.error(`${file.name}: Gagal konversi HEIC.`)
                    continue
                }
            }

            const TARGET_MAX_SIZE = 1024 * 1024
            if (processedFile.size > TARGET_MAX_SIZE) {
                try {
                    let attempts = [
                        { dim: 1280, q: 0.7 },
                        { dim: 1024, q: 0.6 },
                        { dim: 800, q: 0.5 },
                        { dim: 640, q: 0.4 },
                    ]
                    for (const { dim, q } of attempts) {
                        processedFile = await resizeImage(processedFile, dim, q)
                        if (processedFile.size <= TARGET_MAX_SIZE) break
                    }
                } catch (err) {
                    console.error('Resize error:', err)
                }
            }

            processedFiles.push(processedFile)
            newUrls.push(URL.createObjectURL(processedFile))
        }

        if (loadingToast) toast.dismiss(loadingToast)

        if (processedFiles.length > 0) {
            setNewDoc(prev => ({ ...prev, files: [...prev.files, ...processedFiles] }))
            setPreviewUrls(prev => [...prev, ...newUrls])
        }
    }
    const getExifOrientation = (file) => {
        return new Promise((resolve) => {
            try {
                const reader = new FileReader()
                reader.onload = (e) => {
                    try {
                        const view = new DataView(e.target.result)
                        if (view.getUint16(0, false) !== 0xFFD8) {
                            resolve(1)
                            return
                        }
                        let offset = 2
                        while (offset < view.byteLength) {
                            if (offset + 2 > view.byteLength) break
                            const marker = view.getUint16(offset, false)
                            offset += 2
                            if (marker === 0xFFE1) {
                                if (offset + 2 > view.byteLength) break
                                const length = view.getUint16(offset, false)
                                if (offset + length > view.byteLength) break
                                if (view.getUint32(offset + 2, false) !== 0x45786966) {
                                    resolve(1)
                                    return
                                }
                                const tiffOffset = offset + 8
                                if (tiffOffset + 8 > view.byteLength) { resolve(1); return }
                                const little = view.getUint16(tiffOffset, false) === 0x4949
                                const ifdOffset = view.getUint32(tiffOffset + 4, little)
                                const ifdStart = tiffOffset + ifdOffset
                                if (ifdStart + 2 > view.byteLength) { resolve(1); return }
                                const tagsCount = view.getUint16(ifdStart, little)
                                const dirStart = ifdStart + 2
                                for (let i = 0; i < tagsCount; i++) {
                                    const entryOffset = dirStart + i * 12
                                    if (entryOffset + 12 > view.byteLength) break
                                    if (view.getUint16(entryOffset, little) === 0x0112) {
                                        resolve(view.getUint16(entryOffset + 8, little))
                                        return
                                    }
                                }
                                resolve(1)
                                return
                            } else if ((marker & 0xFF00) !== 0xFF00) {
                                break
                            } else {
                                if (offset + 2 > view.byteLength) break
                                offset += view.getUint16(offset, false)
                            }
                        }
                        resolve(1)
                    } catch (e) {
                        resolve(1)
                    }
                }
                reader.onerror = () => resolve(1)
                reader.readAsArrayBuffer(file.slice(0, 65536))
            } catch (e) {
                resolve(1)
            }
        })
    }

    const applyExifOrientation = (ctx, canvas, img, orientation) => {
        const { width, height } = canvas
        switch (orientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break
            case 5: canvas.width = height; canvas.height = width; ctx.transform(0, 1, 1, 0, 0, 0); break
            case 6: canvas.width = height; canvas.height = width; ctx.transform(0, 1, -1, 0, height, 0); break
            case 7: canvas.width = height; canvas.height = width; ctx.transform(0, -1, -1, 0, height, width); break
            case 8: canvas.width = height; canvas.height = width; ctx.transform(0, -1, 1, 0, 0, width); break
            default: break
        }
    }

    const resizeImage = (file, maxDimension = 1280, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file)
            const img = document.createElement('img')

            img.onload = () => {
                try {
                    let { width, height } = img

                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = Math.round((height * maxDimension) / width)
                            width = maxDimension
                        } else {
                            width = Math.round((width * maxDimension) / height)
                            height = maxDimension
                        }
                    }

                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)

                    canvas.toBlob(
                        (blob) => {
                            URL.revokeObjectURL(url)
                            if (!blob) {
                                try {
                                    const dataUrl = canvas.toDataURL('image/jpeg', quality)
                                    const byteString = atob(dataUrl.split(',')[1])
                                    const ab = new ArrayBuffer(byteString.length)
                                    const ia = new Uint8Array(ab)
                                    for (let i = 0; i < byteString.length; i++) {
                                        ia[i] = byteString.charCodeAt(i)
                                    }
                                    const fallbackBlob = new Blob([ab], { type: 'image/jpeg' })
                                    const newFile = new File([fallbackBlob], file.name.replace(/\.\w+$/, '.jpg'), {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    })
                                    resolve(newFile)
                                } catch (fallbackErr) {
                                    reject(new Error('Gagal memproses foto'))
                                }
                                return
                            }
                            const newFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            })
                            resolve(newFile)
                        },
                        'image/jpeg',
                        quality
                    )
                } catch (canvasErr) {
                    URL.revokeObjectURL(url)
                    reject(canvasErr)
                }
            }

            img.onerror = () => {
                URL.revokeObjectURL(url)
                reject(new Error('Gagal memuat gambar'))
            }

            img.src = url
        })
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
                    <p className="text-black font-semibold">Pantau dan kelola semua proyek konstruksi anda.</p>
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
                        <p className="text-[10px] font-bold text-black tracking-widest uppercase mb-1">Total Proyek</p>
                        <p className="text-4xl font-extrabold text-dark-900">{paginationMeta.total || projects.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex-1 flex flex-col sm:flex-row items-end gap-4 lg:gap-6">
                    <div className="flex-1 w-full relative">
                        <label className="block text-[10px] font-bold text-black tracking-widest uppercase mb-2">Kategori</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-black bg-transparent bg-none text-dark-900 font-bold text-sm focus:outline-none focus:border-[#396680] appearance-none cursor-pointer"
                        >
                            <option value="Semua Kategori">Semua Kategori</option>
                            <option value="Konstruksi">Konsultasi & Desain</option>
                            <option value="Design and Build">Desain & Bangun Sipil</option>
                            <option value="Design">Desain & Bangun Interior</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 text-black pointer-events-none">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <label className="block text-[10px] font-bold text-black tracking-widest uppercase mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-black bg-transparent bg-none text-dark-900 font-bold text-sm focus:outline-none focus:border-[#396680] appearance-none cursor-pointer"
                        >
                            <option value="Semua Status">Semua Status</option>
                            <option value="MENUNGGU">MENUNGGU</option>
                            <option value="BERJALAN">BERJALAN</option>
                            <option value="SELESAI">SELESAI</option>
                            <option value="DIBATALKAN">DIBATALKAN</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 text-black pointer-events-none">
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
                                <th className="px-8 py-5 text-[10px] font-extrabold text-black uppercase tracking-widest bg-white">Proyek</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-black uppercase tracking-widest bg-white">Klien & Alamat</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-black uppercase tracking-widest bg-white">Kategori</th>
                                <th className="px-6 py-5 text-[10px] font-extrabold text-black uppercase tracking-widest bg-white">Status</th>
                                <th className="px-8 py-5 text-[10px] font-extrabold text-black uppercase tracking-widest bg-white text-right">Aksi</th>
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
                                                        <p className="text-[11px] text-black font-semibold font-mono tracking-wider">ID: {project.id || `PRJ-2024-${Math.floor(Math.random() * 900) + 100}`}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-bold text-dark-600 text-sm">
                                                <div className="max-w-[150px] leading-tight flex flex-col gap-1">
                                                    <span className="text-dark-900">{project.client}</span>
                                                    <span className="text-[11px] text-black/70 font-semibold line-clamp-1">{project.address || 'Alamat belum diatur'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${isKonstruksi ? 'bg-amber-50 text-amber-700' :
                                                    (project.category === 'Design and Build' || project.category === 'design_and_build') ? 'bg-blue-50 text-blue-700' :
                                                        'bg-purple-50 text-purple-700'
                                                    }`}>
                                                    {displayCategory(project.category)}
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
                                                    <button onClick={() => openEdit(project)} className="text-black/50 hover:text-black transition-colors" title="Edit">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)} className="text-black/50 hover:text-red-500 transition-colors" title="Hapus">
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
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest">
                        Menampilkan {filteredProjects.length > 0 ? `${(paginationMeta.page - 1) * paginationMeta.limit + 1}-${Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)}` : '0'} Dari {paginationMeta.total} Proyek
                    </span>
                    {paginationMeta.pages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { if (paginationMeta.hasPrevPage) setCurrentPage(currentPage - 1) }}
                                disabled={!paginationMeta.hasPrevPage}
                                className={`w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center transition-colors ${paginationMeta.hasPrevPage ? 'text-black hover:bg-dark-50 hover:text-black cursor-pointer' : 'text-black/20 cursor-not-allowed'}`}
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
                                        <span key={`dots-${idx}`} className="text-black/30 px-1">...</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setCurrentPage(item)}
                                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${item === currentPage
                                                ? 'bg-[#396680] text-white shadow-sm'
                                                : 'bg-transparent text-black hover:bg-dark-50 hover:text-black'
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
                                className={`w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center transition-colors ${paginationMeta.hasNextPage ? 'text-black hover:bg-dark-50 hover:text-black cursor-pointer' : 'text-black/20 cursor-not-allowed'}`}
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
                            <button onClick={() => { setShowModal(false); resetForm() }} className="text-black/60 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-black mb-1">Judul Proyek</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    minLength={5} className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" placeholder="Minimal 5 karakter" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">Nama Klien</label>
                                    <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" placeholder='Minimal 3 Karakter' required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">No. Whatsapp/HP Klien</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        pattern="[0-9]{10,15}" title="Nomor telepon harus 10-15 digit angka saja"
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" placeholder="087712314562 (10-15 digit angka)" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">Email Klien</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" placeholder="email@contoh.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">Alamat Proyek</label>
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" placeholder="Minimal 10 Karakter" />
                                </div>
                            </div>
                            <div className={`grid ${editingProject ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">Kategori</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]">
                                        <option value="Konstruksi">Konsultasi & Desain</option>
                                        <option value="Design and Build">Desain & Bangun Sipil</option>
                                        <option value="Design">Desain & Bangun Interior</option>
                                    </select>
                                </div>
                                {editingProject && (
                                    <div>
                                        <label className="block text-sm font-bold text-black mb-1">Status Proyek</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]">
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
                                    <label className="block text-sm font-bold text-black mb-1">Tanggal Mulai</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">Estimasi Selesai</label>
                                    <input type="date" value={formData.estimatedEndDate} onChange={(e) => setFormData({ ...formData, estimatedEndDate: e.target.value })}
                                        min={formData.startDate}
                                        className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680]" required />
                                </div>
                            </div>
                            {editingProject && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-black mb-1">Total Progres ({editingProject.progress || 0}%)</label>
                                        <div className="w-full bg-dark-100 rounded-lg h-3 overflow-hidden">
                                            <div className="h-full bg-[#396680] rounded-lg transition-all duration-500" style={{ width: `${editingProject.progress || 0}%` }} />
                                        </div>
                                        <p className="text-[10px] text-black font-semibold mt-1.5 italic">Progres dihitung otomatis dari rata-rata seluruh tahapan.</p>
                                    </div>
                                </div>
                            )}

                            {editingProject && (
                                <div className="pt-4 border-t border-dark-100">
                                    <h4 className="text-sm font-bold text-dark-900 mb-3 flex items-center gap-2">Data Lanjutan (Terhubung ke Cek Progress di Halaman User)</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button type="button" onClick={() => openTimeline(editingProject)} className="w-full px-4 py-3 rounded-xl border border-black bg-dark-50 text-black text-sm font-bold hover:border-black hover:text-[#396680] hover:bg-white transition-all text-center">
                                            + Manajemen Timeline Tahapan
                                        </button>
                                        <button type="button" onClick={() => openGallery(editingProject)} className="w-full px-4 py-3 rounded-xl border border-black bg-dark-50 text-black text-sm font-bold hover:border-black hover:text-[#396680] hover:bg-white transition-all text-center">
                                            + Unggah Pembaruan Lapangan
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-black/70 mt-2 italic"></p>
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
                                    <p className="text-center py-8 text-black font-semibold">Memuat tahapan...</p>
                                ) : milestones.length === 0 ? (
                                    <p className="text-center py-8 text-black/80 font-bold italic">Belum ada tahapan. Tambahkan di bawah.</p>
                                ) : (
                                    milestones.map((stage) => (
                                        <div key={stage.id} className="bg-white p-5 rounded-2xl border border-black shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                            <div className="mt-1">
                                                {(stage.status === 'completed' || stage.status === 'COMPLETED' || stage.status === 'selesai') ? (
                                                    <CheckCircle2 className="text-green-500 text-xl" />
                                                ) : (stage.status === 'in_progress' || stage.status === 'ON_PROGRESS' || stage.status === 'berjalan') ? (
                                                    <div className="w-5 h-5 rounded-full border-4 border-[#396680] bg-white"></div>
                                                ) : (
                                                    <Circle className="text-black/40 text-xl" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-dark-900 text-lg">{stage.title}</h4>
                                                        {(stage.status === 'in_progress' || stage.status === 'ON_PROGRESS' || stage.status === 'berjalan') && <span className="text-[10px] px-2 py-0.5 bg-[#396680]/10 text-[#396680] font-bold uppercase rounded-sm">Sedang Berjalan</span>}
                                                        {(stage.status === 'completed' || stage.status === 'COMPLETED' || stage.status === 'selesai') && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 font-bold uppercase rounded-sm">Selesai</span>}
                                                        {(stage.status === 'pending' || stage.status === 'PENDING' || stage.status === 'menunggu') && <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 font-bold uppercase rounded-sm">Menunggu</span>}
                                                    </div>
                                                    <div className="flex gap-2 text-black/50 flex-shrink-0 ml-2">
                                                        <button onClick={() => openEditMs(stage)} className="hover:text-[#396680] transition-colors"><Pencil size={14} /></button>
                                                        <button onClick={() => handleDeleteMilestone(stage.id)} className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                                <p className="text-black/80 text-xs font-semibold mb-1">{stage.description}</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[#396680] text-[10px] font-bold uppercase tracking-widest">{(stage.status === 'COMPLETED' || stage.status === 'completed' || stage.status === 'selesai') ? 'SELESAI' : (stage.status === 'ON_PROGRESS' || stage.status === 'in_progress' || stage.status === 'berjalan') ? 'BERJALAN' : (stage.status === 'PENDING' || stage.status === 'pending' || stage.status === 'menunggu') ? 'MENUNGGU' : stage.status}</p>
                                                    {stage.targetDate && (
                                                        <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest">
                                                            Target: {new Date(stage.targetDate).toLocaleDateString('id-ID')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-black">
                                <h4 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                                    {editingMs ? <Pencil size={18} className="text-black/60" /> : <Plus size={18} className="text-black/60" />} {editingMs ? 'Edit Tahapan' : 'Tambah Tahap Baru'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-black mb-1">Judul Tahapan</label>
                                        <input type="text" value={newMs.title} onChange={(e) => setNewMs({ ...newMs, title: e.target.value })} placeholder="Misal: Finishing Interior" className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680] text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-black mb-1">Status</label>
                                        <select value={newMs.status} onChange={(e) => setNewMs({ ...newMs, status: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680] text-sm font-medium">
                                            <option value="pending">MENUNGGU</option>
                                            <option value="in_progress">BERJALAN</option>
                                            <option value="completed">SELESAI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-black mb-1">Target Selesai</label>
                                        <input type="date" value={newMs.targetDate} onChange={(e) => setNewMs({ ...newMs, targetDate: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680] text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-black mb-1">Keterangan Singkat</label>
                                        <input type="text" value={newMs.description} onChange={(e) => setNewMs({ ...newMs, description: e.target.value })} placeholder="Opsional..." className="w-full px-4 py-2.5 rounded-lg border border-black bg-white focus:outline-none focus:border-[#396680] text-sm font-medium" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleAddMilestone} className="flex-1 py-3 bg-[#396680] hover:bg-[#2d5166] text-white text-sm font-bold rounded-xl transition-all shadow-md">
                                        {editingMs ? 'Simpan Perubahan' : 'Tambah Tahapan'}
                                    </button>
                                    {editingMs && (
                                        <button type="button" onClick={() => { setEditingMs(null); setNewMs({ title: '', status: 'pending', targetDate: '', description: '' }) }} className="px-4 py-3 bg-dark-100 text-black text-sm font-bold rounded-xl hover:bg-dark-200 transition-all">Batal</button>
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
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Pembaruan Lapangan</h2>
                                <p className="text-white/80 text-sm">Unggah dan kelola dokumentasi progres proyek</p>
                            </div>
                            <button onClick={() => { previewUrls.forEach(url => URL.revokeObjectURL(url)); setPreviewUrls([]); setNewDoc({ files: [], description: '' }); setShowGalleryModal(false) }} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <X />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA]">

                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-black mb-8 flex flex-col items-center justify-center text-center hover:bg-dark-50/30 transition-colors">
                                <div className="w-16 h-16 bg-[#F0F4F8] rounded-full flex items-center justify-center text-[#396680] mb-4 shadow-sm">
                                    <Upload size={32} />
                                </div>
                                <h4 className="font-bold text-dark-900 text-lg mb-1">Unggah Foto Pembaruan Baru</h4>
                                <p className="text-black/70 font-semibold text-sm mb-5">Mendukung format gambar JPG, PNG, HEIC/HEIF</p>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                        <label className="flex-1 px-4 py-3 rounded-xl border border-black text-sm cursor-pointer hover:bg-dark-50 transition-colors flex items-center gap-2">
                                            <span className="px-3 py-1 bg-[#396680]/10 text-[#396680] font-bold text-xs rounded-lg">Pilih File</span>
                                            <span className="text-black font-semibold truncate">{newDoc.files.length > 0 ? `${newDoc.files.length} file dipilih` : 'Belum ada file dipilih'}</span>
                                            <input type="file" multiple onChange={handleFileSelect} className="hidden" accept="image/*,.heic,.heif" />
                                        </label>
                                        <button type="button" onClick={handleUploadDoc} disabled={uploadingDoc} className="px-6 py-3 bg-[#396680] hover:bg-[#2d5166] text-white text-sm font-bold rounded-xl transition-all shadow-md whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                            {uploadingDoc ? <><Loader2 size={16} className="animate-spin" /> Mengunggah...</> : 'Unggah Foto'}
                                        </button>
                                    </div>
                                    {previewUrls.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {previewUrls.map((url, idx) => (
                                                <div key={idx} className="relative w-[120px] aspect-video rounded-xl overflow-hidden border-2 border-black/20 cursor-pointer" onClick={() => setLightboxImage({ src: url, alt: newDoc.files[idx]?.name || 'Preview' })}>
                                                    <img src={url} alt="Preview" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); URL.revokeObjectURL(url); setPreviewUrls(prev => prev.filter((_, i) => i !== idx)); setNewDoc(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) })) }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h4 className="font-bold text-black mb-5 flex items-center gap-2">
                                <Image size={20} className="text-black" /> Daftar Dokumentasi Tersimpan
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {docLoading ? (
                                    <p className="col-span-4 text-center py-8 text-black font-semibold">Memuat galeri...</p>
                                ) : documents.length === 0 ? (
                                    <p className="col-span-4 text-center py-8 text-black/80 font-bold italic">Belum ada foto yang diunggah.</p>
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
                                                <p className="text-[10px] sm:text-xs font-bold text-black/70 uppercase tracking-wider mb-1 line-clamp-1">
                                                    {(() => {
                                                        const match = (photo.fileUrl || '').split('/').pop()?.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
                                                        if (match) {
                                                            const d = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:00Z`);
                                                            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                                                        }
                                                        return new Date(photo.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                                                    })()}
                                                </p>
                                                <h5 className="font-bold text-black text-xs sm:text-sm leading-tight line-clamp-2">
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
                                        className="px-6 py-2 bg-dark-50 hover:bg-dark-100 text-black font-bold rounded-full text-sm transition-all border border-dark-200"
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



