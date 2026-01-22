import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ReportModal = ({ isOpen, onClose, reportReason, setReportReason, reportDetails, setReportDetails, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-[2px]' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-md rounded-2xl px-6 py-7 flex flex-col shadow-2xl max-h-[85vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-start pb-4'>
                    <div>
                        <h2 className='font-[Sansation] font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>Report Problem</h2>
                        <p className='font-[Sansation] text-[var(--secondary-color)] text-sm opacity-70 pt-2'>Help us improve by reporting any issues</p>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
                        <FaTimes className='text-xl' />
                    </button>
                </div>

                <div className='flex flex-col gap-4 pt-4'>
                    <div>
                        <label className='font-[Sansation] text-sm font-semibold text-[var(--secondary-color)] pb-2 block'>Reason for Report</label>
                        <select
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className='w-full p-3 border-2 border-[var(--french-gray)] rounded-lg font-[Sansation] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors'
                        >
                            <option value="">Select a reason</option>
                            <option value="incorrect-answer">Incorrect Answer</option>
                            <option value="typo">Typo or Grammar Error</option>
                            <option value="unclear">Unclear Problem Statement</option>
                            <option value="broken">Broken Feature</option>
                            <option value="inappropriate">Inappropriate Content</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className='font-[Sansation] text-sm font-semibold text-[var(--secondary-color)] pb-2 block'>Additional Details (Optional)</label>
                        <textarea
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder='Provide more information about the issue...'
                            rows={4}
                            className='w-full p-3 border-2 border-[var(--french-gray)] rounded-lg font-[Sansation] text-sm resize-none focus:border-[var(--accent-color)] focus:outline-none transition-colors'
                        />
                    </div>
                </div>

                <div className='flex w-full justify-between gap-3 pt-6'>
                    <button type="button" onClick={onClose} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-[var(--french-gray)] rounded-lg bg-white text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg transition-all duration-300 flex-1 text-sm md:text-base'>Cancel</button>
                    <button type="button" onClick={onSubmit} className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 flex-1 text-sm md:text-base'>Submit Report</button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
