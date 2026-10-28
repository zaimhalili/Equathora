// Source - https://stackoverflow.com/a/58432771
// Posted by Luïs
// Retrieved 2025-11-08, License - CC BY-SA 4.0
// Updated for React Router v6+

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
    const location = useLocation();
    const lastScrollY = useRef(0);

    useEffect(() => {
        const rememberScrollPosition = () => {
            lastScrollY.current = window.scrollY;
        };

        window.addEventListener('scroll', rememberScrollPosition, { passive: true });
        return () => window.removeEventListener('scroll', rememberScrollPosition);
    }, []);

    useLayoutEffect(() => {
        if (location.state?.preserveScrollPosition) {
            window.scrollTo(0, lastScrollY.current);
            return;
        }

        lastScrollY.current = 0;
        window.scrollTo(0, 0);
    }, [location.pathname, location.state]);

    return children;
};

export default ScrollToTop;
