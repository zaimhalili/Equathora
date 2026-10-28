import { createElement, useState } from 'react';
import { SETTINGS_SECTIONS } from './settingsSections';
import { FaSearch } from 'react-icons/fa';

const SETTINGS_SEARCH_ITEMS = [
    { sectionId: 'account', label: 'Profile', targetId: 'profile-settings', keywords: 'profile account details' },
    { sectionId: 'account', label: 'Profile picture', targetId: 'profile-picture', keywords: 'avatar photo image' },
    { sectionId: 'account', label: 'Profile name', targetId: 'profile-name', keywords: 'edit name username' },
    { sectionId: 'account', label: 'Subscription', targetId: 'account-subscription', keywords: 'plan premium billing' },
    { sectionId: 'account', label: 'Account actions', targetId: 'account-actions', keywords: 'log out logout' },
    { sectionId: 'appearance', label: 'Light theme', targetId: 'theme-light', keywords: 'appearance display' },
    { sectionId: 'appearance', label: 'Dark theme', targetId: 'theme-dark', keywords: 'appearance display' },
    { sectionId: 'appearance', label: 'System theme', targetId: 'theme-system', keywords: 'appearance device preference' },
    { sectionId: 'learning', label: 'Learning preferences', targetId: 'learning', keywords: 'goals level onboarding' },
    { sectionId: 'learning', label: 'Skill assessment', targetId: 'skill-assessment', keywords: 'retake quiz diagnostic' },
    { sectionId: 'privacy', label: 'Public profile', targetId: 'privacy-public-profile', keywords: 'visibility' },
    { sectionId: 'privacy', label: 'Show streak', targetId: 'privacy-show-streak', keywords: 'visibility' },
    { sectionId: 'privacy', label: 'Show leaderboard rank', targetId: 'privacy-leaderboard-rank', keywords: 'visibility leaderboard' },
    { sectionId: 'privacy', label: 'Show achievements', targetId: 'privacy-show-achievements', keywords: 'visibility badges' },
    { sectionId: 'privacy', label: 'Cookie preferences', targetId: 'cookie-preference', keywords: 'cookies analytics personalization data' },
    { sectionId: 'security', label: 'Current email', targetId: 'current-email', keywords: 'account security' },
    { sectionId: 'security', label: 'Change email', targetId: 'change-email', keywords: 'account security address' },
    { sectionId: 'security', label: 'Change password', targetId: 'change-password', keywords: 'account security' },
    { sectionId: 'security', label: 'Show passwords', targetId: 'show-passwords', keywords: 'account security visibility' },
    { sectionId: 'subscription', label: 'Manage subscription', targetId: 'subscription', keywords: 'plan premium billing' },
    { sectionId: 'subscription', label: 'Contact support', targetId: 'subscription-support', keywords: 'email help' },
    { sectionId: 'sessions', label: 'Current session', targetId: 'current-session', keywords: 'active sessions device' },
    { sectionId: 'sessions', label: 'Sign out of all sessions', targetId: 'sign-out-sessions', keywords: 'active sessions security' },
    { sectionId: 'sessions', label: 'Security tips', targetId: 'security-tips', keywords: 'password safety' },
];

const SETTINGS_COMPONENT_LABELS = {
    account: 'Account overview',
    appearance: 'Appearance settings',
    learning: 'Learning preferences',
    privacy: 'Privacy controls',
    security: 'Account & security',
    subscription: 'Subscription settings',
    sessions: 'Active sessions',
};

const SettingsSidebar = ({ activeSection, onSectionChange, onSettingSelect }) => {
    const [search, setSearch] = useState('');
    const query = search.trim().toLowerCase();
    const searchTokens = query.split(/\s+/).filter(Boolean);
    const matchingItems = SETTINGS_SEARCH_ITEMS.filter((item) => {
        const section = SETTINGS_SECTIONS.find(({ id }) => id === item.sectionId);
        const searchableText = `${section?.label || ''} ${item.label} ${item.keywords}`.toLowerCase();
        return query && searchTokens.every((token) => searchableText.includes(token));
    });
    const groupedItems = SETTINGS_SECTIONS
        .map((section) => ({
            ...section,
            items: matchingItems.filter((item) => item.sectionId === section.id),
        }))
        .filter(({ items }) => items.length > 0);

    const renderSectionButton = ({ id, label, icon }) => {
        const isActive = activeSection === id;

        return (
            <button
                key={id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSectionChange(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm font-medium transition-colors ${
                    isActive
                        ? 'bg-(--main-color) text-(--secondary-color)'
                        : 'text-(--secondary-color)/70 hover:bg-(--main-color) hover:text-(--secondary-color)'
                }`}
            >
                {createElement(icon, { 'aria-hidden': true, className: 'text-sm shrink-0' })}
                {label}
            </button>
        );
    };

    return (
        <nav aria-label="Settings sections" className="w-full shrink-0 lg:sticky lg:top-24 lg:w-44">
            <h1 className="pb-4 px-1 text-3xl text-(--secondary-color)">Settings</h1>
            <label className="flex items-center gap-2 rounded-xl bg-(--main-color) px-3 py-2 text-sm text-(--secondary-color)/70! focus-within:ring-2 focus-within:ring-(--black) transition-all">
                <FaSearch />
                <input
                    type="search"
                    aria-label="Search settings"
                    placeholder="Search settings"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="min-w-0 w-full bg-transparent text-sm text-(--secondary-color)/70! outline-none placeholder:text-(--secondary-color)/70! focus:outline-none! focus-within:outline-none"
                />
            </label>

            {query ? (
                <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pt-3">
                    {groupedItems.map(({ id, label, icon, items }) => (
                        <section key={id} className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    onSectionChange(id);
                                }}
                                className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm font-medium transition-colors bg-(--main-color) text-(--secondary-color)"
                            >
                                {createElement(icon, { 'aria-hidden': true, className: 'text-sm shrink-0' })}
                                {SETTINGS_COMPONENT_LABELS[id] || label}
                            </button>
                            {items.map((item) => (
                                <a
                                    key={item.targetId}
                                    href={`#${item.targetId}`}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onSettingSelect(item.sectionId, item.targetId);
                                        setSearch('');
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm font-medium! transition-colors text-(--secondary-color)/70! hover:bg-(--main-color) hover:text-(--secondary-color)!"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </section>
                    ))}
                    {groupedItems.length === 0 && (
                        <p className="px-3 py-2 text-xs text-(--secondary-color)/70">No matching settings.</p>
                    )}
                </div>
            ) : (
                <div className="flex gap-1 overflow-x-auto pt-3 lg:flex-col lg:overflow-visible">
                    {SETTINGS_SECTIONS.map(renderSectionButton)}
                </div>
            )}
        </nav>
    );
};

export default SettingsSidebar;
