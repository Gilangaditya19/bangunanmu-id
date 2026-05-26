import { useRef, Children } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function ScrollStackItem({ children, className = '' }) {
    return <div className={`w-full h-full overflow-y-auto ${className}`}>{children}</div>;
}

export default function ScrollStack({
    children,
    className = '',
    itemDistance = 400,
    stepLabels = [],
    cardHeight = 500,
}) {
    const containerRef = useRef(null)
    const items = Children.toArray(children);
    const totalItems = items.length;
    const containerHeight = (totalItems - 1) * itemDistance + 100;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={{ height: `${containerHeight}px` }}
        >
            <div className="sticky top-24">
                {stepLabels.length > 0 && (
                    <StepIndicators
                        steps={stepLabels}
                        scrollYProgress={scrollYProgress}
                        totalItems={totalItems}
                    />
                )}
                <div className="relative w-full mx-auto overflow-hidden h-[800px] sm:h-[600px] md:h-[500px]">
                    {items.map((item, index) => (
                        <ScrollCard
                            key={index}
                            index={index}
                            totalItems={totalItems}
                            scrollYProgress={scrollYProgress}
                        >
                            {item}
                        </ScrollCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StepIndicators({ steps, scrollYProgress, totalItems }) {
    // Setiap step punya lebar 1/totalItems dari container.
    // Center icon ada di tengah masing-masing kolom = (idx + 0.5) / totalItems
    // Garis dimulai dari tepi kanan icon pertama dan berakhir di tepi kiri icon terakhir
    // Tepi icon = center ± 24px (radius icon 48px)
    const firstCenterPercent = 50 / totalItems; // (0.5 / totalItems) * 100
    const lineLeft = `calc(${firstCenterPercent}% + 24px)`;
    const lineRight = `calc(${firstCenterPercent}% + 24px)`;
    const totalLineWidth = `calc(100% - ${firstCenterPercent * 2}% - 48px)`;

    return (
        <div className="relative flex items-start justify-between mb-8 px-4">
            {/* Garis background */}
            <div
                className="absolute top-6 h-[2px] bg-gray-200 z-0"
                style={{ left: lineLeft, right: lineRight }}
            />
            {/* Garis progress */}
            <motion.div
                className="absolute top-6 h-[2px] bg-[#396680] z-[1] origin-left"
                style={{
                    left: lineLeft,
                    width: totalLineWidth,
                    scaleX: useTransform(scrollYProgress, (v) => {
                        const activeIndex = Math.min(Math.floor(v * totalItems), totalItems - 1);
                        if (totalItems <= 1) return 0;
                        return activeIndex / (totalItems - 1);
                    })
                }}
            />
            {steps.map((step, index) => (
                <StepDot
                    key={index}
                    index={index}
                    totalItems={totalItems}
                    scrollYProgress={scrollYProgress}
                    icon={step.icon}
                    label={step.label}
                />
            ))}
        </div>
    );
}

function StepDot({ index, totalItems, scrollYProgress, icon, label }) {
    const segmentSize = 1 / totalItems;
    const start = index * segmentSize;
    const end = (index + 1) * segmentSize;

    const isActive = useTransform(scrollYProgress, (v) => v >= start && v < end);

    return (
        <motion.div className="flex flex-col items-center gap-2 relative z-10 flex-1">
            <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white"
                style={{
                    borderColor: useTransform(isActive, (v) => v ? '#396680' : '#e2e8f0'),
                    backgroundColor: useTransform(isActive, (v) => v ? '#396680' : '#ffffff'),
                    color: useTransform(isActive, (v) => v ? '#ffffff' : '#94a3b8'),
                }}
            >
                {icon}
            </motion.div>
            <motion.span
                className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-center leading-tight max-w-[100px]"
                style={{
                    color: useTransform(isActive, (v) => v ? '#1a202c' : '#94a3b8'),
                }}
            >
                {label}
            </motion.span>
        </motion.div>
    );
}

function ScrollCard({ children, index, totalItems, scrollYProgress }) {
    const segmentSize = 1 / totalItems;
    const start = index * segmentSize;
    const fadeInEnd = start + segmentSize * 0.2;
    const isLast = index === totalItems - 1;

    // Card terakhir tidak perlu fade out
    const fadeOutStart = isLast ? 1 : start + segmentSize * 0.8;
    const end = isLast ? 1 : (index + 1) * segmentSize;

    const y = useTransform(
        scrollYProgress,
        isLast ? [start, fadeInEnd] : [start, fadeInEnd, fadeOutStart, end],
        isLast ? ['60px', '0px'] : ['60px', '0px', '0px', '-60px']
    );

    const opacity = useTransform(
        scrollYProgress,
        isLast ? [start, fadeInEnd] : [start, fadeInEnd, fadeOutStart, end],
        isLast ? [0, 1] : [0, 1, 1, 0]
    );

    const scale = useTransform(
        scrollYProgress,
        isLast ? [start, fadeInEnd] : [start, fadeInEnd, fadeOutStart, end],
        isLast ? [0.95, 1] : [0.95, 1, 1, 0.95]
    );

    // Disable pointer events saat card tidak terlihat
    const pointerEvents = useTransform(opacity, (v) => v > 0.5 ? 'auto' : 'none');

    return (
        <motion.div
            className="absolute inset-0 flex"
            style={{ y, opacity, scale, pointerEvents }}
        >
            {children}
        </motion.div>
    );
}
