import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(true);
    const timer = useRef();

    const format = (time) => {
        let hours = Math.floor(time / 3600 % 24);
        let minutes = Math.floor(time / 60 % 60);
        let seconds = Math.floor(time % 60);

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
    };

    useEffect(() => {
        if (running) {
            timer.current = setInterval(() => {
                setTime(prev => prev + 1);  
            }, 1000);
        }
        return () => clearInterval(timer.current);
    }, [running]);

    return (
        <div className='stopwatch'>
            <p className="timer">{format(time)}</p>
            <div className="actions">
                <button onClick={() => setTime(0)}>Restart</button>
                <button onClick={() => {
                    if (running) clearInterval(timer.current);
                    setRunning(!running);
                }}>
                    {running ? 'Stop' : 'Resume'}
                </button>
            </div>
        </div>
    );
};

export default Timer;
