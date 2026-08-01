import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaDiscord, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import GuestAvatar from '../assets/images/guestAvatar.png';
import Daily from '../assets/images/questionMark1.svg';
import Leaderboards from '../assets/images/leaderboards.svg';
import Favourite from '../assets/images/favourite.svg';
import PremiumIcon from '../assets/images/Premium.svg';
import Journey from '../assets/images/journey.svg';
import Mentoring from '../assets/images/mentoring.svg';
import Faq from '../assets/images/faq.svg';
import AboutUs from '../assets/images/about.svg';
import LogoutIMG from '../assets/images/logout.svg';
import Statistics from '../assets/images/statistics.svg';
import Settings from '../assets/images/settings.svg';
import Updates from '../assets/images/updates.svg';
import Notifications from '../assets/images/notificationsDD.svg';
import Achievements from '../assets/images/achievementsDD.svg';
import Events from '../assets/images/specialEvents.svg';
import Books from '../assets/images/learningBooks.svg';
import Sigma from '../assets/logo/TransparentSymbol.png';
import { supabase } from '../lib/supabaseClient';
import { clearUserData } from '../lib/userStorage';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserStats } from '../context/UserStatsContext';
import { useSubscriptionStatus } from '@/hooks/useSubscription';
import { getNextRecommendedProblem } from '@/lib/Dashboard/nextRecommendedProblem';
import Mail from '../assets/images/mail1.svg';

const getLowResAvatarUrl = (avatarUrl) => {
    if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim() === '') {
        return GuestAvatar;
    }

    try {
        const parsed = new URL(avatarUrl);
        if (!parsed.searchParams.has('w')) parsed.searchParams.set('w', '56');
        if (!parsed.searchParams.has('h')) parsed.searchParams.set('h', '56');
        if (!parsed.searchParams.has('q')) parsed.searchParams.set('q', '40');
        return parsed.toString();
    } catch {
        return avatarUrl;
    }
};

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { profile } = useUserProfile();
    const { premium, loading: onloading } = useSubscriptionStatus();
    const { stats } = useUserStats();

    const [nextProblem, setNextProblem] = useState(null);
    const [profileAvatarSrc, setProfileAvatarSrc] = useState(GuestAvatar);

    // Accordion section states
    const [openSections, setOpenSections] = useState({
        learn: true,
        discover: false,
        achievements: false,
        more: false,
        account: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        if (onloading) return;

        const loadNextProblem = async () => {
            try {
                const problem = await getNextRecommendedProblem(premium);
                setNextProblem(problem || null);
            } catch (error) {
                console.error('Failed to load next recommended problem:', error);
                setNextProblem(null);
            }
        };
        loadNextProblem();
    }, [premium, onloading]);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const metadata = session.user?.user_metadata || {};
                const avatarUrl = metadata.avatar_url || metadata.picture || metadata.image || metadata.photo_url || '';
                setProfileAvatarSrc(getLowResAvatarUrl(avatarUrl));
            } catch (error) {
                console.error('Failed to fetch avatar for sidebar:', error);
            }
        };
        if (isOpen) {
            fetchAvatar();
        }
    }, [isOpen]);

    // Fallback safe streak calculation identical to Navbar
    const currentStreak = stats?.currentStreak ?? stats?.streak ?? 0;

    const dailyProblemTo = nextProblem?.slug ? `/problems/${nextProblem.slug}` : '/journey';

    const handleSignOut = async () => {
        await clearUserData();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex justify-end">
            {/* Overlay Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar Content Panel */}
            <div
                id="mobile-navigation"
                className="relative w-full max-w-xs sm:max-w-sm bg-[var(--main-color)] h-full shadow-2xl overflow-y-auto flex flex-col z-[1110] text-[var(--secondary-color)]"
            >
                {/* Top Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-700/30">
                    <Link
                        to="/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3 font-bold text-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <img src={Sigma} alt="Equathora Logo" className="w-8 h-8" />
                        <span className="font-[Sansation,Arial]">Equathora</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-[var(--secondary-color)] hover:text-[var(--accent-color)] hover:bg-white/5 rounded-lg transition-colors"
                        aria-label="Close navigation menu"
                    >
                        <FaTimes size={30} />
                    </button>
                </div>

                {/* User Stats Card */}
                <div className="p-5 bg-[var(--dark-main-color)]/20 border-b border-gray-700/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <img
                                src={profileAvatarSrc}
                                alt="Profile Avatar"
                                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--secondary-color)] shadow-sm"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = GuestAvatar; }}
                            />
                            <div>
                                <p className="font-bold text-lg truncate max-w-[140px]">
                                    {profile?.username || profile?.full_name || 'Guest User'}
                                </p>
                                <p className="text-sm opacity-75">
                                    {premium ? 'Premium Member' : 'Free Plan'}
                                </p>
                            </div>
                        </div>

                        {/* Streak Counter */}
                        <Link
                            to="/achievements/stats"
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--main-color)] border border-gray-700/30 hover:border-[var(--accent-color)] hover:bg-white/5 transition-all active:scale-[0.96]"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="icon-gradient-fire-sidebar" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--dark-accent-color)" />
                                        <stop offset="100%" stopColor="var(--accent-color)" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#icon-gradient-fire-sidebar)" d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
                            </svg>
                            <span className="font-bold text-lg">{currentStreak}</span>
                        </Link>
                    </div>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto pb-2">
                    {/* Learn Section */}
                    <div className="border-b border-gray-700/20">
                        <button
                            onClick={() => toggleSection('learn')}
                            className="w-full flex items-center justify-between px-5 py-4 font-semibold text-lg hover:bg-white/5 transition-colors"
                        >
                            <span>Learn</span>
                            {openSections.learn ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                        </button>
                        {openSections.learn && (
                            <div className="pl-7 pr-5 pb-4 space-y-2">
                                <Link
                                    to={dailyProblemTo}
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Daily} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Daily Problem</span>
                                </Link>
                                <Link
                                    to="/journey"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Journey} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Your Journey</span>
                                </Link>
                                <Link
                                    to="/learn"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Books} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Browse Problems</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Discover Section */}
                    <div className="border-b border-gray-700/20">
                        <button
                            onClick={() => toggleSection('discover')}
                            className="w-full flex items-center justify-between px-5 py-4 font-semibold text-lg hover:bg-white/5 transition-colors"
                        >
                            <span>Discover</span>
                            {openSections.discover ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                        </button>
                        {openSections.discover && (
                            <div className="pl-7 pr-5 pb-4 space-y-2">
                                <Link
                                    to="/leaderboards/global"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Leaderboards} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Leaderboards</span>
                                </Link>
                                <Link
                                    to="/learn?status=favorite"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Favourite} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Favourite Problems</span>
                                </Link>
                                <Link
                                    to="/equathora-briefs"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Mail} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Equathora Briefs</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Achievements Section */}
                    <div className="border-b border-gray-700/20">
                        <button
                            onClick={() => toggleSection('achievements')}
                            className="w-full flex items-center justify-between px-5 py-4 font-semibold text-lg hover:bg-white/5 transition-colors"
                        >
                            <span>Achievements & Stats</span>
                            {openSections.achievements ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                        </button>
                        {openSections.achievements && (
                            <div className="pl-7 pr-5 pb-4 space-y-2">
                                <Link
                                    to="/achievements/recent"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Achievements} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>All Achievements</span>
                                </Link>
                                <Link
                                    to="/achievements/stats"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Statistics} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Statistics</span>
                                </Link>
                                <Link
                                    to="/achievements/events"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Events} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Special Events</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Account Section */}
                    <div className="border-b border-gray-700/20">
                        <button
                            onClick={() => toggleSection('account')}
                            className="w-full flex items-center justify-between px-5 py-4 font-semibold text-lg hover:bg-white/5 transition-colors"
                        >
                            <span>Account</span>
                            {openSections.account ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                        </button>
                        {openSections.account && (
                            <div className="pl-7 pr-5 pb-4 space-y-2">
                                <Link
                                    to="/profile/myprofile"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={profileAvatarSrc} alt="" className="w-7 h-7 rounded-full object-cover transition-transform duration-200 group-hover:scale-110" />
                                    <span>My Profile</span>
                                </Link>
                                <Link
                                    to="/notifications"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Notifications} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Notifications</span>
                                </Link>
                                <Link
                                    to="/settings"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Settings} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Settings</span>
                                </Link>
                                <Link
                                    to="/systemupdates"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Updates} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>System Updates</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* More Section */}
                    <div className="border-b border-gray-700/20">
                        <button
                            onClick={() => toggleSection('more')}
                            className="w-full flex items-center justify-between px-5 py-4 font-semibold text-lg hover:bg-white/5 transition-colors"
                        >
                            <span>More</span>
                            {openSections.more ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                        </button>
                        {openSections.more && (
                            <div className="pl-7 pr-5 pb-4 space-y-2">
                                <Link
                                    to="/applymentor"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Mentoring} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Teacher / Mentor</span>
                                </Link>
                                <Link
                                    to="/helpCenter"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={Faq} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>Help Center</span>
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <img src={AboutUs} alt="" className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-110" />
                                    <span>About Equathora</span>
                                </Link>
                                <a
                                    href="https://discord.gg/s6tNSbyhB7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    className="group flex items-center gap-4 py-3 text-lg opacity-90 hover:opacity-100 hover:text-[var(--accent-color)] hover:translate-x-1.5 transition-all duration-200 ease-out"
                                >
                                    <FaDiscord className="w-7 h-7 text-[var(--accent-color)] transition-transform duration-200 group-hover:scale-110" />
                                    <span>Join Discord</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-700/30">
                    <button
                        onClick={handleSignOut}
                        className="group w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-[0.98] transition-all duration-200 font-semibold text-lg"
                    >
                        <img src={LogoutIMG} alt="" className="w-6 h-6 object-contain transition-transform duration-200 group-hover:scale-110" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;