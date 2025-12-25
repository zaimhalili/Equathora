import React, { useState, useRef, useEffect } from "react";
import {
    FaWhatsapp,
    FaFacebookMessenger,
    FaTwitter,
    FaLinkedin,
    FaRegClipboard,
    FaClipboardCheck,
    FaShare,
    FaReddit,
    FaTelegram,
} from "react-icons/fa";

const ShareButton = ({ text = "Check this out!", url = window.location.href }) => {
    const [shareNow, setShareNow] = useState(false);
    const [copied, setCopied] = useState(false);
    const popupRef = useRef(null);
    const message = encodeURIComponent(`${text} ${url}`);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShareNow(false);
            }
        };

        if (shareNow) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [shareNow]);

    // Social media share handlers
    const handleWhatsAppShare = () => {
        window.open(`https://wa.me/?text=${message}`, "_blank");
        setShareNow(false);
    };

    const handleMessengerShare = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank"
        );
        setShareNow(false);
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?text=${message}`, "_blank");
        setShareNow(false);
    };

    const handleLinkedInShare = () => {
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            "_blank"
        );
        setShareNow(false);
    };

    const handleRedditShare = () => {
        window.open(
            `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
            "_blank"
        );
        setShareNow(false);
    };

    const handleTelegramShare = () => {
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            "_blank"
        );
        setShareNow(false);
    };

    // Clipboard functionality
    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShareNow(false);
            }, 1500);
        });
    };

    return (
        <div className="relative" ref={popupRef}>
            <button
                type="button"
                onClick={() => setShareNow(!shareNow)}
                className="button border-[var(--accent-color)] border-2 text-center px-4 py-2 text-xl font-medium rounded-sm shadow-lg cursor-pointer flex items-center gap-2"
            >
                <FaShare className="text-lg" />
                Share
            </button>

            {/* Popup */}
            {shareNow && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[var(--accent-color)] rounded-lg shadow-2xl p-4 z-50 min-w-[280px]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b-2 border-[var(--accent-color)] pb-2">
                        Share via
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {/* WhatsApp */}
                        <button
                            onClick={handleWhatsAppShare}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-green-50 transition-colors group"
                            title="Share on WhatsApp"
                        >
                            <FaWhatsapp className="text-3xl text-green-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-600">WhatsApp</span>
                        </button>

                        {/* Twitter */}
                        <button
                            onClick={handleTwitterShare}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                            title="Share on Twitter"
                        >
                            <FaTwitter className="text-3xl text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-600">Twitter</span>
                        </button>

                        {/* LinkedIn */}
                        <button
                            onClick={handleLinkedInShare}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                            title="Share on LinkedIn"
                        >
                            <FaLinkedin className="text-3xl text-blue-700 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-600">LinkedIn</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={handleMessengerShare}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                            title="Share on Facebook"
                        >
                            <FaFacebookMessenger className="text-3xl text-blue-600 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-600">Facebook</span>
                        </button>

                        {/* Reddit */}
                        <button
                            onClick={handleRedditShare}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
                            title="Share on Reddit"
                        >
                            <FaReddit className="text-3xl text-orange-600 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-600">Reddit</span>
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={handleTelegramShare}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                            title="Share on Telegram"
                        >
                            <FaTelegram className="text-3xl text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-600">Telegram</span>
                        </button>
                    </div>

                    {/* Copy Link Button */}
                    <button
                        onClick={handleCopy}
                        className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        {copied ? (
                            <>
                                <FaClipboardCheck className="text-xl" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <FaRegClipboard className="text-xl" />
                                Copy Link
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButton;