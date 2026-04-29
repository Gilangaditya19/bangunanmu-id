const WHATSAPP_NUMBER = '6281368227031'

/**
 * Generate WhatsApp URL with pre-filled message
 * @param {string} serviceName - Nama layanan yang diminati
 * @param {string} customMessage - Pesan kustom (opsional)
 * @returns {string} WhatsApp API URL
 */
export const generateWhatsAppUrl = (serviceName = '', customMessage = '') => {
    const defaultMessage = serviceName
        ? `Halo Bangunanmu.id, saya tertarik dengan layanan *${serviceName}*. Bisakah saya mendapatkan informasi lebih lanjut?`
        : `Halo Bangunanmu.id, saya ingin berkonsultasi mengenai proyek saya. Bisakah saya mendapatkan informasi lebih lanjut?`

    const message = customMessage || defaultMessage
    const encodedMessage = encodeURIComponent(message)

    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`
}

/**
 * Open WhatsApp in a new tab
 * @param {string} serviceName - Nama layanan
 * @param {string} customMessage - Pesan kustom (opsional)
 */
export const openWhatsApp = (serviceName = '', customMessage = '') => {
    const url = generateWhatsAppUrl(serviceName, customMessage)
    window.open(url, '_blank', 'noopener,noreferrer')
}

export default { generateWhatsAppUrl, openWhatsApp, WHATSAPP_NUMBER }
