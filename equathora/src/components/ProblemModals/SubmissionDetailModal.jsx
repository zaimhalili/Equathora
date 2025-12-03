import React from 'react';
import { FaTimes, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MathfieldElement } from 'mathlive';

const SubmissionDetailModal = ({ isOpen, onClose, submission }) => {
    if (!isOpen || !submission) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-[2px]' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-2xl rounded-2xl px-6 py-7 flex flex-col shadow-2xl max-h-[85vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-start pb-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-3 pb-2'>
                            <h2 className='font-[Public_Sans] font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>
                                Submission Details
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${submission.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                submission.status === 'wrong' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {submission.status === 'accepted' && <FaCheckCircle />}
                                {submission.status === 'wrong' && <FaTimesCircle />}
                                {submission.status === 'accepted' ? 'Accepted' : submission.status === 'wrong' ? 'Wrong Answer' : 'Pending'}
                            </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <FaClock className='text-xs' />
                            <span>{submission.timestamp}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
                        <FaTimes className='text-xl' />
                    </button>
                </div>

                <div className='flex flex-col gap-4 pt-4'>
                    <div className='bg-[var(--french-gray)]/10 p-4 rounded-xl'>
                        <h3 className='font-[Public_Sans] font-bold text-sm text-[var(--secondary-color)] pb-3'>Your Solution Steps</h3>
                        <div className='flex flex-col gap-3'>
                            {submission.steps && submission.steps.map((step, index) => (
                                <div key={index} className='bg-white p-4 rounded-lg border border-gray-200'>
                                    <div className='flex items-center gap-2 pb-2'>
                                        <span className='bg-[var(--accent-color)] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'>
                                            {index + 1}
                                        </span>
                                        <span className='text-xs font-semibold text-gray-600'>Step {index + 1}</span>
                                    </div>
                                    <div className='pl-8'>
                                        <math-field
                                            read-only
                                            style={{
                                                fontSize: '1.1rem',
                                                padding: '8px',
                                                border: 'none',
                                                backgroundColor: 'transparent'
                                            }}
                                        >
                                            {step.latex}
                                        </math-field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>



                    {submission.metadata && (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            {submission.metadata.timeSpent && (
                                <div className='bg-[var(--french-gray)]/10 p-3 rounded-lg'>
                                    <div className='text-xs text-gray-500 pb-1'>Time Spent</div>
                                    <div className='font-bold text-[var(--secondary-color)]'>{submission.metadata.timeSpent}</div>
                                </div>
                            )}
                            {submission.metadata.attempts && (
                                <div className='bg-[var(--french-gray)]/10 p-3 rounded-lg'>
                                    <div className='text-xs text-gray-500 pb-1'>Attempt #</div>
                                    <div className='font-bold text-[var(--secondary-color)]'>{submission.metadata.attempts}</div>
                                </div>
                            )}
                            {submission.metadata.hintsUsed !== undefined && (
                                <div className='bg-[var(--french-gray)]/10 p-3 rounded-lg'>
                                    <div className='text-xs text-gray-500 pb-1'>Hints Used</div>
                                    <div className='font-bold text-[var(--secondary-color)]'>{submission.metadata.hintsUsed}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className='pt-6 px-6 py-3 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base'
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SubmissionDetailModal;
