import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Lock, Key, CheckCircle2, Eye, EyeOff, Save } from 'lucide-react'

const Settings = () => {
    const { user, logoutUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
        setSuccess('')
    }

    const togglePassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Konfirmasi kata sandi tidak cocok!')
            return
        }

        if (formData.newPassword.length < 8) {
            setError('Kata sandi baru minimal harus 8 karakter')
            return
        }

        setLoading(true)
        setError('')

        try {
            try {
                await api.post('/auth/login', {
                    email: user.email,
                    password: formData.currentPassword
                })
            } catch (err) {
                throw new Error('Kata sandi saat ini salah.')
            }

            const userId = user._id?.$oid || user._id || user.id
            await api.put(`/users/${userId}`, {
                password: formData.newPassword
            })

            setSuccess('Kata sandi berhasil diubah! Silakan login kembali.')
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })

            setTimeout(async () => {
                await logoutUser()
                window.location.href = '/admin/login'
            }, 2500)
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat mengubah kata sandi')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full flex flex-col items-center justify-center relative pb-12">

            <div className="w-full max-w-2xl flex flex-col items-center">

                {}
                <div className="w-full bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">

                    {}
                    <div className="flex flex-col mb-8 text-center items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">Ganti Kata Sandi</h1>
                        <p className="text-dark-500 font-medium text-sm">Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 font-medium text-sm text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {}
                        <div>
                            <label className="block text-sm font-bold text-dark-900 mb-2">Kata Sandi Saat Ini</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-dark-300">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Masukkan kata sandi saat ini"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#396680]/30 focus:border-[#396680] transition-all text-dark-900 placeholder:text-dark-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('current')}
                                    className="absolute right-4 text-dark-300 hover:text-dark-600 focus:outline-none"
                                >
                                    {showPassword.current ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100 my-4"></div>

                        {}
                        <div>
                            <label className="block text-sm font-bold text-dark-900 mb-2">Kata Sandi Baru</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-dark-300">
                                    <Key size={18} />
                                </div>
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Masukkan kata sandi baru"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#396680]/30 focus:border-[#396680] transition-all text-dark-900 placeholder:text-dark-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('new')}
                                    className="absolute right-4 text-dark-300 hover:text-dark-600 focus:outline-none"
                                >
                                    {showPassword.new ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] font-bold text-dark-400 mt-2 tracking-wider uppercase ml-2">
                                MINIMAL 8 KARAKTER, KOMBINASI HURUF DAN ANGKA.
                            </p>
                        </div>

                        {}
                        <div>
                            <label className="block text-sm font-bold text-dark-900 mb-2">Konfirmasi Kata Sandi Baru</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-dark-300">
                                    <CheckCircle2 size={18} />
                                </div>
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ulangi kata sandi baru"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#396680]/30 focus:border-[#396680] transition-all text-dark-900 placeholder:text-dark-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('confirm')}
                                    className="absolute right-4 text-dark-300 hover:text-dark-600 focus:outline-none"
                                >
                                    {showPassword.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="flex items-center justify-end gap-4 pt-6 mt-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                                className="px-6 py-3 text-sm font-bold text-dark-500 hover:text-dark-900 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-md ${loading ? 'bg-[#396680]/70 cursor-not-allowed' : 'bg-[#396680] hover:bg-[#2d5166] hover:-translate-y-0.5'}`}
                            >
                                <Save size={18} />
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Settings
