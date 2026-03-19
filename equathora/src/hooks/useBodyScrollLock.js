import { useEffect } from 'react';

let lockCount = 0;
let lockedScrollY = 0;
let savedStyles = null;

function lockBodyScroll() {
    const body = document.body;
    const html = document.documentElement;

    if (lockCount === 0) {
        lockedScrollY = window.scrollY;
        savedStyles = {
            htmlOverflow: html.style.overflow,
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyWidth: body.style.width,
        };

        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${lockedScrollY}px`;
        body.style.width = '100%';
    }

    lockCount += 1;
}

function unlockBodyScroll() {
    if (lockCount === 0) return;

    lockCount -= 1;

    if (lockCount === 0 && savedStyles) {
        const body = document.body;
        const html = document.documentElement;

        html.style.overflow = savedStyles.htmlOverflow;
        body.style.overflow = savedStyles.bodyOverflow;
        body.style.position = savedStyles.bodyPosition;
        body.style.top = savedStyles.bodyTop;
        body.style.width = savedStyles.bodyWidth;

        window.scrollTo(0, lockedScrollY);
        savedStyles = null;
    }
}

export default function useBodyScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return;

        lockBodyScroll();
        return () => unlockBodyScroll();
    }, [isLocked]);
}
