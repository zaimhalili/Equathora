import React from 'react';

const ViewSolutionModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-md min-h-40 rounded-2xl px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-[Sansation] text-left font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>View Solution?</h2>
                    <p className='font-[Sansation] text-[var(--secondary-color)] text-sm md:text-base leading-relaxed opacity-80'>Viewing the solution before solving will award 0 points, but the problem will be marked as completed.</p>
                </div>

                <div className='flex w-full justify-between gap-3 pt-7'>
                    <button type="button" onClick={onClose} className='px-4 cursor-pointeration py-2.5 font-semibold text-center border-2 border-[var(--french-gray)] rounded-lg bg-white text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base'>Cancel</button>

                    <button type="button" className='px-4 cursor-pointeration py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base' onClick={onConfirm}>View Solution</button>
                </div>
            </div>
        </div>
    );
};

export default ViewSolutionModal;
