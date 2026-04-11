// import api from './api'

/**
 * Testimonial Service
 * Handles all testimonial-related API calls
 * TODO: Replace mock data with actual API calls when backend is ready
 */

// Mock data
const mockTestimonials = [
    {
        id: 1,
        name: 'Bapak Ahmad Wijaya',
        review: 'Hasil kerja sangat memuaskan! Tim Bangunanmu.id sangat profesional dan tepat waktu. Rumah kami sekarang terasa seperti baru.',
        rating: 5,
        project: 'Renovasi Rumah',
        isApproved: true,
        createdAt: '2025-01-20',
    },
    {
        id: 2,
        name: 'Ibu Sari Dewi',
        review: 'Kitchen set custom yang dibuat sangat berkualitas. Desainnya modern dan sesuai dengan keinginan kami. Terima kasih Bangunanmu.id!',
        rating: 5,
        project: 'Kitchen Set Custom',
        isApproved: true,
        createdAt: '2025-02-05',
    },
    {
        id: 3,
        name: 'Bapak Rudi Hartono',
        review: 'Proses pengerjaan cepat dan hasilnya rapi. Akan merekomendasikan Bangunanmu.id ke teman dan keluarga.',
        rating: 4,
        project: 'Pembangunan Carport',
        isApproved: true,
        createdAt: '2024-12-15',
    },
    {
        id: 4,
        name: 'Ibu Linda Kusuma',
        review: 'Layanan bagus, hanya saja ada sedikit keterlambatan di awal. Overall puas dengan hasilnya.',
        rating: 4,
        project: 'Interior Ruang Tamu',
        isApproved: false,
        createdAt: '2025-02-18',
    },
]

/**
 * Get approved testimonials (Public)
 */
export const getApprovedTestimonials = async () => {
    // TODO: return api.get('/testimonials?approved=true')
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: mockTestimonials.filter((t) => t.isApproved) })
        }, 500)
    })
}

/**
 * Get all testimonials (Admin)
 */
export const getAllTestimonials = async () => {
    // TODO: return api.get('/testimonials')
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockTestimonials }), 500)
    })
}

/**
 * Update testimonial approval status (Admin)
 */
export const updateTestimonialStatus = async (id, isApproved) => {
    // TODO: return api.patch(`/testimonials/${id}`, { isApproved })
    return new Promise((resolve, reject) => {
        const index = mockTestimonials.findIndex((t) => t.id === id)
        if (index !== -1) {
            mockTestimonials[index].isApproved = isApproved
            setTimeout(() => resolve({ data: mockTestimonials[index] }), 500)
        } else {
            reject({ response: { status: 404 } })
        }
    })
}

/**
 * Delete testimonial (Admin)
 */
export const deleteTestimonial = async (id) => {
    // TODO: return api.delete(`/testimonials/${id}`)
    return new Promise((resolve, reject) => {
        const index = mockTestimonials.findIndex((t) => t.id === id)
        if (index !== -1) {
            mockTestimonials.splice(index, 1)
            setTimeout(() => resolve({ data: { message: 'Deleted' } }), 500)
        } else {
            reject({ response: { status: 404 } })
        }
    })
}
