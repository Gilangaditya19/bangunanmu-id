import api from './api'

export const getProjectById = async (id) => {
    return api.get(`/projects/${id}`)
}

export const getAllProjects = async () => {
    try {
        const response = await api.get('/projects')
        const rawData = response.data.data.data || []
        
        const mappedData = rawData.map(p => ({
            id: p.projectCode,
            title: p.projectName,
            client: p.customerName,
            address: p.customerAddress,
            category: p.projectType === 'design_and_build' ? 'Design and Build' : 'Konstruksi',
            description: p.description,
            progress: p.progress,
            stage: 'Tahapan Saat Ini',
            status: p.status,
            createdAt: p.createdAt
        }))
        return { data: mappedData }
    } catch (error) {
        throw error
    }
}

export const getCompletedProjects = async () => {
    try {
        const response = await getAllProjects()
        return { data: response.data.filter(p => p.status === 'completed') }
    } catch (error) {
        throw error
    }
}

export const createProject = async (data) => {
    try {
        const payload = {
            projectName: data.title,
            projectType: data.category?.toLowerCase().includes('konstruksi') ? 'konstruksi' : 'design_and_build',
            customerName: data.client,
            customerEmail: `${data.client.replace(/\s+/g, '').toLowerCase()}@example.com`,
            customerPhone: '081234567890',
            customerAddress: data.address || '-',
            description: data.description || '-',
            progress: data.progress || 0,
            startDate: new Date().toISOString(),
            estimatedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        }
        const response = await api.post('/projects', payload)
        return response.data
    } catch (error) {
        console.error('Create Project Error:', error.response?.data || error)
        throw error
    }
}

export const updateProject = async (id, data) => {
    try {
        const payload = {
            projectName: data.title,
            projectType: data.category?.toLowerCase().includes('konstruksi') ? 'konstruksi' : 'design_and_build',
            customerName: data.client,
            customerAddress: data.address || '-',
            description: data.description || '-',
            status: data.status,
            progress: data.progress || 0
        }
        const response = await api.put(`/projects/${id}`, payload)
        return response.data
    } catch (error) {
        console.error('Update Project Error:', error.response?.data || error)
        throw error
    }
}

export const deleteProject = async (id) => {
    try {
        const response = await api.delete(`/projects/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}





export const getMilestones = async (projectCode) => {
    try {
        const response = await api.get(`/projects/${projectCode}/milestones`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const addMilestone = async (projectCode, data) => {
    try {
        const response = await api.post(`/projects/${projectCode}/milestones`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateMilestone = async (projectCode, milestoneId, data) => {
    try {
        const response = await api.patch(`/projects/${projectCode}/milestones/${milestoneId}`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteMilestone = async (projectCode, milestoneId) => {
    try {
        const response = await api.delete(`/projects/${projectCode}/milestones/${milestoneId}`)
        return response.data
    } catch (error) {
        throw error
    }
}





export const getDocuments = async (projectCode) => {
    try {
        const response = await api.get(`/projects/${projectCode}/documents`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const uploadDocument = async (projectCode, file, description) => {
    try {
        const formData = new FormData()
        formData.append('document', file)
        if (description) formData.append('description', description)

        const response = await api.post(`/projects/${projectCode}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteDocument = async (projectCode, documentId) => {
    try {
        const response = await api.delete(`/projects/${projectCode}/documents/${documentId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
