import React from 'react';
import { FaTimes, FaFileAlt, FaCalculator, FaLightbulb, FaChevronRight } from 'react-icons/fa';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-2xl rounded-2xl px-6 py-7 flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-start mb-4'>
                    <div>
                        <h2 className='font-[Inter] font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>How to Use This Page</h2>
                        <p className='font-[Inter] text-[var(--secondary-color)] text-sm opacity-70 mt-2'>Quick guide to solving problems</p>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
                        <FaTimes className='text-xl' />
                    </button>
                </div>

                <div className='flex flex-col gap-5 mt-4'>
                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                            <FaFileAlt className='text-[var(--accent-color)]' /> Reading the Problem
                        </h3>
                        <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>Start by carefully reading the problem description and examples. Make sure you understand what's being asked before attempting to solve.</p>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                            <FaCalculator className='text-[var(--accent-color)]' /> Entering Your Solution
                        </h3>
                        <ul className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed list-disc list-inside space-y-2'>
                            <li>Use the math editor on the right to write your solution step-by-step</li>
                            <li>Click "+ Add Step" to add more steps to your solution</li>
                            <li>Use the math toolbar to insert equations, symbols, and expressions</li>
                            <li>Delete unwanted steps using the × button next to each step</li>
                        </ul>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                            <FaLightbulb className='text-[var(--accent-color)]' /> Using Hints
                        </h3>
                        <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>Stuck? Scroll down to find hints that can guide you without giving away the answer. Hints are revealed one at a time to help you learn.</p>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] mb-2 flex items-center gap-2'>
                            <FaChevronRight className='text-[var(--accent-color)]' /> Desktop Features
                        </h3>
                        <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>On desktop, you can collapse the problem description panel to get more space for your solution. Just click the arrow button in the top-right corner of the description panel.</p>
                    </div>

                    <div className='bg-green-50 border-2 border-green-200 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-green-800 mb-2'>💡 Pro Tip</h3>
                        <p className='font-[Inter] text-sm text-green-700 leading-relaxed'>Try to solve the problem on your own before viewing hints or the solution. Learning happens best when you struggle through the challenge!</p>
                    </div>
                </div>

                <button type="button" onClick={onClose} className='mt-6 px-6 py-3 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base'>Got It!</button>
            </div>
        </div>
    );
};

export default HelpModal;
