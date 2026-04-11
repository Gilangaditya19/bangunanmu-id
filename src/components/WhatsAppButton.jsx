import { FaWhatsapp } from 'react-icons/fa'
import { openWhatsApp } from '../utils/whatsapp'

const WhatsAppButton = ({
    serviceName = '',
    label = 'Hubungi via WhatsApp',
    customMessage = '',
    className = '',
    size = 'md',
    variant = 'green',
}) => {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    const variantClasses = {
        green: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-400',
        white: 'bg-white text-[#658797] hover:bg-white/90 active:bg-white/80 focus:ring-white/50',
    }

    const handleClick = () => {
        openWhatsApp(serviceName, customMessage)
    }

    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-0.5 active:translate-y-0'

    return (
        <button
            onClick={handleClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            aria-label={`Hubungi kami via WhatsApp${serviceName ? ` untuk ${serviceName}` : ''}`}
        >
            <FaWhatsapp className="text-xl" />
            <span>{label}</span>
        </button>
    )
}

export default WhatsAppButton
