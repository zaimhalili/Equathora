import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaCrown, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ─── Security & UX constants ───────────────────────────────────────────────
const MAX_INPUT_CHARS = 500;   // hard cap on user input length
const MAX_HISTORY_MESSAGES = 100;   // max chat bubbles kept in state
const MAX_DISPLAY_MESSAGES = 50;    // max bubbles rendered at once (tail)
const RATE_LIMIT_MS = 2000;  // minimum ms between sends
const MAX_STEPS_CHARS = 2000;  // compiled steps sent to API

// Strips control characters and dangerous unicode that can break layout or
// be used for prompt-injection / UI redressing attacks.
const sanitize = (str) =>
    str
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // control chars
        .replace(/[\u200B-\u200D\uFEFF]/g, '')         // zero-width chars
        .replace(/[\u202A-\u202E]/g, '')               // bidi override chars
        .trim()
        .slice(0, MAX_INPUT_CHARS);

// ──────────────────────────────────────────────────────────────────────────
const ChatPanel = ({
    premium = true,
    problemDescription,
    acceptedSolution,
    fields = [],
}) => {
    const scrollContainerRef = useRef(null);
    const lastSentAt = useRef(0);

    const [typedMessage, setTypedMessage] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);
    const [inputError, setInputError] = useState('');

    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: "Hi! Submit your steps on the workspace, and I will scan them line-by-line to point out exactly where your algebraic formulas go wrong.",
        },
    ]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        }
    }, [chatMessages, isAiThinking]);

    // Clamp + sanitize what goes into the input box in real-time
    const handleInputChange = useCallback((e) => {
        const raw = e.target.value;
        setInputError('');
        if (raw.length > MAX_INPUT_CHARS) {
            setInputError(`Max ${MAX_INPUT_CHARS} characters.`);
        }
        // Allow typing but clamp at the cap
        setTypedMessage(raw.slice(0, MAX_INPUT_CHARS));
    }, []);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();

        const now = Date.now();

        // Rate-limit guard
        if (now - lastSentAt.current < RATE_LIMIT_MS) {
            setRateLimited(true);
            setTimeout(() => setRateLimited(false), RATE_LIMIT_MS);
            return;
        }
        if (isAiThinking) return;

        const userText = sanitize(typedMessage);
        if (!userText) {
            setInputError('Message cannot be empty or contain only whitespace.');
            return;
        }

        setTypedMessage('');
        setInputError('');
        lastSentAt.current = now;

        const newUserMsg = { id: now, sender: 'user', text: userText };

        // Keep history bounded to prevent memory bloat
        const updatedHistory = [...chatMessages, newUserMsg].slice(
            -MAX_HISTORY_MESSAGES
        );
        setChatMessages(updatedHistory);
        setIsAiThinking(true);

        // Compile steps – bounded to avoid prompt-injection via huge LaTeX blobs
        const activeStepsCompiled = fields
            .filter((f) => f.latex && f.latex.trim() !== '')
            .map((f, idx) => `Step ${idx + 1}: ${f.latex}`)
            .join('\n')
            .slice(0, MAX_STEPS_CHARS);

        try {
            const aiResponseText = await askSigmaChat({
                problemDescription: String(problemDescription ?? '').slice(0, 1000),
                userSteps: activeStepsCompiled,
                acceptedAnswer: String(acceptedSolution ?? '').slice(0, 500),
                // Only send the last 20 turns to the API to keep context manageable
                chatHistory: updatedHistory.slice(-20),
                userNewMessage: userText,
            });

            // Sanitize AI response too – never trust external content in the DOM
            const safeAiText = sanitize(String(aiResponseText ?? '')).slice(0, 2000) ||
                'I had trouble generating a response. Please try again.';

            setChatMessages((prev) =>
                [...prev, { id: Date.now(), sender: 'ai', text: safeAiText }].slice(
                    -MAX_HISTORY_MESSAGES
                )
            );
        } catch (error) {
            console.error('Failed to run message query:', error);
            setChatMessages((prev) =>
                [
                    ...prev,
                    {
                        id: Date.now(),
                        sender: 'ai',
                        text: 'Sorry, I ran into an error processing that. Please try again.',
                    },
                ].slice(-MAX_HISTORY_MESSAGES)
            );
        } finally {
            setIsAiThinking(false);
        }
    }, [typedMessage, isAiThinking, chatMessages, fields, problemDescription, acceptedSolution]);

    // Only render the tail of the history to avoid DOM explosion
    const visibleMessages = chatMessages.slice(-MAX_DISPLAY_MESSAGES);
    const hiddenCount = chatMessages.length - visibleMessages.length;

    const isSendDisabled =
        isAiThinking || rateLimited || !typedMessage.trim();

    // Render
    if (!premium) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--main-color)] rounded-md p-6">
                <div className="text-center flex flex-col items-center gap-1">
                    <FaCrown className="text-amber-500 text-3xl animate-bounce" />
                    <h4 className="font-bold text-lg text-[var(--secondary-color)]">
                        Unlock Sigma AI Mentor
                    </h4>
                    <p className="text-sm text-[var(--mid-main-secondary)] max-w-xs pb-2">
                        Get instant step-by-step corrections and debug your line
                        calculations in real-time.
                    </p>
                    <Link to={'/premium'} className='bg-gradient-to-b from-amber-600 to-amber-400 px-3 md:px-4 rounded-md cursor-pointer text-xs md:text-sm transition-all duration-200 flex items-center gap-1.5 h-9 md:h-10 text-[var(--secondary-color)] hover:to-amber-500 active:!scale-95' title='Get the Premium now'>
                        <FaCrown></FaCrown>
                        <span>Upgrade</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full flex-1 flex flex-col font-[Sansation,sans-serif] bg-[var(--white)] text-[var(--secondary-color)] rounded-md overflow-hidden"
            style={{ minHeight: 0 }}
        >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--french-gray)] bg-[var(--white)] shrink-0 rounded-t-md">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-wide uppercase m-0 text-[var(--secondary-color)] flex items-center gap-1">
                        <FaCrown
                            className="h-3 w-3 md:h-4 md:w-4"
                            style={{ fill: 'url(#crownGradient)' }}
                        />
                        <svg width="0" height="0" aria-hidden="true">
                            <defs>
                                <linearGradient id="crownGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                            </defs>
                        </svg>
                        Sigma
                    </h3>
                </div>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gradient-to-b from-amber-600 to-amber-400 text-[var(--white)]">
                    AI MENTOR
                </span>
            </div>

            {/* Messages */}
            <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 bg-[var(--white)]"
            >
                {/* Inform user if early messages are hidden */}
                {hiddenCount > 0 && (
                    <p className="text-center text-[10px] text-[var(--mid-main-secondary)] shrink-0">
                        {hiddenCount} earlier message{hiddenCount !== 1 ? 's' : ''} hidden to keep things fast.
                    </p>
                )}

                {visibleMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'ai' ? 'self-start' : 'self-end'
                            }`}
                    >
                        <div
                            className={`border rounded-2xl px-4 py-2.5 text-xs md:text-sm leading-relaxed ${msg.sender === 'ai'
                                ? 'border-[var(--french-gray)] rounded-tl-none bg-[var(--white)] text-[var(--secondary-color)]'
                                : 'border-transparent rounded-tr-none bg-[var(--dark-accent-color)] text-[var(--white)]'
                                }`}
                            style={{
                                // Prevent any single long word / URL from blowing the layout
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isAiThinking && (
                    <div className="flex flex-col gap-1 max-w-[85%] self-start opacity-75 shrink-0">
                        <div className="border border-[var(--french-gray)] rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs bg-[var(--main-color)] text-[var(--secondary-color)] italic">
                            Sigma is thinking…
                        </div>
                    </div>
                )}
            </div>

            {/* Input Zone */}
            <form
                onSubmit={handleSendMessage}
                className="shrink-0 px-3 pt-2 pb-3 flex flex-col gap-1 border-t border-[var(--french-gray)] bg-[var(--white)] rounded-b-md"
            >
                {/* Error / status bar */}
                {(inputError || rateLimited) && (
                    <p className="text-[10px] text-red-500 px-1 m-0">
                        {rateLimited
                            ? 'Slow down — please wait a moment before sending again.'
                            : inputError}
                    </p>
                )}

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={typedMessage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e);
                            }}
                            disabled={isAiThinking || rateLimited}
                            placeholder={
                                isAiThinking
                                    ? 'Sigma is formulating a tip…'
                                    : rateLimited
                                        ? 'Please wait…'
                                        : 'Ask a follow-up question…'
                            }
                            maxLength={MAX_INPUT_CHARS}
                            aria-label="Chat message input"
                            className="w-full rounded-md px-3 py-2 text-sm md:text-base border bg-[var(--main-color)] border-[var(--french-gray)] text-[var(--secondary-color)] focus:!outline-none disabled:opacity-50 !h-full"
                        />
                        {/* Character counter — only visible when close to cap */}
                        {typedMessage.length > MAX_INPUT_CHARS * 0.8 && (
                            <span
                                className="absolute right-2 bottom-0 text-[10px] pointer-events-none font-bold"
                                style={{
                                    color:
                                        typedMessage.length >= MAX_INPUT_CHARS
                                            ? '#d70427'
                                            : 'var(--mid-main-secondary)',
                                }}
                            >
                                {typedMessage.length}/{MAX_INPUT_CHARS}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSendDisabled}
                        aria-label="Send message"
                        className="font-bold text-xs md:text-base px-3.5 py-2 rounded-md transition-all active:scale-95 cursor-pointer text-[var(--secondary-color)] bg-[var(--white)] hover:text-[var(--white)] border hover:bg-[var(--secondary-color)] border-[var(--secondary-color)] hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-full"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
};


export default ChatPanel;