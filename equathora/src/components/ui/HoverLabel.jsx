import React from 'react';
import { motion } from 'framer-motion';

const HoverLabel = ({ className, text }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            className={`bg-(--black) text-(--white) rounded-lg absolute -top-10 ${className} z-1001 text-xs px-3 min-w-fit items-center flex py-2 whitespace-nowrap `}
        >
            {text}
            {/* Tooltip Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--black) rotate-45"></div>
        </motion.div>
    );
};

export default HoverLabel;