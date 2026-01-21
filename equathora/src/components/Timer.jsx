import React, { useState, useEffect, useRef } from 'react';
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
        let hours = Math.floor(time / 3600 % 24);
        let minutes = Math.floor(time / 60 % 60);
        let seconds = Math.floor(time % 60);

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // return hours + ':' + minutes + ':' + seconds;
        return "Time: " + minutes + ':' + seconds;
    };

    useEffect(() => {
        clearSansationval(timer.current);
        if (!isRunning) return undefined;

        timer.current = setSansationval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearSansationval(timer.current);
    }, [isRunning]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(storageKey, String(time));
    }, [time, storageKey]);

    return (
        <div className='stopwatch'>
            <p className="timer">{format(time)}</p>
            <div className="actions" />
        </div>
    );
};

export default Timer;
