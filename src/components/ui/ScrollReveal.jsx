import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Smoothly reveals content when it enters the viewport on scroll.
 * Uses the high-performance native Intersection Observer API.
 */
const ScrollReveal = ({ 
    children, 
    className = '', 
    variant = 'fadeInUp', 
    delay = 0, 
    duration = 800,
    threshold = 0.1,
    id,
    ...rest
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) {
                        observer.unobserve(ref.current); // Only reveal once for clean look
                    }
                }
            },
            {
                threshold,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    // Directional transition classes
    const variants = {
        fadeInUp: 'translate-y-12 opacity-0',
        fadeInDown: '-translate-y-12 opacity-0',
        fadeInLeft: '-translate-x-12 opacity-0',
        fadeInRight: 'translate-x-12 opacity-0',
        scaleUp: 'scale-95 opacity-0',
    };

    const activeClass = isVisible
        ? 'translate-y-0 translate-x-0 scale-100 opacity-100'
        : variants[variant] || variants.fadeInUp;

    return (
        <div
            ref={ref}
            id={id}
            className={`transition-all ease-[cubic-bezier(0.25,1,0.5,1)] ${activeClass} ${className}`}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
                willChange: 'transform, opacity'
            }}
            {...rest}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
