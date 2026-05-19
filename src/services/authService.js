import api from './api'

export const login = async (credentials) => {
    try {

        const response = await api.post('/auth/login', credentials);
        

        const token = response.data.data.token;
        const user = response.data.data.user;
        const refreshToken = response.data.data.refreshToken;


        return {
            data: {
                token: token,
                user: user,
                refreshToken: refreshToken
            }
        };
    } catch (error) {

        throw error;
    }
}

export const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile')
        return response.data.data.user
    } catch (error) {
        throw error
    }
}
export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken')
        await api.post('/auth/logout', { refreshToken })
    } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    }
}

export const getCurrentUser = () => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (user && token) {
        try {
            return JSON.parse(user)
        } catch {
            return null
        }
    }
    return null
}

export const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}
