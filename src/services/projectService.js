// import api from './api'

/**
 * Project Service
 * Handles all project-related API calls
 * TODO: Replace mock data with actual API calls when backend is ready
 */

// Mock data for development
const mockProjects = [
    {
        id: 'BGN-2023-A',
        title: 'Modern Villa - Jakarta Selatan',
        client: 'Bapak Ahmad',
        address: 'Jalan Kemang Raya No. 12, Jakarta Selatan',
        category: 'Konstruksi',
        description: 'Pembangunan villa modern tropis 3 lantai dengan kolam renang.',
        progress: 65,
        stage: 'Instalasi MEP',
        image: '/placeholder-project.jpg',
        gallery: [],
        status: 'active',
        createdAt: '2023-11-15',
    },
    {
        id: 'BGN-2023-B',
        title: 'Kitchen Set & Interior Ruko',
        client: 'Ibu Sari',
        address: 'Ruko Kebayoran Baru Blok A',
        category: 'Design and Build',
        description: 'Pembuatan kitchen set custom dan renovasi interior ruko lantai 1.',
        progress: 100,
        stage: 'Serah Terima',
        image: '/placeholder-project.jpg',
        gallery: [],
        status: 'completed',
        createdAt: '2023-10-20',
    },
    {
        id: 'BGN-2024-C',
        title: 'Cluster Harmony - Rumah Tipe 45',
        client: 'PT. Maju Jaya',
        address: 'Perumahan Harmony, Depok',
        category: 'Konstruksi',
        description: 'Pembangunan 5 unit rumah tipe 45 untuk perumahan cluster.',
        progress: 25,
        stage: 'Tahap Pondasi',
        image: '/placeholder-project.jpg',
        gallery: [],
        status: 'pending',
        createdAt: '2024-02-01',
    },
]

/**
 * Get project by ID (for Cek Progress)
 */
export const getProjectById = async (id) => {
    // TODO: return api.get(`/projects/${id}`)
    return new Promise((resolve, reject) => {
        const project = mockProjects.find((p) => p.id === id)
        setTimeout(() => {
            if (project) {
                resolve({ data: project })
            } else {
                reject({ response: { status: 404, data: { message: 'Proyek tidak ditemukan' } } })
            }
        }, 800) // Simulate network delay
    })
}

/**
 * Get all projects
 */
export const getAllProjects = async () => {
    // TODO: return api.get('/projects')
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockProjects }), 500)
    })
}

/**
 * Get completed projects (for portfolio)
 */
export const getCompletedProjects = async () => {
    // TODO: return api.get('/projects?status=completed')
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockProjects.filter((p) => p.status === 'completed') }), 500)
    })
}

/**
 * Create new project (Admin)
 */
export const createProject = async (data) => {
    // TODO: return api.post('/projects', data)
    return new Promise((resolve) => {
        const newProject = { ...data, id: `PRJ-${Date.now()}`, createdAt: new Date().toISOString() }
        mockProjects.push(newProject)
        setTimeout(() => resolve({ data: newProject }), 500)
    })
}

/**
 * Update project (Admin)
 */
export const updateProject = async (id, data) => {
    // TODO: return api.put(`/projects/${id}`, data)
    return new Promise((resolve, reject) => {
        const index = mockProjects.findIndex((p) => p.id === id)
        if (index !== -1) {
            mockProjects[index] = { ...mockProjects[index], ...data }
            setTimeout(() => resolve({ data: mockProjects[index] }), 500)
        } else {
            reject({ response: { status: 404 } })
        }
    })
}

/**
 * Delete project (Admin)
 */
export const deleteProject = async (id) => {
    // TODO: return api.delete(`/projects/${id}`)
    return new Promise((resolve, reject) => {
        const index = mockProjects.findIndex((p) => p.id === id)
        if (index !== -1) {
            mockProjects.splice(index, 1)
            setTimeout(() => resolve({ data: { message: 'Deleted' } }), 500)
        } else {
            reject({ response: { status: 404 } })
        }
    })
}
