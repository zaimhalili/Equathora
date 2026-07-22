import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { FaCrown, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { convertLatexToMarkup } from 'mathlive';
import 'mathlive/static.css';
import { askSigmaChat } from '@/lib/SigmaChat/askSigmaChat';
import { getFriendlySigmaErrorMessage } from '@/lib/SigmaChat/aiSafety';
import {
    hasBalancedLatexBraces,
    isProseHeavyLatex,
    parseChatLatex,
    stripLatexTextCommands,
    truncateAiResponseSafely,
} from '@/lib/SigmaChat/chatLatex';
import { loadSigmaChatState, saveSigmaChatState } from '@/lib/SigmaChat/sigmaChatStorage';

const MAX_INPUT_CHARS = 500;
const MAX_AI_RESPONSE_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 100;
const MAX_DISPLAY_MESSAGES = 50;
const RATE_LIMIT_MS = 2000;
const MAX_STEPS_CHARS = 2000;
const DEFAULT_MESSAGES = [
    {
        id: 1,
        sender: 'ai',
        text: "Hi! Submit your steps on the LaTeX workspace, and I will scan them line-by-line to point out exactly where your algebraic formulas go wrong.",
    },
];

// Only sanitize dangerous unicode — does NOT slice, so AI long responses survive
const stripUnsafeControlCharacters = (str) =>
    Array.from(str, (character) => {
        const codePoint = character.codePointAt(0);
        const isUnsafeControl = codePoint <= 9
            || codePoint === 11
            || codePoint === 12
            || (codePoint >= 14 && codePoint <= 31)
            || (codePoint >= 127 && codePoint <= 159);

        return isUnsafeControl ? '' : character;
    }).join('');

const sanitizeUnicode = (str) =>
    stripUnsafeControlCharacters(str
        .replace(/\r\n?/g, '\n')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[\u202A-\u202E]/g, ''))
        .trim();

// For user input — sanitize AND hard cap
const sanitizeInput = (str) => sanitizeUnicode(str).slice(0, MAX_INPUT_CHARS);

// ---------------------------------------------------------------------------
// Math rendering
//
// Splits plain text from common LaTeX delimiters and renders math spans through
// MathLive's static renderer. Only MathLive's own generated
// markup goes through dangerouslySetInnerHTML — plain-text segments stay as
// normal React children, which React escapes automatically, so raw AI/user
// text is never injected as HTML.
// ---------------------------------------------------------------------------

function renderLatexSafe(latex, displayMode) {
    if (!hasBalancedLatexBraces(latex)) return null;

    try {
        const markup = convertLatexToMarkup(latex, {
            mathstyle: displayMode ? 'displaystyle' : 'textstyle',
        });

        return markup && !markup.includes('ML__error') ? markup : null;
    } catch {
        return null;
    }
}

function renderMathSegment(segment, key) {
    if (isProseHeavyLatex(segment.value)) {
        return <span key={key}>{stripLatexTextCommands(segment.value)}</span>;
    }

    const markup = renderLatexSafe(segment.value, segment.display);
    if (!markup) {
        return <span key={key}>{segment.source}</span>;
    }

    const className = segment.display
        ? 'block max-w-full overflow-x-auto py-2 text-center'
        : 'inline-block max-w-full align-middle';

    return (
        <span
            key={key}
            className={className}
            role="math"
            aria-label={segment.value}
            dangerouslySetInnerHTML={{ __html: markup }}
        />
    );
}

function MathText({ text }) {
    return (
        <>
            {parseChatLatex(text).map((segment, index) =>
                segment.type === 'math'
                    ? renderMathSegment(segment, index)
                    : <span key={index}>{segment.value}</span>
            )}
        </>
    );
}

