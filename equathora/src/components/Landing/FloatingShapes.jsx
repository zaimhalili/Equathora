import React from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingShapes - Decorative animated shapes that float across the page
 * Inspired by Crafto e-learning template
 */
const FloatingShapes = ({ variant = "hero" }) => {
    const shapes = {
        hero: [
            // Large accent circle - top right
            {
                type: 'circle',
                size: 'w-64 h-64',
                color: 'bg-[var(--accent-color)]',
                opacity: 'opacity-5',
                position: 'top-20 right-10',
                animation: { y: [0, -20, 0], rotate: [0, 10, 0] },
                duration: 8
            },
            // Small accent dot - left
            {
                type: 'circle',
                size: 'w-4 h-4',
                color: 'bg-[var(--accent-color)]',
                opacity: 'opacity-30',
                position: 'top-40 left-[15%]',
                animation: { y: [0, 15, 0], x: [0, 5, 0] },
                duration: 5
            },
            // Medium gray circle - bottom left
            {
                type: 'circle',
                size: 'w-32 h-32',
                color: 'bg-[var(--french-gray)]',
                opacity: 'opacity-10',
                position: 'bottom-32 left-20',
                animation: { y: [0, 25, 0], rotate: [0, -15, 0] },
                duration: 10
            },
            // Small dots cluster - right side
            {
                type: 'circle',
                size: 'w-3 h-3',
                color: 'bg-[var(--secondary-color)]',
                opacity: 'opacity-20',
                position: 'top-[60%] right-[20%]',
                animation: { y: [0, -10, 0] },
                duration: 4
            },
            // Accent ring
            {
                type: 'ring',
                size: 'w-20 h-20',
                color: 'border-[var(--accent-color)]',
                opacity: 'opacity-15',
                position: 'top-[30%] right-[35%]',
                animation: { rotate: [0, 360], scale: [1, 1.1, 1] },
                duration: 20
            },
            // Plus shape
            {
                type: 'plus',
                size: 'w-6 h-6',
                color: 'text-[var(--accent-color)]',
                opacity: 'opacity-25',
                position: 'bottom-[40%] left-[8%]',
                animation: { rotate: [0, 90, 0], y: [0, -8, 0] },
                duration: 6
            },
        ],
        features: [
            {
                type: 'circle',
                size: 'w-48 h-48',
                color: 'bg-[var(--accent-color)]',
                opacity: 'opacity-5',
                position: 'top-10 left-10',
                animation: { y: [0, 30, 0] },
                duration: 12
            },
            {
                type: 'ring',
                size: 'w-16 h-16',
                color: 'border-[var(--french-gray)]',
                opacity: 'opacity-20',
                position: 'bottom-20 right-20',
                animation: { rotate: [0, -360] },
                duration: 25
            },
        ],
        cta: [
            {
                type: 'circle',
                size: 'w-96 h-96',
                color: 'bg-white',
                opacity: 'opacity-5',
                position: '-top-20 -left-20',
                animation: { scale: [1, 1.1, 1] },
                duration: 8
            },
            {
                type: 'circle',
                size: 'w-64 h-64',
                color: 'bg-white',
                opacity: 'opacity-5',
                position: '-bottom-10 -right-10',
                animation: { scale: [1, 1.15, 1] },
                duration: 10
            },
        ]
    };

    const renderShape = (shape, index) => {
        const baseClasses = `absolute ${shape.position} ${shape.size} ${shape.opacity} pointer-events-none`;
        
        switch (shape.type) {
            case 'circle':
                return (
                    <motion.div
                        key={index}
                        className={`${baseClasses} ${shape.color} rounded-full blur-xl`}
                        animate={shape.animation}
                        transition={{
                            duration: shape.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                );
            case 'ring':
                return (
                    <motion.div
                        key={index}
                        className={`${baseClasses} ${shape.color} rounded-full border-2`}
                        animate={shape.animation}
                        transition={{
                            duration: shape.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                );
            case 'plus':
                return (
                    <motion.div
                        key={index}
                        className={`${baseClasses} ${shape.color} flex items-center justify-center text-2xl font-light`}
                        animate={shape.animation}
                        transition={{
                            duration: shape.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        +
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes[variant]?.map((shape, index) => renderShape(shape, index))}
        </div>
    );
};

export default FloatingShapes;
