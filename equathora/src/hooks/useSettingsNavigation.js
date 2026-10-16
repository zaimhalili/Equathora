import { useState } from 'react';

export function useSettingsNavigation(initialSection = 'account') {
    const [activeSection, setActiveSection] = useState(initialSection);

    return {
        activeSection,
        selectSection: setActiveSection,
    };
}
