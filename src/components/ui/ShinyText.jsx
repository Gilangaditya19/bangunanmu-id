import React from 'react';

const ShinyText = ({ text, disabled = false, speed = 3, className = '', theme = 'light' }) => {
    const animationDuration = `${speed}s`;

    const bgGradient = theme === 'dark'
        ? 'linear-gradient(120deg, rgba(71, 85, 105, 0.5) 40%, #0f172a 50%, rgba(71, 85, 105, 0.5) 60%)'
        : 'linear-gradient(120deg, rgba(255, 255, 255, 0.5) 40%, #ffffff 50%, rgba(255, 255, 255, 0.5) 60%)';

    return (
        <div
            className={`inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: bgGradient,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                animationDuration: animationDuration,
            }}
        >
            {text}
        </div>
    );
};

export default ShinyText;
