import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X, MessageCircle } from 'lucide-react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Hapus', cancelText = 'Batal', type = 'danger' }) => {
    // Lock body scroll & handle ESC key
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'

            const handleEsc = (e) => {
                if (e.key === 'Escape') onClose()
            }
            document.addEventListener('keydown', handleEsc)

            return () => {
                document.body.style.overflow = originalOverflow
                document.removeEventListener('keydown', handleEsc)
            }
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const colors = {
        danger: {
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            button: 'bg-red-500 hover:bg-red-600',
        },
        warning: {
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            button: 'bg-amber-500 hover:bg-amber-600',
        },
        info: {
            iconBg: 'bg-[#396680]/10',
            iconColor: 'text-[#396680]',
            button: 'bg-[#396680] hover:bg-[#2d5166]',
        },
    }

    const c = colors[type] || colors.danger
    const Icon = type === 'info' ? MessageCircle : AlertTriangle

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={24} className={c.iconColor} />
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-dark-900 mb-2 tracking-tight">{title}</h3>
                            <p className="text-dark-500 text-sm leading-relaxed">{message}</p>
                        </div>
                        <button onClick={onClose} className="text-dark-400 hover:text-dark-600 flex-shrink-0">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl bg-dark-50 hover:bg-dark-100 text-dark-700 font-bold text-sm transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose() }}
                        className={`flex-1 py-3 px-4 rounded-xl ${c.button} text-white font-bold text-sm transition-colors shadow-md`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmDialog
