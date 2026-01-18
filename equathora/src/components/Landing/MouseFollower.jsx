import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * MouseFollower - A component that creates parallax/tilt effects based on mouse position
 * Wrap any content to make it react to cursor movement
 */
const MouseFollower = ({ 
    children, 
    intensity = 20, 
    className = "",
    perspective = 1000,
    scale = 1.02,
    rotateEnabled = true,
    translateEnabled = true,
    springConfig = { stiffness: 150, damping: 15 }
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{ perspective }}
            animate={{
                rotateY: rotateEnabled ? position.x * intensity : 0,
                rotateX: rotateEnabled ? -position.y * intensity : 0,
                x: translateEnabled ? position.x * (intensity / 2) : 0,
                y: translateEnabled ? position.y * (intensity / 2) : 0,
                scale: isHovered ? scale : 1,
            }}
            transition={{
                type: "spring",
                ...springConfig
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * ParallaxLayer - Individual layers that move at different speeds for depth effect
 */
export const ParallaxLayer = ({ 
    children, 
    depth = 1, 
    className = "",
    containerRef 
}) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * depth * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * depth * 30;
            setOffset({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [depth]);

    return (
        <motion.div
            className={className}
            animate={{
                x: offset.x,
                y: offset.y,
            }}
            transition={{
                type: "spring",
                stiffness: 50,
                damping: 20
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * FloatingElement - An element that continuously floats with optional cursor interaction
 */
export const FloatingElement = ({
    children,
    className = "",
    floatRange = 15,
    duration = 4,
    delay = 0,
    cursorReactive = true,
    cursorIntensity = 10
}) => {
    const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (!cursorReactive) return;
        
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * cursorIntensity;
            const y = (e.clientY / window.innerHeight - 0.5) * cursorIntensity;
            setCursorOffset({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorReactive, cursorIntensity]);

    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -floatRange, 0],
                x: cursorOffset.x,
            }}
            style={{
                y: cursorOffset.y,
            }}
            transition={{
                y: {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay
                },
                x: {
                    type: "spring",
                    stiffness: 50,
                    damping: 20
                }
            }}
        >
            {children}
        </motion.div>
    );
};

export default MouseFollower;
