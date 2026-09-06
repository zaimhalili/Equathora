import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { capturePostHogEvent } from '../lib/posthogClient';
import {
    getComparisonPageEvent,
    getComparisonProblemHandoff,
    getProblemLinkFromClick,
    savePendingComparisonHandoff,
    takePendingComparisonHandoff,
} from '../lib/releaseTraffic';

export default function ReleaseTrafficTracker() {
    const location = useLocation();
    const lastComparisonVisit = useRef(null);

    useEffect(() => {
        const visitKey = `${location.key}:${location.pathname}`;
        const pageEvent = getComparisonPageEvent(location.pathname, window.location.origin);

        if (pageEvent && lastComparisonVisit.current !== visitKey) {
            lastComparisonVisit.current = visitKey;
            capturePostHogEvent('comparison_page_viewed', pageEvent);
        }

        const completedHandoff = takePendingComparisonHandoff(
            window.sessionStorage,
            location.pathname,
            window.location.origin
        );

        if (completedHandoff) {
            capturePostHogEvent('comparison_problem_opened', completedHandoff);
        }
    }, [location.key, location.pathname]);

    useEffect(() => {
        const comparisonPage = getComparisonPageEvent(location.pathname, window.location.origin);
        if (!comparisonPage) return undefined;

        const captureProblemSelection = (event) => {
            const problemLink = getProblemLinkFromClick(event);
            const handoff = getComparisonProblemHandoff(
                location.pathname,
                problemLink,
                window.location.origin
            );

            if (!handoff) return;

            savePendingComparisonHandoff(window.sessionStorage, handoff);
            capturePostHogEvent('comparison_problem_selected', handoff);
        };

        document.addEventListener('click', captureProblemSelection);
        return () => document.removeEventListener('click', captureProblemSelection);
    }, [location.pathname]);

    return null;
}
