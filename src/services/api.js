import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
    baseURL,
    timeout: 30000,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            const isAuthRequest = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')
            const refreshToken = localStorage.getItem('refreshToken')

            if (!isAuthRequest && refreshToken) {
                originalRequest._retry = true

                try {
                    const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
                    const newToken = response.data.data.token
                    const newRefreshToken = response.data.data.refreshToken

                    localStorage.setItem('token', newToken)
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken)
                    }

                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return api(originalRequest)
                } catch (refreshError) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    localStorage.removeItem('user')
                    window.location.href = '/admin/login'
                    return Promise.reject(refreshError)
                }
            }

            if (!isAuthRequest) {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
                window.location.href = '/admin/login'
            }
        }

        return Promise.reject(error)
    }
)

export default api