import React, { useState } from 'react';

const Image = ({ src, alt, className = "" }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* skeleton */}
            <div
                className={`absolute inset-0 bg-[var(--main-color)] animate-pulse transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"
                    }`}
            />
            {/* real image */}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
            />
        </div>
    );
};

export default Image;