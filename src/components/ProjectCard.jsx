
const ProjectCard = ({ project, onClick }) => {
    const { title, image, category, description, status } = project

    const statusBadge = {
        active: { label: 'Sedang Berjalan', color: 'bg-blue-100 text-blue-800' },
        completed: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
        pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
    }

    const badge = statusBadge[status] || statusBadge.pending

    return (
        <div
            onClick={onClick}
            className="card group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
        >
            
            <div className="relative overflow-hidden h-48 sm:h-56">
                <img
                    src={image || '/placeholder-project.jpg'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <span className="absolute top-3 left-3 px-3 py-1 bg-dark-900/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    {category}
                </span>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-dark-900 group-hover:text-primary-600 transition-colors">
                        {title}
                    </h3>
                    <span className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${badge.color}`}>
                        {badge.label}
                    </span>
                </div>
                {description && (
                    <p className="text-dark-500 text-sm line-clamp-2">{description}</p>
                )}
            </div>
        </div>
    )
}

export default ProjectCard
