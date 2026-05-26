import React from 'react';

const ShinyText = ({ text, disabled = false, speed = 3, className = '', theme = 'light' }) => {
    const animationDuration = `${speed}s`;

    const themes = {
        light: 'linear-gradient(120deg, rgba(255, 255, 255, 0.5) 40%, #ffffff 50%, rgba(255, 255, 255, 0.5) 60%)',
        dark: 'linear-gradient(120deg, rgba(71, 85, 105, 0.5) 40%, #0f172a 50%, rgba(71, 85, 105, 0.5) 60%)',
        brand: 'linear-gradient(120deg, rgba(57, 102, 128, 0.4) 40%, #396680 50%, rgba(57, 102, 128, 0.4) 60%)',
    };

    const bgGradient = themes[theme] || themes.light;

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