const ChatPanel = forwardRef(({
    premium = true,
    problemDescription,
    acceptedSolution,
    fields = [],
    storageKey = '',
}, ref) => {
    const scrollContainerRef = useRef(null);
    const lastSentAt = useRef(0);
    const isHydratingRef = useRef(false);
    const hydrationPromiseRef = useRef(Promise.resolve());
    const chatMessagesRef = useRef(DEFAULT_MESSAGES);
    // Tracks the steps text Sigma last actually analyzed, so askSigmaChat can
    // tell a plain follow-up question (steps unchanged) from a re-analysis
    // (steps edited) and trim the outgoing context accordingly.
    const lastAnalyzedStepsRef = useRef(null);

    const [typedMessage, setTypedMessage] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(Boolean(storageKey));
    const [rateLimited, setRateLimited] = useState(false);
    const [inputError, setInputError] = useState('');
    const [chatMessages, setChatMessages] = useState(DEFAULT_MESSAGES);

    useEffect(() => {
        chatMessagesRef.current = chatMessages;
    }, [chatMessages]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [chatMessages, isAiThinking]);

    useEffect(() => {
        setInputError('');
        setRateLimited(false);
        setIsAiThinking(false);
        setIsLoadingHistory(Boolean(storageKey));
        // New problem/session — the previously analyzed steps no longer apply.
        lastAnalyzedStepsRef.current = null;

        let isActive = true;
        isHydratingRef.current = true;
        let resolveHydration = null;
        hydrationPromiseRef.current = new Promise((resolve) => {
            resolveHydration = resolve;
        });

        const hydrateChatState = async () => {
            try {
                const loaded = await loadSigmaChatState(storageKey);

                if (!isActive) {
                    return;
                }

                const nextMessages = loaded.messages.length > 0 ? loaded.messages : DEFAULT_MESSAGES;
                setChatMessages(nextMessages);
                setTypedMessage(loaded.draft);
            } finally {
                if (isActive) {
                    isHydratingRef.current = false;
                    setIsLoadingHistory(false);
                }

                resolveHydration?.();
            }
        };

        hydrateChatState();

        return () => {
            isActive = false;
        };
    }, [storageKey]);

    useEffect(() => {
        if (isHydratingRef.current || !storageKey) {
            return;
        }

        const timer = window.setTimeout(() => {
            saveSigmaChatState(storageKey, { messages: chatMessages, draft: typedMessage });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [storageKey, chatMessages, typedMessage]);

    const handleInputChange = useCallback((e) => {
        const raw = e.target.value;
        setInputError('');
        if (raw.length > MAX_INPUT_CHARS) {
            setInputError(`Max ${MAX_INPUT_CHARS} characters.`);
        }
        setTypedMessage(raw.slice(0, MAX_INPUT_CHARS));
    }, []);

    // Shared core — used by both manual send and imperative sendMessage from parent
    const runAiCall = async (userText, currentMessages, currentFields) => {
        const userMsg = { id: Date.now(), sender: 'user', text: userText };
        const updatedHistory = [...currentMessages, userMsg].slice(-MAX_HISTORY_MESSAGES);
        setChatMessages(updatedHistory);
        setIsAiThinking(true);

        const activeStepsCompiled = currentFields
            .filter((f) => f.latex && f.latex.trim() !== '')
            .map((f, idx) => `Step ${idx + 1}: ${f.latex}`)
            .join('\n')
            .slice(0, MAX_STEPS_CHARS);

        try {
            const { text: aiResponseText, analyzedSteps } = await askSigmaChat({
                problemDescription: String(problemDescription ?? '').slice(0, 1000),
                userSteps: activeStepsCompiled,
                acceptedAnswer: String(acceptedSolution ?? '').slice(0, 500),
                chatHistory: updatedHistory.slice(-20),
                userNewMessage: userText,
                lastAnalyzedSteps: lastAnalyzedStepsRef.current,
            });

            // Remember what Sigma actually analyzed this turn, so the next
            // follow-up question can be trimmed if the steps haven't changed.
            lastAnalyzedStepsRef.current = analyzedSteps;

            const safeAiText = truncateAiResponseSafely(
                sanitizeUnicode(String(aiResponseText ?? '')),
                MAX_AI_RESPONSE_CHARS
            ) || 'I had trouble generating a response. Please try again.';

            setChatMessages((prev) =>
                [...prev, { id: Date.now(), sender: 'ai', text: safeAiText }].slice(-MAX_HISTORY_MESSAGES)
            );
        } catch (error) {
            console.error('Sigma chat error:', error);
            const friendlyErrorText = sanitizeUnicode(getFriendlySigmaErrorMessage(error));
            setChatMessages((prev) =>
                [...prev, { id: Date.now(), sender: 'ai', text: friendlyErrorText }].slice(-MAX_HISTORY_MESSAGES)
            );
        } finally {
            setIsAiThinking(false);
        }
    };

    // Called by parent via ref — bypasses rate limit since it's triggered by the app not the user spamming
    const sendMessage = (text) => {
        if (!text || isAiThinking || isLoadingHistory) return;
        const cleanText = sanitizeInput(text);
        if (!cleanText) return;

        void hydrationPromiseRef.current.then(() => {
            runAiCall(cleanText, chatMessagesRef.current, fields);
        });
    };

    useImperativeHandle(ref, () => ({ sendMessage }), [chatMessages, fields, problemDescription, acceptedSolution, isAiThinking]);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        const now = Date.now();

        if (now - lastSentAt.current < RATE_LIMIT_MS) {
            setRateLimited(true);
            setTimeout(() => setRateLimited(false), RATE_LIMIT_MS);
            return;
        }
        if (isAiThinking) return;

        const userText = sanitizeInput(typedMessage);
        if (!userText) {
            setInputError('Message cannot be empty or contain only whitespace.');
            return;
        }

        setTypedMessage('');
        setInputError('');
        lastSentAt.current = now;

        await runAiCall(userText, chatMessagesRef.current, fields);
    }, [typedMessage, isAiThinking, isLoadingHistory, chatMessages, fields, problemDescription, acceptedSolution]);

    const visibleMessages = chatMessages.slice(-MAX_DISPLAY_MESSAGES);
    const hiddenCount = chatMessages.length - visibleMessages.length;
    const isSendDisabled = isLoadingHistory || isAiThinking || rateLimited || !typedMessage.trim();

    if (!premium) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--main-color)] rounded-md p-6">
                <div className="text-center flex flex-col items-center gap-1">
                    <FaCrown className="text-amber-500 text-3xl animate-bounce" />
                    <h4 className="font-bold text-lg text-[var(--secondary-color)]">Unlock Sigma AI Mentor</h4>
                    <p className="text-sm text-[var(--mid-main-secondary)] max-w-xs pb-2">
                        Get instant step-by-step corrections and debug your line calculations in real-time.
                    </p>
                    <Link to={'/premium'} className='bg-gradient-to-b from-amber-600 to-amber-400 px-3 md:px-4 rounded-md cursor-pointer text-xs md:text-sm transition-all duration-200 flex items-center gap-1.5 h-9 md:h-10 text-[var(--secondary-color)] hover:to-amber-500 active:!scale-95' title='Get Premium'>
                        <FaCrown />
                        <span>Upgrade</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col font-[Sansation,sans-serif] bg-[var(--white)] text-[var(--secondary-color)] rounded-md overflow-hidden min-h-0">

            {/* Messages */}
            <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4 flex flex-col gap-4 bg-[var(--main-color)]">
                {isLoadingHistory ? (
                    <div className="flex items-center gap-2 self-start rounded-2xl border border-[var(--french-gray)] bg-[var(--white)] px-3.5 py-2.5 text-xs text-[var(--secondary-color)]">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--dark-accent-color)]" />
                        Loading your chat history...
                    </div>
                ) : (
                    <>
                        {hiddenCount > 0 && (
                            <p className="text-center text-[10px] text-[var(--mid-main-secondary)] shrink-0">
                                {hiddenCount} earlier message{hiddenCount !== 1 ? 's' : ''} hidden to keep things fast.
                            </p>
                        )}

                        {visibleMessages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'ai' ? 'self-start' : 'self-end'}`}>
                                <div
                                    className={`border rounded-2xl px-4 py-2.5 text-xs md:text-sm leading-relaxed ${msg.sender === 'ai'
                                        ? 'border-[var(--french-gray)] rounded-tl-none bg-[var(--white)] text-[var(--secondary-color)]'
                                        : 'border-transparent rounded-tr-none bg-[var(--dark-accent-color)] text-white'
                                        }`}
                                    style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}
                                >
                                    <MathText text={msg.text} />
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {isAiThinking && (
                    <div className="flex flex-col gap-1 max-w-[85%] self-start opacity-75 shrink-0">
                        <div className="border border-[var(--secondary-color)] rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs bg-[var(--main-color)] text-[var(--secondary-color)] italic">
                            Sigma is thinking…
                        </div>
                    </div>
                )}
            </div>

            {/* Input Zone */}
            <form onSubmit={handleSendMessage} className="shrink-0 py-4 flex flex-col gap-1 border-t border-[var(--french-gray)] bg-[var(--main-color)] rounded-b-md">
                {(inputError || rateLimited) && (
                    <p className="text-[10px] text-red-500 px-1 m-0">
                        {rateLimited ? 'Slow down - please wait a moment before sending again.' : inputError}
                    </p>
                )}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={typedMessage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                            disabled={isLoadingHistory || isAiThinking || rateLimited}
                            placeholder={isLoadingHistory ? 'Loading chat history…' : isAiThinking ? 'Sigma is thinking…' : rateLimited ? 'Please wait…' : 'Ask a follow-up question…'}
                            maxLength={MAX_INPUT_CHARS}
                            aria-label="Chat message input"
                            className="w-full rounded-md px-4 py-2 text-sm md:text-base border bg-[var(--main-color)] border-[var(--french-gray)] text-[var(--secondary-color)] focus:!outline-none disabled:opacity-50 !h-full"
                        />
                        {typedMessage.length > MAX_INPUT_CHARS * 0.8 && (
                            <span className="absolute right-2 bottom-0 text-[10px] pointer-events-none font-bold"
                                style={{ color: typedMessage.length >= MAX_INPUT_CHARS ? '#d70427' : 'var(--mid-main-secondary)' }}>
                                {typedMessage.length}/{MAX_INPUT_CHARS}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSendDisabled}
                        aria-label="Send message"
                        className="font-bold text-xs py-2 px-4 rounded-md transition-all active:scale-95 cursor-pointer text-[var(--secondary-color)]  hover:text-[var(--white)] border hover:bg-[var(--secondary-color)] border-[var(--secondary-color)] hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-full"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
});

export default ChatPanel;