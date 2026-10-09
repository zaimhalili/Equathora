import React from 'react';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

const ViewSolutionModal = ({ isOpen, onClose, onConfirm, error, isLoading = false }) => {
    useBodyScrollLock(isOpen);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-[var(--raisin-black)]/30' onClick={onClose}>
            <div className='bg-(--white) w-11/12 max-w-md rounded-xl px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-3'>
                    <h2 className=' text-left font-bold text-2xl md:text-3xl text-(--secondary-color) leading-tight'>View Solution?</h2>
                    <p className=' text-(--secondary-color) text-sm md:text-base leading-relaxed opacity-80'>Viewing the solution does not mark the problem complete or reduce its XP reward. Your view is saved so you can revisit the solution without this confirmation.</p>
                    {error && <p role="alert" className="text-sm text-(--accent-color)">{error}</p>}
                </div>

                <div className='flex w-full justify-between gap-3 pt-5'>
                    <button type="button" onClick={onClose} disabled={isLoading} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-(--mid-main-secondary) rounded-xl bg-(--white) text-(--secondary-color) hover:bg-(--french-gray) shadow-md hover:shadow-lg transition-colors duration-75 flex-1 text-sm md:text-base disabled:cursor-wait disabled:opacity-60'>Cancel</button>

                    <button type="button" disabled={isLoading} className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-(--accent-color) rounded-xl bg-(--accent-color) text-white hover:bg-(--dark-accent-color) hover:border-(--dark-accent-color) shadow-md hover:shadow-lg transition-colors duration-75 flex-1 text-sm md:text-base disabled:cursor-wait disabled:opacity-60' onClick={onConfirm}>{isLoading ? 'Saving...' : 'View Solution'}</button>
                </div>
            </div>
        </div>
    );
};

export default ViewSolutionModal;
