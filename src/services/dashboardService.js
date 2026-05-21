import api from './api'

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/dashboard/stats')
        return response.data
    } catch (error) {
        console.error('Get Dashboard Stats Error:', error.response?.data || error)
        throw error
    }
}