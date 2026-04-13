//Nanti call API rill disini kalo udah jadi backend microservicesnya

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

export const getProjectById = async (id) => {

    return new Promise((resolve, reject) => {
        const project = mockProjects.find((p) => p.id === id)
        setTimeout(() => {
            if (project) {
                resolve({ data: project })
            } else {
                reject({ response: { status: 404, data: { message: 'Proyek tidak ditemukan' } } })
            }
        }, 800)
    })
}

export const getAllProjects = async () => {

    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockProjects }), 500)
    })
}

export const getCompletedProjects = async () => {

    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockProjects.filter((p) => p.status === 'completed') }), 500)
    })
}

export const createProject = async (data) => {

    return new Promise((resolve) => {
        const newProject = { ...data, id: `PRJ-${Date.now()}`, createdAt: new Date().toISOString() }
        mockProjects.push(newProject)
        setTimeout(() => resolve({ data: newProject }), 500)
    })
}

export const updateProject = async (id, data) => {

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

export const deleteProject = async (id) => {

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
