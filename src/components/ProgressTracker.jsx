import React from 'react'
import { MapPin } from 'lucide-react'

const ProgressTracker = ({ projectData }) => {
    if (!projectData) return null

    const { title, client, progress, stage, description, gallery } = projectData

    const getProgressColor = (percent) => {
        if (percent >= 100) return 'bg-green-500'
        if (percent >= 75) return 'bg-blue-500'
        if (percent >= 50) return 'bg-yellow-500'
        if (percent >= 25) return 'bg-orange-500'
        return 'bg-red-500'
    }

    const milestones = [
        { label: 'Perencanaan', threshold: 0 },
        { label: 'Pondasi', threshold: 20 },
        { label: 'Struktur', threshold: 40 },
        { label: 'Atap & Dinding', threshold: 60 },
        { label: 'Finishing', threshold: 80 },
        { label: 'Selesai', threshold: 100 },
    ]

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            
            <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-dark-900">{title}</h3>
                <p className="text-dark-500 mt-1">Klien: {client}</p>
                {description && <p className="text-dark-400 mt-2 text-sm">{description}</p>}
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-dark-700">Progress</span>
                    <span className="text-sm font-bold text-dark-900">{progress}%</span>
                </div>
                <div className="w-full bg-dark-100 rounded-full h-4 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 gap-2">
                    <MapPin size={14} /> Tahap Saat Ini: {stage}
                </span>
            </div>

            <div className="mb-6">
                <h4 className="text-sm font-semibold text-dark-700 mb-3">Timeline Proyek</h4>
                <div className="flex items-center justify-between">
                    {milestones.map((milestone, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div
                                className={`w-4 h-4 rounded-full border-2 transition-colors ${progress >= milestone.threshold
                                    ? 'bg-primary-600 border-primary-600'
                                    : 'bg-white border-dark-300'
                                    }`}
                            />
                            <span className="text-[10px] sm:text-xs text-dark-500 mt-1 text-center leading-tight">
                                {milestone.label}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="relative -mt-[2.15rem] mx-2 h-0.5 bg-dark-200">
                    <div
                        className="absolute top-0 left-0 h-full bg-primary-600 transition-all duration-1000"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            {gallery && gallery.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-dark-700 mb-3">Foto Progres</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {gallery.map((photo, i) => (
                            <img
                                key={i}
                                src={photo}
                                alt={`Progres ${i + 1}`}
                                className="w-full h-24 sm:h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProgressTracker
