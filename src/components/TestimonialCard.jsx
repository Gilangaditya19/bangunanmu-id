import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const TestimonialCard = ({ testimonial }) => {
    const { name, review, rating, project } = testimonial

    const renderStars = (rating) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-yellow-400" />)
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400" />)
            }
        }
        return stars
    }

    return (
        <div className="glass-card p-6 flex flex-col h-full">
            
            <div className="flex gap-1 mb-3">
                {renderStars(rating)}
            </div>

            <p className="text-dark-600 text-sm sm:text-base leading-relaxed flex-1 italic">
                "{review}"
            </p>

            <div className="mt-4 pt-4 border-t border-dark-100">
                <p className="font-semibold text-dark-900">{name}</p>
                {project && (
                    <p className="text-dark-400 text-sm">Proyek: {project}</p>
                )}
            </div>
        </div>
    )
}

export default TestimonialCard
