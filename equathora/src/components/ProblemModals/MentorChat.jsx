import React, { useState, useRef, useEffect } from 'react';
import { FaFile, FaPaperPlane, FaCalculator, FaTimes } from 'react-icons/fa';
import User from '../../assets/images/guestAvatar.png'

const MentorChat = () => {
    const attachmentRef = useRef(null);
    const formRef = useRef(null);
    const [attachments, setAttachments] = useState(false);
    const [shareLatex, setShareLatex] = useState(false);
    const [draftMessage, setDraftMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const toggleAttachments = (e) => {
        e.stopPropagation();

        // Block functionality if latex is already attached
        if (shareLatex) return;

        setAttachments(prev => !prev);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (attachmentRef.current && !attachmentRef.current.contains(event.target)) {
                setAttachments(false);
            }
        }

        if (attachments) {
            window.addEventListener('click', handleOutsideClick);
        }

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        }
    }, [attachments]);

    function handleSubmit(e) {
        e.preventDefault();

        const trimmedMessage = draftMessage.trim();
        if (!trimmedMessage) return;

        // TODO: Add Supabase API later on
        // fetch('/some-api', { method: form.method, body: formData });

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                role: 'mentor',
                text: trimmedMessage
            }
        ]);
        setDraftMessage('');
        setShareLatex(false);
    }


    return (
        <div className='h-full min-h-full flex flex-col'>
            {/* Mentor Profile */}
            <div className='w-full flex items-center px-4 py-3 gap-3 border-b border-[var(--mid-main-secondary)]'>
                <img src={User} alt="Mentor image" className='rounded-full h-7 w-7' />
                <h6 className='text-[var(--secondary-color)] font-semibold'>John Fien</h6>
            </div>
            {/* Messages from both parties Chatting Area */}
            <aside className='flex-1 min-h-0 overflow-y-auto px-4 py-3 flex flex-col gap-3'>
                {messages.map((msg) => (
                    <div key={msg.id} className='w-full flex justify-end overflow-hidden'>
                        <div className='bg-[var(--french-gray)] w-fit max-w-[75%] rounded-md text-[var(--secondary-color)] px-3 py-2 text-right'>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </aside>

            {/* Text Input Box*/}
            <div className='rounded-md w-full py-3 border-1 shadow-lg border-[var(--mid-main-secondary)] px-4 gap-3 flex flex-col'>
                {/* Attached Latex Component */}
                {shareLatex && (
                    <div className='bg-[var(--white)] border-[var(--secondary-color)] border flex items-center gap-3 p-2 rounded-md w-fit max-w-[80%] shadow-sm'>
                        <div className='flex items-center gap-2 min-w-0'>
                            <FaCalculator className='text-xs text-[var(--secondary-color)] shrink-0' />
                            <p className='text-sm text-[var(--secondary-color)] font-medium truncate'>
                                Your LaTeX solution
                            </p>
                        </div>

                        <button
                            onClick={() => setShareLatex(false)}
                            className='ml-auto hover:bg-gray-100 p-1 rounded-full transition-colors flex items-center justify-center shrink-0'
                            title="Remove attachment"
                        >
                            <FaTimes className='text-xs text-[var(--secondary-color)] hover:text-[var(--raisin-black)]' />
                        </button>
                    </div>
                )}
                <form ref={formRef} method='POST' onSubmit={handleSubmit} className='flex flex-col gap-2'>
                    <textarea
                        rows={3}
                        type="text"
                        name="chatbox"
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                formRef.current?.requestSubmit();
                            }
                        }}
                        className='placeholder:font-normal text-md py-1 text-[var(--secondary-color)] font-[Sansation,sans-serif] w-full focus:!outline-0 max-w-full resize-none'
                        placeholder='Write a message to the student...'
                        maxLength={500}
                    />

                    {/* Attachments + Send Message Button */}
                    <div className='flex w-full justify-between items-center'>
                        {/* Add attachments Popup + Button */}
                        <div className='relative' ref={attachmentRef}>
                            {/* Attachments Popup */}
                            {attachments && (
                                <div className='absolute left-0 top-[-3rem]'>
                                    <button
                                        onClick={() => {
                                            setShareLatex(true);
                                            setAttachments(false);
                                        }}
                                        className='bg-[var(--white)] hover:bg-[var(--white)]/90 border-[var(--secondary-color)] border-1 flex p-2 rounded-md items-center gap-2 shadow-md'>
                                        <FaCalculator className='text-md text-[var(--secondary-color)]' />
                                        <p className='text-md text-[var(--secondary-color)] whitespace-nowrap'>Attach LaTeX</p>
                                    </button>
                                </div>
                            )}
                            {/* Attachments Button */}
                            <button
                                type="button"
                                // Conditional styles for opacity and blocking hover/clicks
                                className={`hover:bg-[var(--white)] active:bg-[var(--white)] rounded-full p-2 transition-all ${shareLatex
                                    ? 'opacity-30 cursor-not-allowed pointer-events-none'
                                    : 'cursor-pointer'
                                    }`}
                                onClick={toggleAttachments}
                            >
                                <FaFile className='text-[var(--secondary-color)]'></FaFile>
                            </button>
                        </div>
                        {/* Send Button */}
                        <div>
                            <button
                                type="submit"
                                className='rounded-full bg-[var(--accent-color)] p-2 hover:bg-[var(--dark-accent-color)] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={!draftMessage.trim()}
                            >
                                <FaPaperPlane className='text-white text-center text-sm'></FaPaperPlane>
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div >
    );
};

export default MentorChat;