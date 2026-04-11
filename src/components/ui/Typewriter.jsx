import React, { useState, useEffect } from 'react';

const Typewriter = ({ texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000, className = "" }) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    useEffect(() => {
        const i = loopNum % texts.length;
        const fullText = texts[i];

        const handleTyping = () => {
            if (!isDeleting) {
                setDisplayText(fullText.substring(0, displayText.length + 1));

                if (displayText === fullText) {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                    return;
                }
            } else {
                setDisplayText(fullText.substring(0, displayText.length - 1));

                if (displayText === '') {
                    setIsDeleting(false);
                    setLoopNum(loopNum + 1);
                    return;
                }
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, loopNum, texts, typingSpeed, deletingSpeed, pauseTime]);

    return (
        <span className={className}>
            {displayText}
            <span className="ml-1 border-r-2 border-white animate-pulse">&nbsp;</span>
        </span>
    );
};

export default Typewriter;
