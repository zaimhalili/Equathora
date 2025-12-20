import React from 'react';
import { FaTimes, FaFileAlt, FaCalculator, FaLightbulb, FaChevronRight, FaPencilAlt } from 'react-icons/fa';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-[2px]' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-2xl rounded-2xl px-6 py-7 flex flex-col shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar' onClick={(e) => e.stopPropagation()} style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(217, 4, 41, 0.3) transparent'
            }}>
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(217, 4, 41, 0.3);
                        border-radius: 10px;
                        transition: background 0.2s;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(217, 4, 41, 0.5);
                    }
                `}</style>
                <div className='flex justify-between items-start pb-4'>
                    <div>
                        <h2 className='font-[Inter] font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>How to Use This Page</h2>
                        <p className='font-[Inter] text-[var(--secondary-color)] text-sm opacity-70 pt-2'>Quick guide to solving math problems</p>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
                        <FaTimes className='text-xl' />
                    </button>
                </div>

                <div className='flex flex-col gap-5 pt-4'>
                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] pb-2 flex items-center gap-2'>
                            <FaFileAlt className='text-[var(--accent-color)]' /> Reading the Problem
                        </h3>
                        <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>Start by carefully reading the mathematical problem description and examples. Make sure you understand what's being asked before attempting to solve.</p>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] pb-2 flex items-center gap-2'>
                            <FaCalculator className='text-[var(--accent-color)]' /> Entering Your Solution
                        </h3>
                        <ul className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed list-disc list-inside space-y-2'>
                            <li>Use the <strong>MathLive editor on the right side</strong> to write your solution</li>
                            <li>Work through the problem step-by-step in separate boxes</li>
                            <li>Click "+ Add Step" to add more steps to your mathematical solution</li>
                            <li>Use the math toolbar to insert equations, symbols, fractions, and expressions</li>
                            <li>Delete unwanted steps using the × button next to each step</li>
                        </ul>
                        <div className='mt-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-lg'>
                            <p className='font-[Inter] text-sm font-bold text-amber-900'>⚠️ Important:</p>
                            <p className='font-[Inter] text-sm text-amber-800 leading-relaxed mt-1'>
                                Your <strong>final answer must be in the LAST step</strong> before submitting. The system checks your last step to determine if your solution is correct. Make sure your final answer is clear and simplified.
                            </p>
                        </div>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] pb-2 flex items-center gap-2'>
                            <FaPencilAlt className='text-[var(--accent-color)]' /> Sketch Pad
                        </h3>
                        <ul className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed list-disc list-inside space-y-2'>
                            <li>Click the "Sketch" button in the top toolbar to open a drawing canvas</li>
                            <li>Draw diagrams, visualize problems, or work through solutions visually</li>
                            <li>Choose between black or red pen colors</li>
                            <li>Use "Undo" to remove the last stroke, or "Clear" to start fresh</li>
                            <li>Your sketches are saved temporarily per problem while browsing</li>
                            <li>Sketches persist when switching between tabs (Description, Solution, Submissions)</li>
                        </ul>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] pb-2 flex items-center gap-2'>
                            <FaLightbulb className='text-[var(--accent-color)]' /> Using Hints
                        </h3>
                        <p className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed'>Stuck? Scroll down to find mathematical hints that can guide you without giving away the answer. Hints are revealed one at a time to help you learn.</p>
                    </div>

                    <div className='bg-[var(--french-gray)]/20 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-[var(--secondary-color)] pb-2 flex items-center gap-2'>
                            <FaChevronRight className='text-[var(--accent-color)]' /> Navigation & Tabs
                        </h3>
                        <ul className='font-[Inter] text-sm text-[var(--secondary-color)] leading-relaxed list-disc list-inside space-y-2'>
                            <li><strong>Description Tab:</strong> View the problem statement and examples</li>
                            <li><strong>Solution Tab:</strong> After attempting, view the official solution</li>
                            <li><strong>Submissions Tab:</strong> Review your past attempts and performance</li>
                            <li><strong>Desktop Collapse:</strong> Click the arrow to expand the solution workspace</li>
                        </ul>
                    </div>

                    <div className='bg-green-50 border-2 border-green-200 p-4 rounded-xl'>
                        <h3 className='font-[Inter] font-bold text-lg text-green-800 pb-2'>💡 Pro Tip</h3>
                        <p className='font-[Inter] text-sm text-green-700 leading-relaxed'>Try to solve the problem on your own before viewing hints or the solution. Use the sketch pad to visualize the problem. Learning mathematics happens best when you work through the challenge!</p>
                    </div>
                </div>

                <button type="button" onClick={onClose} className='pt-6 px-6 py-3 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base'>Got It!</button>
            </div>
        </div>
    );
};

export default HelpModal;
