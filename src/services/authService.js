//Nanti call API rill disini kalo udah jadi backend microservicesnya

const MOCK_ADMIN = {
    email: 'admin@bangunanmu.id',
    password: 'admin123',
    name: 'Admin Bangunanmu',
    role: 'admin',
}

export const login = async (credentials) => {

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

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

export const getCurrentUser = () => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (user && token) {
        return JSON.parse(user)
    }
    return null
}

export const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}
