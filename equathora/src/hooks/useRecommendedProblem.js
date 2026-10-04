import { useState, useEffect } from 'react';
import { getNextRecommendedProblem } from '@/lib/Dashboard/nextRecommendedProblem';

export const useRecommendedProblem = (premium, isLoading) => {
    const [nextProblem, setNextProblem] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        let isCancelled = false; // Fixed: Must be initialized to false
        setIsFetching(true);

        async function loadProblem() {
            if (isLoading) return;

            try {
                const problem = await getNextRecommendedProblem(premium);
                if (!isCancelled) {
                    setNextProblem(problem || null);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Failed to load recommended problem", err);
                    setNextProblem(null);
                }
            } finally {
                if (!isCancelled) {
                    setIsFetching(false);
                }
            }
        }

        loadProblem();

        return () => {
            isCancelled = true;
        };
    }, [premium, isLoading]);

    const targetPath = nextProblem?.slug
        ? `/problems/${nextProblem.slug}`
        : "/journey";

    return { nextProblem, targetPath, isFetching };
};