import { useEffect } from "react";

export default function OverflowChecker() {
    useEffect(() => {
        const viewportWidth = window.innerWidth;

        document.querySelectorAll("*").forEach(el => {
            const elWidth = el.getBoundingClientRect().width;
            if (elWidth > viewportWidth) {
                console.log("Overflowing element:", el, "Width:", elWidth);
            }
        });
    }, []);

    return null; // this component doesn't render anything visible
}
