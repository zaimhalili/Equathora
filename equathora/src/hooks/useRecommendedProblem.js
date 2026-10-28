import { useState, useEffect } from 'react';
import { getNextRecommendedProblem } from '@/lib/Dashboard/nextRecommendedProblem';

const inFlightRecommendations = new Map();

function loadRecommendedProblem(premium) {
    const key = Boolean(premium);
    if (!inFlightRecommendations.has(key)) {
        const request = getNextRecommendedProblem(key).finally(() => {
            inFlightRecommendations.delete(key);
        });
        inFlightRecommendations.set(key, request);
    }
    return inFlightRecommendations.get(key);
}

export const useRecommendedProblem = (premium, isLoading) => {
    const [result, setResult] = useState(null);
    const requestKey = `${Boolean(premium)}:${Boolean(isLoading)}`;

    useEffect(() => {
        let isCancelled = false;
        if (isLoading) return () => {
            isCancelled = true;
        };

        async function loadProblem() {
            try {
                const problem = await loadRecommendedProblem(premium);
                if (!isCancelled) {
                    setResult({ key: requestKey, problem: problem || null });
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Failed to load recommended problem", err);
                    setResult({ key: requestKey, problem: null });
                }
            }
        }

        loadProblem();

        return () => {
            isCancelled = true;
        };
    }, [premium, isLoading, requestKey]);

    const isFetching = isLoading || result?.key !== requestKey;
    const nextProblem = isFetching ? null : result.problem;
    const targetPath = nextProblem?.slug ? `/problems/${nextProblem.slug}` : null;

    return { nextProblem, targetPath, isFetching };
};