const WHATSAPP_NUMBER = '6281368227031'


export const generateWhatsAppUrl = (serviceName = '', customMessage = '') => {
    const defaultMessage = serviceName
        ? `Halo Bangunanmu.id, saya tertarik dengan layanan *${serviceName}*. Bisakah saya mendapatkan informasi lebih lanjut?`
        : `Halo Bangunanmu.id, saya ingin berkonsultasi mengenai proyek saya. Bisakah saya mendapatkan informasi lebih lanjut?`

    const message = customMessage || defaultMessage
    const encodedMessage = encodeURIComponent(message)

    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`
}


export const openWhatsApp = (serviceName = '', customMessage = '') => {
    const url = generateWhatsAppUrl(serviceName, customMessage)
    window.open(url, '_blank', 'noopener,noreferrer')
}

// Format nomor HP ke format internasional (628xxx)
export const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
    } else if (cleaned.startsWith('8')) {
        cleaned = '62' + cleaned
    }
    return cleaned
}

// Buka WhatsApp ke nomor klien dengan pesan ID proyek
export const sendProjectIdToClient = ({ phone, clientName, projectCode, projectName }) => {
    const formattedPhone = formatPhoneNumber(phone)
    if (!formattedPhone) return

    const message = `Halo ${clientName},\n\nTerima kasih telah mempercayakan proyek *${projectName}* kepada Bangunanmu.id.\n\nBerikut adalah ID Proyek Anda:\n*${projectCode}*\n\nGunakan ID ini untuk melacak progres proyek Anda di halaman *Cek Progress* di website kami.\n\nTim Bangunanmu.id`

    const encodedMessage = encodeURIComponent(message)
    const url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
    window.open(url, '_blank', 'noopener,noreferrer')
}

export default { generateWhatsAppUrl, openWhatsApp, sendProjectIdToClient, formatPhoneNumber, WHATSAPP_NUMBER }
