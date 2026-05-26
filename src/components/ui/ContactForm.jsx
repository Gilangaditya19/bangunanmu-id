import { useState } from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Konsultasi bangunan/renovasi',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const waMessage = `Halo Bangunanmu.id,\n\nSaya ${formData.name} (${formData.email}).\nSaya ingin bertanya mengenai *${formData.subject}*.\n\nPesan:\n${formData.message}`;

        openWhatsApp('', waMessage);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="block text-xs font-bold text-dark-900 px-1">Nama Lengkap</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F9FA] border-2 border-[#396680] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#396680] focus:border-[#396680] transition-all text-dark-900 placeholder-dark-400 font-medium text-sm truncate"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-bold text-dark-900 px-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="halo@contoh.com"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F9FA] border-2 border-[#396680] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#396680] focus:border-[#396680] transition-all text-dark-900 placeholder-dark-400 font-medium text-sm truncate"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-bold text-dark-900 px-1">Subjek</label>
                <div className="relative">
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full pl-4 sm:pl-5 pr-10 sm:pr-12 py-3 sm:py-3.5 bg-[#F8F9FA] border-2 border-[#396680] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#396680] focus:border-[#396680] transition-all text-dark-900 font-medium text-sm appearance-none truncate"
                    >
                        <option value="Konsultasi bangunan/renovasi">Konsultasi bangunan/renovasi</option>
                        <option value="Layanan design and build">Layanan Desain & Bangun</option>
                        <option value="Permintaan RAB">Permintaan RAB</option>
                        <option value="Kemitraan vendor/supplier">Kemitraan vendor/supplier</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-dark-500">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-bold text-dark-900 px-1">Pesan / Detail Proyek</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Ceritakan tentang proyek Anda..."
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F9FA] border-2 border-[#396680] rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#396680] focus:border-[#396680] transition-all text-dark-900 placeholder-dark-400 font-medium text-sm resize-none"
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full py-3 sm:py-4 mt-2 sm:mt-4 text-white text-sm font-bold tracking-wide rounded-xl sm:rounded-2xl bg-[#396680] hover:bg-[#2d5166] shadow-md hover:shadow-xl hover:shadow-[#396680]/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
                Kirim Pesan <MessageCircle size={18} />
            </button>
        </form>
    );
};

export default ContactForm;
