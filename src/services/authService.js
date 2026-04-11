// import api from './api'

/**
 * Auth Service
 * Handles authentication-related API calls
 * TODO: Replace mock data with actual API calls when backend is ready
 */

// Mock admin credentials
const MOCK_ADMIN = {
    email: 'admin@bangunanmu.id',
    password: 'admin123',
    name: 'Admin Bangunanmu',
    role: 'admin',
}

/**
 * Login
 */
export const login = async (credentials) => {
    // TODO: return api.post('/auth/login', credentials)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                credentials.email === MOCK_ADMIN.email &&
                credentials.password === MOCK_ADMIN.password
            ) {
                const token = 'mock-jwt-token-' + Date.now()
                resolve({
                    data: {
                        token,
                        user: { name: MOCK_ADMIN.name, email: MOCK_ADMIN.email, role: MOCK_ADMIN.role },
                    },
                })
            } else {
                reject({ response: { status: 401, data: { message: 'Email atau password salah' } } })
            }
        }, 800)
    })
}

/**
 * Logout
 */
export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

/**
 * Get current auth state
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (user && token) {
        return JSON.parse(user)
    }
    return null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}
