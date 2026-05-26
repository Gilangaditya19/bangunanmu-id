import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ImageTrail = ({ items = [], variant = 1 }) => {
    const containerRef = useRef(null)
    const imagesRef = useRef([])
    const lastMousePos = useRef({ x: 0, y: 0 })
    const cachedMousePos = useRef({ x: 0, y: 0 })
    const currentIndex = useRef(0)
    const lastTime = useRef(0)
    const threshold = 80 // distance dalam pixel untuk trigger image baru

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

        const triggerAtPoint = (clientX, clientY) => {
            const rect = container.getBoundingClientRect()
            const x = clientX - rect.left
            const y = clientY - rect.top

            cachedMousePos.current = { x, y }

            const distance = Math.hypot(
                x - lastMousePos.current.x,
                y - lastMousePos.current.y
            )

            const now = Date.now()
            if (distance > threshold && now - lastTime.current > 50) {
                showNextImage(x, y)
                lastMousePos.current = { x, y }
                lastTime.current = now
            }
        }

        const handleMouseMove = (e) => triggerAtPoint(e.clientX, e.clientY)
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                triggerAtPoint(e.touches[0].clientX, e.touches[0].clientY)
            }
        }
        const handleTouchStart = (e) => {
            if (e.touches.length > 0) {
                lastMousePos.current = { x: -9999, y: -9999 }
                triggerAtPoint(e.touches[0].clientX, e.touches[0].clientY)
            }
        }

        const showNextImage = (x, y) => {
            if (imagesRef.current.length === 0) return

            const img = imagesRef.current[currentIndex.current % imagesRef.current.length]
            if (!img) return

            currentIndex.current++

            gsap.killTweensOf(img)

            const animations = {
                1: () => {
                    gsap.set(img, {
                        x: x - 80,
                        y: y - 80,
                        scale: 0,
                        opacity: 0,
                        rotation: gsap.utils.random(-15, 15),
                        zIndex: currentIndex.current,
                    })
                    gsap.to(img, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                    })
                    gsap.to(img, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.6,
                        delay: 0.5,
                        ease: 'power2.in',
                    })
                },
                2: () => {
                    gsap.set(img, {
                        x: x - 80,
                        y: y - 80,
                        scale: 1,
                        opacity: 1,
                        rotation: gsap.utils.random(-25, 25),
                        zIndex: currentIndex.current,
                    })
                    gsap.to(img, {
                        opacity: 0,
                        y: y - 200,
                        duration: 1,
                        ease: 'power2.out',
                    })
                },
            }

            const animate = animations[variant] || animations[1]
            animate()
        }

        // Auto-animation untuk mobile (random positions terus-menerus)
        let autoInterval
        if (isMobile) {
            autoInterval = setInterval(() => {
                const rect = container.getBoundingClientRect()
                const x = Math.random() * rect.width
                const y = Math.random() * rect.height
                showNextImage(x, y)
            }, 600)
        }

        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('touchmove', handleTouchMove, { passive: true })
        container.addEventListener('touchstart', handleTouchStart, { passive: true })

        return () => {
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('touchmove', handleTouchMove)
            container.removeEventListener('touchstart', handleTouchStart)
            if (autoInterval) clearInterval(autoInterval)
        }
    }, [variant])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-auto"
            style={{ zIndex: 5 }}
        >
            {items.map((src, i) => (
                <img
                    key={i}
                    ref={(el) => (imagesRef.current[i] = el)}
                    src={src}
                    alt=""
                    draggable={false}
                    style={{
                        position: 'absolute',
                        width: '160px',
                        height: '160px',
                        objectFit: 'contain',
                        opacity: 0,
                        pointerEvents: 'none',
                        transformOrigin: 'center center',
                        willChange: 'transform, opacity',
                    }}
                />
            ))}
        </div>
    )
}

export default ImageTrail
