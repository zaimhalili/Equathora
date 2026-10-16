import { createElement, useState } from 'react';
import { SETTINGS_SECTIONS } from './settingsSections';

const SettingsSidebar = ({ activeSection, onSectionChange }) => {
    const [search, setSearch] = useState('');
    const filteredSections = SETTINGS_SECTIONS.filter(({ label }) =>
        label.toLowerCase().includes(search.trim().toLowerCase())
    );

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
            <h1 className="pb-4 px-1 text-2xl font-medium text-(--secondary-color)">Settings</h1>
            <label className=" flex items-center gap-2 rounded-xl bg-[#f5f5f5] px-3 py-2 text-sm text-(--secondary-color)/55 focus-within:ring-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="10.8" cy="10.8" r="6.3" />
                    <path d="m15.5 15.5 4.2 4.2" strokeLinecap="round" />
                </svg>
                <input
                    type="search"
                    // aria-label="Search settings"
                    placeholder="Search settings"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="min-w-0 w-full bg-transparent text-sm text-(--secondary-color) outline-none placeholder:text-(--secondary-color) focus:outline-none"
                />
            </label>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                {filteredSections.map(renderSectionButton)}
                {filteredSections.length === 0 && (
                    <p className="px-3 py-2 text-xs text-(--secondary-color)/60">No matching settings.</p>
                )}
            </div>
        </nav>
    );
};

export default SettingsSidebar;
