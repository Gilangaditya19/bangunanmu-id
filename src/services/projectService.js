import api from './api'

export const getProjectById = async (id) => {
    return api.get(`/projects/${id}`)
}

export const getAllProjects = async ({ page = 1, limit = 10, status, projectType, search } = {}) => {
    try {
        const params = { page, limit }
        if (status) params.status = status
        if (projectType) params.projectType = projectType
        if (search) params.search = search

        const response = await api.get('/projects', { params })
        const rawData = response.data.data.data || []
        const pagination = response.data.data.pagination || { page: 1, limit: 10, total: 0, pages: 1 }
        
        const mappedData = rawData.map(p => ({
            id: p.projectCode,
            title: p.projectName,
            client: p.customerName,
            email: p.customerEmail,
            phone: p.customerPhone,
            address: p.customerAddress,
            category: p.projectType === 'konstruksi' ? 'Konstruksi' : p.projectType === 'desain' ? 'desain' : 'Design and Build',
            description: p.description,
            progress: p.progress,
            stage: 'Tahapan Saat Ini',
            status: p.status,
            startDate: p.startDate,
            estimatedEndDate: p.estimatedEndDate,
            createdAt: p.createdAt
        }))
        return { data: mappedData, pagination }
    } catch (error) {
        throw error
    }
}

export const getCompletedProjects = async () => {
    try {
        const response = await getAllProjects({ page: 1, limit: 100 })
        return { data: response.data.filter(p => p.status === 'completed') }
    } catch (error) {
        throw error
    }
}

export const createProject = async (data) => {
    try {
        const payload = {
            projectName: data.title,
            projectType: data.category === 'Konstruksi' ? 'konstruksi' : data.category === 'desain' ? 'desain' : 'design_and_build',
            customerName: data.client,
            customerEmail: data.email,
            customerPhone: data.phone,
            customerAddress: data.address || '-',
            description: data.description || '-',
            startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
            estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate).toISOString() : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
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
            projectType: data.category === 'Konstruksi' ? 'konstruksi' : data.category === 'desain' ? 'desain' : 'design_and_build',
            customerName: data.client,
            customerEmail: data.email,
            customerPhone: data.phone,
            customerAddress: data.address || '-',
            description: data.description || '-',
            status: data.status,
            startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
            estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate).toISOString() : undefined
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
