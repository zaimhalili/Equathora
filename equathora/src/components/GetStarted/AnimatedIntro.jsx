import React, { useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';

const AnimatedIntro = ({ image, title, subtitle, description, flipImage = false }) => {
    const prefersReducedMotion = useReducedMotion();
    const [imageReady, setImageReady] = useState(false);
    const [visibleTitleLength, setVisibleTitleLength] = useState(0);
    const [visibleBodyLength, setVisibleBodyLength] = useState(0);
    const body = subtitle || description || '';

    useEffect(() => {
        if (prefersReducedMotion) {
            setImageReady(true);
        }
    }, [prefersReducedMotion]);

    useEffect(() => {
        if (!imageReady) return undefined;

        if (visibleTitleLength < title.length) {
            const timeout = window.setTimeout(
                () => setVisibleTitleLength((length) => length + 1),
                35
            );
            return () => window.clearTimeout(timeout);
        }

        if (visibleBodyLength < body.length) {
            const timeout = window.setTimeout(
                () => setVisibleBodyLength((length) => length + 1),
                24
            );
            return () => window.clearTimeout(timeout);
        }

        return undefined;
    }, [body, imageReady, title, visibleBodyLength, visibleTitleLength]);

    return (
        <div className='flex w-full flex-col items-center gap-6 text-center sm:gap-8'>
            <div className={flipImage ? '[transform:rotateY(180deg)]' : ''}>
                <Motion.img
                    src={image}
                    alt='Equathora mascot'
                    draggable={false}
                    className='h-40 w-40 select-none object-contain sm:h-48 sm:w-48'
                    initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 180, damping: 16 }}
                    onAnimationComplete={() => setImageReady(true)}
                />
            </div>

            <div className='min-h-20 max-w-xl'>
                <h1
                    className='text-xl font-semibold leading-tight sm:text-2xl'
                    aria-label={title}
                >
                    <span aria-hidden='true'>{title.slice(0, visibleTitleLength)}</span>
                </h1>
                {body && (
                    <p
                        className='mx-auto max-w-md pt-2 text-sm text-(--secondary-color) opacity-80 sm:text-base'
                        aria-label={body}
                    >
                        <span aria-hidden='true'>{body.slice(0, visibleBodyLength)}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default AnimatedIntro;
