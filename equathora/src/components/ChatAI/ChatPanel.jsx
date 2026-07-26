import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { FaCrown, FaPaperPlane, FaLock } from 'react-icons/fa';
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
import { useSubscription } from '@/hooks/SubscriptionContext';

const FREE_TRIAL_LIMIT = 3;
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
    stripUnsafeControlCharacters(String(str ?? '')
        .replace(/\r\n?/g, '\n')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[\u202A-\u202E]/g, ''))
        .trim();

const sanitizeInput = (str) => sanitizeUnicode(str).slice(0, MAX_INPUT_CHARS);

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
    problemDescription,
    acceptedSolution,
    fields = [],
    storageKey = '',
    pendingMessage = null,
    onPendingMessageSent,
    onBusyChange,
}, ref) => {
    const { tier, trialMessagesUsed = 0, loading: statusLoading, refetchSubscription } = useSubscription();

    const safeTrialUsed = Number(trialMessagesUsed) || 0;
    const remainingMessages = Math.max(0, FREE_TRIAL_LIMIT - safeTrialUsed);
    const trialExhausted = tier === 'free' && remainingMessages <= 0;

    const scrollContainerRef = useRef(null);
    const lastSentAt = useRef(0);
    const [isHydrated, setIsHydrated] = useState(false);
    const hydrationPromiseRef = useRef(Promise.resolve());
    const chatMessagesRef = useRef(DEFAULT_MESSAGES);
    const lastAnalyzedStepsRef = useRef(null);
    const lastProcessedPendingRef = useRef(null);

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
        onBusyChange?.(isAiThinking);
    }, [isAiThinking, onBusyChange]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [chatMessages, isAiThinking]);

    // Hydration lifecycle
    useEffect(() => {
        setInputError('');
        setRateLimited(false);
        setIsAiThinking(false);
        setIsLoadingHistory(Boolean(storageKey));
        setIsHydrated(false);
        lastAnalyzedStepsRef.current = null;
        lastProcessedPendingRef.current = null;

        let isActive = true;
        let resolveHydration = null;
        hydrationPromiseRef.current = new Promise((resolve) => {
            resolveHydration = resolve;
        });

        const hydrateChatState = async () => {
            try {
                if (storageKey) {
                    const loaded = await loadSigmaChatState(storageKey);
                    if (!isActive) return;
                    const nextMessages = loaded.messages?.length > 0 ? loaded.messages : DEFAULT_MESSAGES;
                    setChatMessages(nextMessages);
                    setTypedMessage(loaded.draft || '');
                } else {
                    setChatMessages(DEFAULT_MESSAGES);
                    setTypedMessage('');
                }
            } finally {
                if (isActive) {
                    setIsLoadingHistory(false);
                    setIsHydrated(true);
                }
                resolveHydration?.();
            }
        };

        hydrateChatState();
        return () => { isActive = false; };
    }, [storageKey]);

    // Auto-save draft & messages after hydration
    useEffect(() => {
        if (!isHydrated || !storageKey) return;
        const timer = window.setTimeout(() => {
            saveSigmaChatState(storageKey, { messages: chatMessages, draft: typedMessage });
        }, 250);
        return () => window.clearTimeout(timer);
    }, [storageKey, chatMessages, typedMessage, isHydrated]);

    const handleInputChange = useCallback((e) => {
        const raw = e.target.value;
        setInputError('');
        if (raw.length > MAX_INPUT_CHARS) {
            setInputError(`Max ${MAX_INPUT_CHARS} characters.`);
        }
        setTypedMessage(raw.slice(0, MAX_INPUT_CHARS));
    }, []);

    const runAiCall = useCallback(async (userText, currentMessages, currentFields) => {
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

            lastAnalyzedStepsRef.current = analyzedSteps;

            const safeAiText = truncateAiResponseSafely(
                sanitizeUnicode(String(aiResponseText ?? '')),
                MAX_AI_RESPONSE_CHARS
            ) || 'I had trouble generating a response. Please try again.';

            setChatMessages((prev) =>
                [...prev, { id: Date.now(), sender: 'ai', text: safeAiText }].slice(-MAX_HISTORY_MESSAGES)
            );

            if (refetchSubscription) {
                await refetchSubscription();
            }
        } catch (error) {
            console.error('Sigma chat error:', error);
            const friendlyErrorText = sanitizeUnicode(getFriendlySigmaErrorMessage(error));
            setChatMessages((prev) =>
                [...prev, { id: Date.now(), sender: 'ai', text: friendlyErrorText }].slice(-MAX_HISTORY_MESSAGES)
            );
        } finally {
            setIsAiThinking(false);
        }
    }, [problemDescription, acceptedSolution, refetchSubscription]);

    // Handle incoming pending messages safely without duplicate triggers
    useEffect(() => {
        if (!pendingMessage) return;
        if (isLoadingHistory || isAiThinking || trialExhausted) return;
        if (lastProcessedPendingRef.current === pendingMessage) return;

        const cleanText = sanitizeInput(pendingMessage);
        lastProcessedPendingRef.current = pendingMessage;
        onPendingMessageSent?.();

        if (cleanText) {
            runAiCall(cleanText, chatMessagesRef.current, fields);
        }
    }, [pendingMessage, isLoadingHistory, isAiThinking, trialExhausted, fields, onPendingMessageSent, runAiCall]);

    const sendMessage = useCallback((text) => {
        if (!text || isAiThinking || isLoadingHistory || trialExhausted) return;
        const cleanText = sanitizeInput(text);
        if (!cleanText) return;
        void hydrationPromiseRef.current.then(() => {
            runAiCall(cleanText, chatMessagesRef.current, fields);
        });
    }, [isAiThinking, isLoadingHistory, trialExhausted, fields, runAiCall]);

    useImperativeHandle(ref, () => ({ sendMessage }), [sendMessage]);

    const handleSendMessage = useCallback(async (e) => {
        e?.preventDefault();
        if (trialExhausted) return;

        const now = Date.now();
        if (now - lastSentAt.current < RATE_LIMIT_MS) {
            setRateLimited(true);
            setTimeout(() => setRateLimited(false), RATE_LIMIT_MS);
            return;
        }
        if (isAiThinking) return;

        const userText = sanitizeInput(typedMessage);
        if (!userText) {
            setInputError('Message cannot be empty.');
            return;
        }

        setTypedMessage('');
        setInputError('');
        lastSentAt.current = now;

        await runAiCall(userText, chatMessagesRef.current, fields);
    }, [typedMessage, isAiThinking, fields, trialExhausted, runAiCall]);

    const visibleMessages = chatMessages.slice(-MAX_DISPLAY_MESSAGES);
    const hiddenCount = chatMessages.length - visibleMessages.length;
    const isSendDisabled = isLoadingHistory || isAiThinking || rateLimited || !typedMessage.trim() || trialExhausted;

    if (statusLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[var(--main-color)] rounded-md text-xs text-[var(--mid-main-secondary)]">
                Loading AI Mentor...
            </div>
        );
    }

    return (
        <div className="relative w-full flex-1 flex flex-col font-[Sansation,sans-serif] bg-[var(--white)] text-[var(--secondary-color)] rounded-md overflow-hidden min-h-0">
            {/* Backdrop Lock Overlay */}
            {trialExhausted && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-[var(--main-color)] border border-amber-500/30 rounded-xl p-6 shadow-2xl max-w-sm w-full text-center flex flex-col items-center gap-3 animate-fadeIn">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-xl shadow-inner">
                            <FaLock />
                        </div>
                        <h4 className="font-bold text-lg text-[var(--secondary-color)]">
                            Free Trial Completed
                        </h4>
                        <p className="text-xs text-[var(--mid-main-secondary)] leading-relaxed">
                            You've used all <strong className="text-[var(--secondary-color)]">{FREE_TRIAL_LIMIT} free trial messages</strong>. Upgrade to Premium for unlimited step-by-step mathematical explanations.
                        </p>
                        <Link
                            to="/premium"
                            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                        >
                            <FaCrown className="text-amber-200" />
                            <span>Upgrade to Pro</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Chat Container */}
            <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4 flex flex-col gap-4 bg-[var(--main-color)] p-4">
                {isLoadingHistory ? (
                    <div className="flex items-center gap-2 self-start rounded-2xl border border-[var(--french-gray)] bg-[var(--white)] px-3.5 py-2.5 text-xs text-[var(--secondary-color)]">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--dark-accent-color)]" />
                        Loading your chat history...
                    </div>
                ) : (
                    <>
                        {hiddenCount > 0 && (
                            <p className="text-center text-[10px] text-[var(--mid-main-secondary)] shrink-0">
                                {hiddenCount} earlier message{hiddenCount !== 1 ? 's' : ''} hidden.
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

            {/* Input Form Area */}
            <form onSubmit={handleSendMessage} className="shrink-0 p-3 flex flex-col gap-1.5 border-t border-[var(--french-gray)] bg-[var(--main-color)] rounded-b-md">
                {tier === 'free' && (
                    <div className="flex items-center justify-between px-1 text-[10px] text-[var(--mid-main-secondary)]">
                        <span>
                            {remainingMessages} of {FREE_TRIAL_LIMIT} free messages remaining
                        </span>
                        <Link
                            to="/premium"
                            className="inline-flex items-center gap-1 font-bold text-amber-600 hover:text-amber-500 transition-colors"
                        >
                            <FaCrown />
                            Upgrade
                        </Link>
                    </div>
                )}

                {(inputError || rateLimited) && (
                    <p className="text-[10px] text-red-500 px-1 m-0">
                        {rateLimited ? 'Slow down - please wait a moment.' : inputError}
                    </p>
                )}

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={typedMessage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                            disabled={isLoadingHistory || isAiThinking || rateLimited || trialExhausted}
                            placeholder={
                                trialExhausted
                                    ? 'Trial exhausted. Upgrade to keep chatting.'
                                    : isLoadingHistory
                                        ? 'Loading chat history…'
                                        : isAiThinking
                                            ? 'Sigma is thinking…'
                                            : rateLimited
                                                ? 'Please wait…'
                                                : 'Ask a follow-up question…'
                            }
                            maxLength={MAX_INPUT_CHARS}
                            aria-label="Chat message input"
                            className="w-full rounded-md px-4 py-2 text-sm md:text-base border bg-[var(--main-color)] border-[var(--french-gray)] text-[var(--secondary-color)] focus:!outline-none disabled:opacity-50 !h-full"
                        />
                        {typedMessage.length > MAX_INPUT_CHARS * 0.8 && (
                            <span
                                className="absolute right-2 bottom-0 text-[10px] pointer-events-none font-bold"
                                style={{ color: typedMessage.length >= MAX_INPUT_CHARS ? '#d70427' : 'var(--mid-main-secondary)' }}
                            >
                                {typedMessage.length}/{MAX_INPUT_CHARS}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSendDisabled}
                        aria-label="Send message"
                        className="font-bold text-xs py-2 px-4 rounded-md transition-all active:scale-95 cursor-pointer text-[var(--secondary-color)] hover:text-[var(--white)] border hover:bg-[var(--secondary-color)] border-[var(--secondary-color)] hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-full"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
});

export default ChatPanel;