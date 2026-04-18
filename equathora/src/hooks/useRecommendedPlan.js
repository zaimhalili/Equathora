import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    loadRecommendedPlan,
    saveReflectionNote,
} from '../lib/recommendedPlanService';
import {
    applyProgressStateTransition,
    buildQuickSessionPlan,
    buildTodayAction,
} from '../utils/recommendationEngine';

const getAvailableSlotsForBand = (learnerBand) => {
    if (learnerBand === 'weak') return 3;
    if (learnerBand === 'strong') return 5;
    return 4;
};

export function useRecommendedPlan() {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [plan, setPlan] = useState(null);
    const [pathNodes, setPathNodes] = useState([]);
    const [weeklyProgress, setWeeklyProgress] = useState([]);
    const [hasSession, setHasSession] = useState(false);

    const [sessionMinutes, setSessionMinutes] = useState(30);
    const [reflectionDraft, setReflectionDraft] = useState('');
    const [reflectionSaving, setReflectionSaving] = useState(false);
    const [reflectionError, setReflectionError] = useState('');
    const [reflectionNotes, setReflectionNotes] = useState([]);

    const routeQuestionnaire = location.state?.questionnaire
        || location.state?.preferences
        || location.state?.onboardingAnswers
        || null;

    const refresh = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const result = await loadRecommendedPlan({ routeQuestionnaire });
            setPlan(result.plan);
            setPathNodes(result.plan?.pathNodes || []);
            setWeeklyProgress(result.weeklyProgress || []);
            setReflectionNotes(result.reflections || []);
            setHasSession(Boolean(result.hasSession));
        } catch (loadError) {
            console.error('Failed to load recommended plan:', loadError);
            setError('Could not load your recommendation plan right now. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [routeQuestionnaire]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const activePathNodes = useMemo(() => {
        if (pathNodes.length > 0) {
            return pathNodes;
        }

        return plan?.pathNodes || [];
    }, [pathNodes, plan?.pathNodes]);

    const activeTodayAction = useMemo(() => {
        if (!plan) return null;

        return buildTodayAction({
            pathNodes: activePathNodes,
            dailyMinutes: plan.dailyMinutes,
        });
    }, [activePathNodes, plan]);

    const activeQuickSession = useMemo(() => {
        return buildQuickSessionPlan({
            pathNodes: activePathNodes,
            minutes: sessionMinutes,
        });
    }, [activePathNodes, sessionMinutes]);

    const markNodeSolvedPreview = useCallback((problemId) => {
        const availableSlots = getAvailableSlotsForBand(plan?.learnerBand);

        setPathNodes((currentNodes) =>
            applyProgressStateTransition(currentNodes, String(problemId), availableSlots)
        );
    }, [plan?.learnerBand]);

    const submitReflection = useCallback(async (context = {}) => {
        const note = reflectionDraft.trim();
        if (!note) {
            setReflectionError('Please write a short reflection before saving.');
            return false;
        }

        setReflectionSaving(true);
        setReflectionError('');

        try {
            const result = await saveReflectionNote(note, {
                source: 'recommended-page',
                learnerBand: plan?.learnerBand,
                ...context,
            });

            if (!result.success) {
                setReflectionError(result.message || 'Could not save your reflection right now.');
                return false;
            }

            if (Array.isArray(result.notes)) {
                setReflectionNotes(result.notes);
            }

            setReflectionDraft('');
            return true;
        } catch (saveError) {
            console.error('Failed to save reflection note:', saveError);
            setReflectionError('Could not save your reflection right now.');
            return false;
        } finally {
            setReflectionSaving(false);
        }
    }, [plan?.learnerBand, reflectionDraft]);

    return {
        loading,
        error,
        plan,
        weeklyProgress,
        hasSession,
        refresh,

        pathNodes: activePathNodes,
        todayAction: activeTodayAction,
        quickSession: activeQuickSession,
        sessionMinutes,
        setSessionMinutes,
        markNodeSolvedPreview,

        reflectionDraft,
        setReflectionDraft,
        reflectionSaving,
        reflectionError,
        reflectionNotes,
        submitReflection,
    };
}
