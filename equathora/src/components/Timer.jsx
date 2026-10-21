import React, { useState, useEffect, useRef } from 'react';
import { FaClock } from 'react-icons/fa';
import './Timer.css';

const getStoredTime = (storageKey) => {
    if (typeof window === 'undefined') return 0;
    const raw = window.localStorage.getItem(storageKey);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const Timer = ({ problemId, isRunning = true }) => {
    const storageKey = problemId ? `eq:problemTime:${problemId}` : 'eq:problemTime:global';
    const [time, setTime] = useState(() => getStoredTime(storageKey));
    const timer = useRef();

    const format = (time) => {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = Math.floor(time % 60);

        const pad = (n) => n < 10 ? '0' + n : n;

        if (hours > 0) {
            return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
        }
        return pad(minutes) + ':' + pad(seconds);
    };

    useEffect(() => {
        clearInterval(timer.current);
        if (!isRunning) return undefined;

        timer.current = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer.current);
    }, [isRunning]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(storageKey, String(time));
    }, [time, storageKey]);

    return (
        <div className="stopwatch" aria-label={`Time spent: ${format(time)}`}>
            <FaClock className="stopwatch-icon" aria-hidden="true" />
            <p className="timer">{format(time)}</p>
        </div>
    );
};

export default Timer;
