import api from './api'

export const login = async (credentials) => {
    try {

        const response = await api.post('/auth/login', credentials);


        const token = response.data.data.token;
        const user = response.data.data.user;


        return {
            data: {
                token: token,
                user: user
            }
        };
    } catch (error) {

        throw error;
    }
}

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
