import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

const StickerPeel = ({
    imageSrc,
    rotate = 30,
    peelBackHoverPct = 30,
    peelBackActivePct = 40,
    peelDirection = 0,
    width = 200,
    shadowIntensity = 0.6,
    lightingIntensity = 0.1,
    initialPosition = 'center',
    className = ''
}) => {
    const containerRef = useRef(null)
    const stickerRef = useRef(null)
    const peelRef = useRef(null)
    const [peelPct, setPeelPct] = useState(0)

    useEffect(() => {
        if (!stickerRef.current) return

        const draggable = Draggable.create(stickerRef.current, {
            type: 'x,y',
            inertia: true,
            onDragStart() {
                gsap.to(stickerRef.current, {
                    rotation: rotate,
                    duration: 0.3,
                    ease: 'power2.out'
                })
            },
            onDragEnd() {
                gsap.to(stickerRef.current, {
                    rotation: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                })
            }
        })

        return () => {
            draggable.forEach(d => d.kill())
        }
    }, [rotate])

    const handleMouseEnter = () => {
        gsap.to(peelRef.current, {
            '--peel': `${peelBackHoverPct}%`,
            duration: 0.4,
            ease: 'power3.out'
        })
        setPeelPct(peelBackHoverPct)
    }

    const handleMouseLeave = () => {
        gsap.to(peelRef.current, {
            '--peel': '0%',
            duration: 0.4,
            ease: 'power3.out'
        })
        setPeelPct(0)
    }

    const handleMouseDown = () => {
        gsap.to(peelRef.current, {
            '--peel': `${peelBackActivePct}%`,
            duration: 0.2,
            ease: 'power2.out'
        })
        setPeelPct(peelBackActivePct)
    }

    const handleMouseUp = () => {
        gsap.to(peelRef.current, {
            '--peel': `${peelBackHoverPct}%`,
            duration: 0.3,
            ease: 'power2.out'
        })
        setPeelPct(peelBackHoverPct)
    }

    const positions = {
        center: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
        'top-left': { left: '5%', top: '5%' },
        'top-right': { right: '5%', top: '5%' },
        'bottom-left': { left: '5%', bottom: '5%' },
        'bottom-right': { right: '5%', bottom: '5%' }
    }

    const positionStyle = positions[initialPosition] || positions.center

    return (
        <div
            ref={containerRef}
            className={`sticker-peel-container ${className}`}
            style={{ position: 'absolute', ...positionStyle, zIndex: 20 }}
        >
            <div
                ref={stickerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseLeave}
                style={{
                    width: `${width}px`,
                    height: `${width}px`,
                    cursor: 'grab',
                    position: 'relative',
                    userSelect: 'none',
                    touchAction: 'none',
                    filter: `drop-shadow(0 ${10 + peelPct * 0.3}px ${20 + peelPct * 0.4}px rgba(0,0,0,${shadowIntensity * 0.5})) drop-shadow(0 ${4 + peelPct * 0.2}px ${8 + peelPct * 0.2}px rgba(0,0,0,${shadowIntensity * 0.3}))`,
                    transform: `rotate(${peelDirection}deg)`,
                    transition: 'filter 0.3s ease'
                }}
            >
                <div
                    ref={peelRef}
                    style={{
                        '--peel': '0%',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        WebkitMaskImage: 'linear-gradient(to top, black calc(100% - var(--peel)), transparent calc(100% - var(--peel) + 1px))',
                        maskImage: 'linear-gradient(to top, black calc(100% - var(--peel)), transparent calc(100% - var(--peel) + 1px))'
                    }}
                >
                    <img
                        src={imageSrc}
                        alt="sticker"
                        draggable={false}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            filter: `brightness(${1 + lightingIntensity})`
                        }}
                    />
                </div>
                {/* Curl effect on top when peeling */}
                {peelPct > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: `${peelPct}%`,
                            background: `linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(220,220,220,0.85) 50%, rgba(180,180,180,0.7) 100%)`,
                            transform: `rotateX(${180 - peelPct * 1.8}deg) translateZ(0)`,
                            transformOrigin: 'bottom',
                            transformStyle: 'preserve-3d',
                            boxShadow: `0 -10px 20px rgba(0,0,0,${shadowIntensity * 0.3})`,
                            borderRadius: '8px',
                            pointerEvents: 'none',
                            transition: 'all 0.3s ease'
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default StickerPeel
