import React, { useEffect } from "react";

export default function OverflowChecker() {
    useEffect(() => {
        // Only run in development to avoid forced reflows in production
        if (import.meta.env.PROD) return;

        const check = () => {
            const viewportWidth = window.innerWidth;
            document.querySelectorAll("*").forEach(el => {
                const elWidth = el.getBoundingClientRect().width;
                if (elWidth > viewportWidth) {
                    console.log("Overflowing element:", el, "Width:", elWidth);
                }
            });
        };

        // Use requestIdleCallback to avoid blocking main thread
        if ('requestIdleCallback' in window) {
            const id = requestIdleCallback(check);
            return () => cancelIdleCallback(id);
        } else {
            const id = setTimeout(check, 1000);
            return () => clearTimeout(id);
        }
    }, []);

    return null; // this component doesn't render anything visible
}
