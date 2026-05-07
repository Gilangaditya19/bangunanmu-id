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

export default { generateWhatsAppUrl, openWhatsApp, WHATSAPP_NUMBER }
