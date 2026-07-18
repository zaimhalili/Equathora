import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaClock, FaLightbulb } from 'react-icons/fa';
import MathJaxRenderer from '../components/MathJaxRenderer';
import Symbol from '../assets/logo/TransparentSymbol.png';
import { useAuth } from '../hooks/useAuth';
import {
    getWeeklyChallenge,
    getWeeklyChallengeByKey,
    getWeeklyChallengeProblemPath,
} from '../data/weeklyChallenge';
import {
    getWeeklyChallengeCompletion,
} from '../lib/weeklyChallengeProgress';
import './WeeklyChallenge.css';

const WeeklyChallenge = () => {
    const { isAuth } = useAuth();
    const [searchParams] = useSearchParams();
    const challenge = useMemo(() => {
        const requestedWeek = searchParams.get('week');
        return (requestedWeek && getWeeklyChallengeByKey(requestedWeek)) || getWeeklyChallenge();
    }, [searchParams]);
    const [completion, setCompletion] = useState(
        () => getWeeklyChallengeCompletion(challenge.weekKey)
    );

    useEffect(() => {
        setCompletion(getWeeklyChallengeCompletion(challenge.weekKey));
    }, [challenge, searchParams]);

    const isComplete = Boolean(completion);
    const challengePath = getWeeklyChallengeProblemPath(challenge);
    const authDestination = { from: challengePath };

    return (
        <main className="weekly-challenge-shell">
            <header className="weekly-challenge-header">
                <Link to="/" className="weekly-challenge-brand" aria-label="Equathora home">
                    <img src={Symbol} alt="" aria-hidden="true" />
                    <span>Equathora</span>
                </Link>
                <Link to={isAuth ? '/learn' : '/login'} className="weekly-challenge-header-link">
                    {isAuth ? 'Browse practice' : 'Sign in'}
                </Link>
            </header>

            <section className="weekly-challenge-hero" aria-labelledby="weekly-challenge-title">
                <div className="weekly-challenge-copy">
                    <p className="weekly-challenge-eyebrow">
                        {challenge.weekLabel} · {challenge.subject} · {challenge.dateRangeLabel}
                    </p>
                    {isComplete ? (
                        <div className="weekly-challenge-complete-mark" aria-hidden="true"><FaCheck /></div>
                    ) : null}
                    <h1 id="weekly-challenge-title">
                        {isComplete ? 'Weekly challenge complete' : 'One problem. One focused session.'}
                    </h1>
                    <p className="weekly-challenge-intro">
                        {isComplete
                            ? `You finished ${challenge.weekLabel}. Revisit the solution or try it again whenever you want.`
                            : 'Work through a beginner algebra problem with hints when you need them and immediate feedback when you submit.'}
                    </p>

                    {isAuth ? (
                        <Link to={challengePath} className="weekly-challenge-primary">
                            {isComplete ? 'Review the challenge' : 'Start the challenge'}
                            <FaArrowRight aria-hidden="true" />
                        </Link>
                    ) : (
                        <Link to="/login" state={authDestination} className="weekly-challenge-primary">
                            {isComplete ? 'Sign in to review' : 'Sign in to start'}
                            <FaArrowRight aria-hidden="true" />
                        </Link>
                    )}

                    {!isAuth ? (
                        <p className="weekly-challenge-account-note">
                            New to Equathora?{' '}
                            <Link to="/signup" state={authDestination}>Create a free account</Link>
                        </p>
                    ) : null}
                </div>

                <div className="weekly-challenge-problem-card" aria-label="Weekly challenge preview">
                    <div className="weekly-challenge-card-topline">
                        <span>{challenge.topic}</span>
                        <span>{challenge.difficulty}</span>
                    </div>
                    <div className="weekly-challenge-math">
                        <p>{challenge.previewLead}</p>
                        <MathJaxRenderer content={challenge.previewExpression} />
                    </div>
                    <div className="weekly-challenge-card-details">
                        <div><FaClock aria-hidden="true" /><span>About {challenge.estimatedMinutes} minutes</span></div>
                        <div><FaLightbulb aria-hidden="true" /><span>Two hints available</span></div>
                    </div>
                </div>
            </section>

            <section className="weekly-challenge-steps" aria-label="How the challenge works">
                <p><span>1</span> Read the problem</p>
                <p><span>2</span> Build your answer step by step</p>
                <p><span>3</span> Submit for immediate feedback</p>
            </section>
        </main>
    );
};

export default WeeklyChallenge;
