import api from './api'
import { FaStar } from 'react-icons/fa'

export const getApprovedTestimonials = async () => {
    try {
        const response = await api.get('/testimonials')
        return response.data
    } catch (error) {
        console.error('Error fetching approved testimonials:', error)
        throw error
    }
}

export const getAllTestimonials = async () => {
    try {
        const response = await api.get('/testimonials/admin/all')
        return response.data
    } catch (error) {
        console.error('Error fetching all testimonials:', error)
        throw error
    }
}

export const updateTestimonialStatus = async (id, isApproved) => {
    try {
        const endpoint = isApproved ? `/testimonials/admin/${id}/approve` : `/testimonials/admin/${id}/reject`
        const response = await api.patch(endpoint)
        return response.data
    } catch (error) {
        console.error('Error updating testimonial status:', error)
        throw error
    }
}

export const deleteTestimonial = async (id) => {
    try {
        const response = await api.delete(`/testimonials/admin/${id}`)
        return response.data
    } catch (error) {
        console.error('Error deleting testimonial:', error)
        throw error
    }
}
