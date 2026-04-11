import { useState, useEffect } from 'react'
import { getAllProjects, createProject, updateProject, deleteProject } from '../../services/projectService'
import { FaPlus, FaPen, FaTrash, FaTimes, FaBuilding, FaChartLine, FaChevronDown, FaChevronLeft, FaChevronRight, FaCheckCircle, FaRegCircle, FaUpload, FaImage } from 'react-icons/fa'

const ProjectManagement = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showTimelineModal, setShowTimelineModal] = useState(false)
    const [showGalleryModal, setShowGalleryModal] = useState(false)
    const [mockTimeline] = useState([
        { id: 1, title: 'Perencanaan & Desain', status: 'completed', date: 'Selesai pada 10 Jan 2024' },
        { id: 2, title: 'Instalasi MEP', status: 'in-progress', date: 'Estimasi selesai: 15 Mar 2024' }
    ])
    const [mockGallery] = useState([
        { id: 1, title: 'Struktur Selesai', date: '28 Feb 2024', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300&auto=format&fit=crop' },
        { id: 2, title: 'Pengecekan Saluran Air', date: 'Kemarin', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=300&auto=format&fit=crop' },
        { id: 3, title: 'Material Eksterior', date: 'Hari ini, 10:30', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop' }
    ])
    const [editingProject, setEditingProject] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        address: '',
        category: 'Konstruksi',
        description: '',
        progress: 0,
        stage: '',
        status: 'active',
    })

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await getAllProjects()
            setProjects(response.data)
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const resetForm = () => {
        setFormData({ title: '', client: '', address: '', category: 'Konstruksi', description: '', progress: 0, stage: '', status: 'active' })
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
            address: project.address || '',
            category: project.category,
            description: project.description,
            progress: project.progress,
            stage: project.stage,
            status: project.status,
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData)
            } else {
                await createProject(formData)
            }
            setShowModal(false)
            resetForm()
            fetchProjects()
        } catch (error) {
            console.error('Error saving project:', error)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus proyek ini?')) return
        try {
            await deleteProject(id)
            fetchProjects()
        } catch (error) {
            console.error('Error deleting project:', error)
        }
    }

    return (
        <div className="pb-12 max-w-7xl mx-auto w-full">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="inline-flex px-3 py-1 bg-[#E2E8EC] rounded-full mb-3">
                        <span className="text-[9px] font-extrabold text-[#658797] tracking-widest uppercase">SISTEM INVENTORI</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight mb-2">Manajemen Proyek</h1>
                    <p className="text-dark-500 font-medium">Pantau dan kelola semua proyek konstruksi & interior Anda secara real-time.</p>
                </div>
                <div className="mt-2 md:mt-0 flex-shrink-0">
                    <button onClick={openCreate} className="px-6 py-3.5 bg-[#658797] hover:bg-[#527181] text-white font-bold rounded-full shadow-md transition-all flex items-center gap-2">
                        <FaPlus className="text-sm" /> Tambah Proyek Baru
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                
                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex items-center justify-between w-full lg:w-[280px] relative overflow-hidden flex-shrink-0">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-1">Total Proyek</p>
                        <p className="text-4xl font-extrabold text-dark-900">{projects.length > 0 ? projects.length : 42}</p>
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-dark-400">
                        <FaBuilding className="text-5xl" />
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-md border border-dark-100/50 hover:shadow-lg transition-shadow flex-1 flex flex-col sm:flex-row items-end gap-4 lg:gap-6">
                    <div className="flex-1 w-full relative">
                        <label className="block text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-2">Kategori</label>
                        <select className="w-full px-5 py-3 rounded-xl border border-dark-100 bg-transparent text-dark-900 font-bold text-sm focus:outline-none appearance-none cursor-pointer">
                            <option>Semua Kategori</option>
                            <option>Konstruksi</option>
                            <option>Design and Build</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 text-dark-300 pointer-events-none">
                            <FaChevronDown className="text-xs" />
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <label className="block text-[10px] font-bold text-dark-400 tracking-widest uppercase mb-2">Status</label>
                        <select className="w-full px-5 py-3 rounded-xl border border-dark-100 bg-transparent text-dark-900 font-bold text-sm focus:outline-none appearance-none cursor-pointer">
                            <option>Semua Status</option>
                            <option>Aktif</option>
                            <option>Perencanaan</option>
                            <option>Selesai</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 text-dark-300 pointer-events-none">
                            <FaChevronDown className="text-xs" />
                        </div>
                    </div>
                    <div className="w-full sm:w-auto flex-shrink-0">
                        <button className="w-full sm:w-auto px-8 py-3 bg-dark-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all">
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
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-dark-400 font-medium">Belum ada proyek yang ditambahkan.</td>
                                </tr>
                            ) : (
                                projects.map((project) => {
                                    
                                    const isKonstruksi = project.category?.toLowerCase().includes('konstruksi');
                                    let statusColorText = 'text-blue-500';
                                    let statusDot = 'bg-blue-500';
                                    let statusLabel = 'Aktif';

                                    if (project.status === 'completed' || project.status?.toLowerCase() === 'selesai') {
                                        statusColorText = 'text-green-500';
                                        statusDot = 'bg-green-500';
                                        statusLabel = 'Selesai';
                                    } else if (project.status === 'pending' || project.status?.toLowerCase() === 'perencanaan') {
                                        statusColorText = 'text-orange-500';
                                        statusDot = 'bg-orange-500';
                                        statusLabel = 'Perencanaan';
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
                                                <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${isKonstruksi ? 'bg-[#F0F4F8] text-[#658797]' : 'bg-[#F4F4F4] text-dark-500'}`}>
                                                    {project.category || (isKonstruksi ? 'Konstruksi' : 'Design and Build')}
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
                                                        <FaPen className="text-[17px]" />
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)} className="text-dark-300 hover:text-red-500 transition-colors" title="Hapus">
                                                        <FaTrash className="text-[17px]" />
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
                        Menampilkan 3 Dari {projects.length || 42} Proyek
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center text-dark-400 hover:bg-dark-50 hover:text-dark-900 transition-colors">
                            <FaChevronLeft className="text-[10px]" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#658797] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            1
                        </button>
                        <button className="w-8 h-8 rounded-full bg-transparent text-dark-500 font-bold text-xs flex items-center justify-center hover:bg-dark-50 hover:text-dark-900 transition-colors">
                            2
                        </button>
                        <button className="w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center text-dark-400 hover:bg-dark-50 hover:text-dark-900 transition-colors">
                            <FaChevronRight className="text-[10px]" />
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-dark-100">
                            <h2 className="text-xl font-bold text-dark-900">
                                {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                            </h2>
                            <button onClick={() => { setShowModal(false); resetForm() }} className="text-dark-400 hover:text-dark-600">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Judul Proyek</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:border-transparent" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Nama Klien</label>
                                    <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:border-transparent" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Alamat Proyek</label>
                                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:border-transparent" placeholder="Contoh: Jl. Kemang Raya No. 12" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Kategori</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797]">
                                        <option value="Konstruksi">Konstruksi</option>
                                        <option value="Design and Build">Design and Build</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Status Proyek</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797]">
                                        <option value="active">AKTIF</option>
                                        <option value="completed">SELESAI</option>
                                        <option value="pending">PERENCANAAN</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Deskripsi & Catatan Spesifik</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2} className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:border-transparent resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Total Progres ({formData.progress}%)</label>
                                    <input type="range" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                                        className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">Tahap Saat Ini</label>
                                    <input type="text" value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                        placeholder="misal: Instalasi MEP" className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:border-transparent" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dark-100">
                                <h4 className="text-sm font-bold text-dark-900 mb-3 flex items-center gap-2">Data Lanjutan (Terhubung ke Cek Progress di Halaman User)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setShowTimelineModal(true)} className="w-full px-4 py-3 rounded-xl border border-dashed border-dark-300 bg-dark-50 text-dark-500 text-sm font-bold hover:border-[#658797] hover:text-[#658797] hover:bg-white transition-all text-center">
                                        + Manajemen Timeline Tahapan
                                    </button>
                                    <button type="button" onClick={() => setShowGalleryModal(true)} className="w-full px-4 py-3 rounded-xl border border-dashed border-dark-300 bg-dark-50 text-dark-500 text-sm font-bold hover:border-[#658797] hover:text-[#658797] hover:bg-white transition-all text-center">
                                        + Unggah Pembaruan Lapangan
                                    </button>
                                </div>
                                <p className="text-[10px] text-dark-400 mt-2 italic"></p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="btn-secondary flex-1">Batal</button>
                                <button type="submit" className="btn-primary flex-1">{editingProject ? 'Simpan Perubahan' : 'Tambah Proyek'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTimelineModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        
                        <div className="p-6 md:p-8 border-b border-[#527181] flex items-center justify-between bg-[#658797] text-white">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-white text-[#658797] rounded shadow-sm text-[10px] font-bold tracking-widest uppercase">Mockup Data</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Manajemen Timeline</h2>
                                <p className="text-white/80 text-sm">Menyusun urutan tahapan & checklist proyek</p>
                            </div>
                            <button onClick={() => setShowTimelineModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA]">
                            <div className="space-y-4 mb-8">
                                {mockTimeline.map((stage) => (
                                    <div key={stage.id} className="bg-white p-5 rounded-2xl border border-dark-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <div className="mt-1">
                                            {stage.status === 'completed' ? (
                                                <FaCheckCircle className="text-green-500 text-xl" />
                                            ) : stage.status === 'in-progress' ? (
                                                <div className="w-5 h-5 rounded-full border-4 border-[#658797] bg-white"></div>
                                            ) : (
                                                <FaRegCircle className="text-dark-300 text-xl" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-dark-900 text-lg">{stage.title}</h4>
                                                    {stage.status === 'in-progress' && <span className="text-[10px] px-2 py-0.5 bg-[#658797]/10 text-[#658797] font-bold uppercase rounded-sm">Sedang Berjalan</span>}
                                                </div>
                                                <div className="flex gap-2 text-dark-300">
                                                    <button className="hover:text-dark-900 transition-colors"><FaPen className="text-sm" /></button>
                                                    <button className="hover:text-red-500 transition-colors"><FaTrash className="text-sm" /></button>
                                                </div>
                                            </div>
                                            <p className="text-dark-400 text-xs font-medium mb-3">{stage.date}</p>

                                            {stage.status === 'in-progress' && (
                                                <div className="bg-dark-50 rounded-xl p-4 border border-dark-100 mt-2">
                                                    <h5 className="text-[10px] uppercase tracking-widest font-bold text-dark-500 mb-3">Sub-Tugas (Checklist)</h5>
                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-3 text-sm text-dark-900 cursor-pointer group">
                                                            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#658797] rounded border-dark-300 focus:ring-[#658797]" />
                                                            <span className="line-through opacity-50 group-hover:opacity-100 transition-opacity">Pemasangan Pipa Kasar Instalasi</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 text-sm text-dark-900 cursor-pointer group">
                                                            <input type="checkbox" className="w-4 h-4 text-[#658797] rounded border-dark-300 focus:ring-[#658797]" />
                                                            <span>Pemasangan Saluran Kelistrikan HVAC</span>
                                                        </label>
                                                        <div className="pt-2">
                                                            <button className="text-xs font-bold text-[#658797] hover:text-[#527181]">+ Tambah Sub-Tugas Baru</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-5 md:p-6 rounded-2xl border-2 border-dashed border-dark-200">
                                <h4 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                                    <FaPlus className="text-dark-400" /> Tambah Tahap Baru
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-500 mb-1">Judul Tahapan</label>
                                        <input type="text" placeholder="Misal: Finishing Interior" className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-500 mb-1">Status Prioritas</label>
                                        <select className="w-full px-4 py-2.5 rounded-lg border border-dark-200 focus:ring-2 focus:ring-[#658797] focus:outline-none text-sm font-medium">
                                            <option>Menunggu / Akan Datang</option>
                                            <option>Sedang Berjalan</option>
                                            <option>Selesai</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="button" className="w-full py-3 bg-[#658797] hover:bg-[#527181] text-white text-sm font-bold rounded-xl transition-all shadow-md">Simpan Tahapan Timeline</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showGalleryModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        
                        <div className="p-6 md:p-8 border-b border-[#527181] flex items-center justify-between bg-[#658797] text-white">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 bg-white text-[#658797] rounded shadow-sm text-[10px] font-bold tracking-widest uppercase">Mockup Data</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Pembaruan Lapangan</h2>
                                <p className="text-white/80 text-sm">Unggah dan kelola dokumentasi visual progres proyek</p>
                            </div>
                            <button onClick={() => setShowGalleryModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA]">
                            
                            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-dashed border-dark-200 mb-8 flex flex-col items-center justify-center text-center hover:bg-dark-50/30 transition-colors">
                                <div className="w-16 h-16 bg-[#F0F4F8] rounded-full flex items-center justify-center text-[#658797] mb-4 shadow-sm">
                                    <FaUpload className="text-2xl" />
                                </div>
                                <h4 className="font-bold text-dark-900 text-lg mb-1">Unggah Foto Pembaruan Baru</h4>
                                <p className="text-dark-400 text-sm mb-5">Mendukung format gambar JPG, PNG (Maks 5MB)</p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                                    <input type="text" placeholder="Tuliskan keterangan foto..." className="flex-1 px-4 py-3 rounded-xl border border-dark-200 text-sm outline-none focus:ring-2 focus:ring-[#658797]" />
                                    <button type="button" className="px-6 py-3 bg-[#658797] hover:bg-[#527181] text-white text-sm font-bold rounded-xl transition-all shadow-md">
                                        Pilih Foto...
                                    </button>
                                </div>
                            </div>

                            <h4 className="font-bold text-dark-900 mb-5 flex items-center gap-2">
                                <FaImage className="text-dark-400 text-lg" /> Daftar Dokumentasi Tersimpan
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {mockGallery.map((photo) => (
                                    <div key={photo.id} className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden group shadow-sm bg-white border border-dark-100 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="h-[65%] sm:h-3/4 relative overflow-hidden bg-dark-50">
                                            <img src={photo.image} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all">
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 lg:p-4 bg-white flex-1 flex flex-col justify-center border-t border-dark-100">
                                            <p className="text-[10px] sm:text-xs font-bold text-dark-400 uppercase tracking-wider mb-1 line-clamp-1">{photo.date}</p>
                                            <h5 className="font-bold text-dark-900 text-xs sm:text-sm leading-tight line-clamp-2">{photo.title}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectManagement
