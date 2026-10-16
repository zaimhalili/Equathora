import {
    FaBell,
    FaBookOpen,
    FaDesktop,
    FaPalette,
    FaShieldAlt,
    FaUser,
    FaUserLock,
    FaWallet,
} from 'react-icons/fa';

export const SETTINGS_SECTIONS = [
    { id: 'account', label: 'Account', icon: FaUser },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'learning', label: 'Learning', icon: FaBookOpen },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'subscription', label: 'Subscription', icon: FaWallet },
    { id: 'privacy', label: 'Privacy', icon: FaShieldAlt },
    { id: 'security', label: 'Security', icon: FaUserLock },
    { id: 'sessions', label: 'Sessions', icon: FaDesktop },
];

export const THEME_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];
