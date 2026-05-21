import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, logout } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        try {
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    })
    const [loading, setLoading] = useState(() => !!localStorage.getItem('token'))
    const isAuthenticated = !!user && !!localStorage.getItem('token')

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const profile = await getProfile()
                localStorage.setItem('user', JSON.stringify(profile))
                setUser(profile)
            } catch (error) {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    const loginUser = (userData, token, refreshToken) => {
        localStorage.setItem('token', token)
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
        }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
    }

    const logoutUser = async () => {
        try {
            await logout()
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext