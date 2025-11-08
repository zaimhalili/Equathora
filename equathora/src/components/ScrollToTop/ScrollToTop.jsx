// Source - https://stackoverflow.com/a/58432771
// Posted by Luïs
// Retrieved 2025-11-08, License - CC BY-SA 4.0
// Updated for React Router v6+

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return children;
};

export default ScrollToTop;
