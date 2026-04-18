import React, { useEffect, useState } from 'react';

const LOADER_AVG_KEY = 'equathora:loader:avg-duration-ms';
const DEFAULT_EXPECTED_MS = 1200;
const MIN_EXPECTED_MS = 350;
const MAX_EXPECTED_MS = 2600;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const readExpectedDuration = () => {
    if (typeof window === 'undefined') return DEFAULT_EXPECTED_MS;
    const parsed = Number(window.localStorage.getItem(LOADER_AVG_KEY));
    return Number.isFinite(parsed) && parsed > 0
        ? clamp(parsed, MIN_EXPECTED_MS, MAX_EXPECTED_MS)
        : DEFAULT_EXPECTED_MS;
};

const writeExpectedDuration = (ms) => {
    if (typeof window !== 'undefined')
        window.localStorage.setItem(LOADER_AVG_KEY, String(Math.round(ms)));
};

// ── Real loading signals ────────────────────────────────────────────────────

// Maps readyState to a progress floor
const READY_STATE_FLOORS = { loading: 0.05, interactive: 0.65, complete: 0.90 };

// Scans performance entries to estimate what fraction of resources are done
const measureResourceProgress = () => {
    if (typeof performance === 'undefined') return 0;
    const entries = performance.getEntriesByType('resource');
    if (!entries.length) return 0;
    const done = entries.filter(e => e.responseEnd > 0).length;
    return done / entries.length;
};

// ── Time-based fallback (your original curve, kept as a floor) ───────────────
const timeBasedProgress = (elapsedMs, expectedMs) => {
    const r = elapsedMs / expectedMs;
    return clamp(
        84 * (1 - Math.exp(-4.4 * r)) +
        14 * (1 - Math.exp(-1.35 * Math.max(0, r - 0.62))),
        0, 99
    );
};

// ── Component ────────────────────────────────────────────────────────────────

const LoadingSpinner = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const expectedDuration = readExpectedDuration();
        const startTime = performance.now();
        let frameId;
        let finished = false;

        // -- Snap to 100% and clean up --
        const finish = () => {
            if (finished) return;
            finished = true;
            cancelAnimationFrame(frameId);
            setProgress(100);

            const actualDuration = performance.now() - startTime;
            writeExpectedDuration(
                clamp(
                    expectedDuration * 0.65 + actualDuration * 0.35,
                    MIN_EXPECTED_MS,
                    MAX_EXPECTED_MS
                )
            );
        };

        // -- Wire up real browser loading events --

        // 1. readyState: gives us a floor that jumps at real milestones
        const onReadyStateChange = () => {
            if (document.readyState === 'complete') finish();
        };
        document.addEventListener('readystatechange', onReadyStateChange);

        // If the document is already loaded by the time this mounts:
        if (document.readyState === 'complete') {
            finish();
            return () => document.removeEventListener('readystatechange', onReadyStateChange);
        }

        // 2. window.load: the definitive "everything is done" event
        window.addEventListener('load', finish, { once: true });

        // 3. PerformanceObserver: watches individual resources finishing in real time
        let resourceRatio = measureResourceProgress(); // snapshot existing entries
        let observer;
        try {
            observer = new PerformanceObserver((list) => {
                const entries = performance.getEntriesByType('resource');
                const done = entries.filter(e => e.responseEnd > 0).length;
                resourceRatio = entries.length ? done / entries.length : resourceRatio;
            });
            observer.observe({ type: 'resource', buffered: true });
        } catch (_) { /* Safari/older browsers — fall back to time-based */ }

        // -- rAF loop: combines all signals into one smooth number --
        const tick = () => {
            const elapsed = performance.now() - startTime;

            // Real signals
            const readyFloor = READY_STATE_FLOORS[document.readyState] ?? 0.05;
            const resourceFloor = resourceRatio; // 0→1

            // Convert to 0–99 scale and take the highest signal
            const realProgress = Math.max(readyFloor * 100, resourceFloor * 98);

            // Time-based curve acts as a floor so it never looks stuck
            const timeFallback = timeBasedProgress(elapsed, expectedDuration);

            setProgress(clamp(Math.max(realProgress, timeFallback), 0, 99));
            frameId = requestAnimationFrame(tick);
        };

        setProgress(5);
        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
            document.removeEventListener('readystatechange', onReadyStateChange);
            window.removeEventListener('load', finish);
            observer?.disconnect();

            if (!finished) {
                const actualDuration = performance.now() - startTime;
                writeExpectedDuration(
                    clamp(
                        expectedDuration * 0.65 + actualDuration * 0.35,
                        MIN_EXPECTED_MS,
                        MAX_EXPECTED_MS
                    )
                );
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-[var(--main-color)] flex items-center justify-center px-6">
            <div className="w-full max-w-xl">
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-[rgba(163,20,44,0.12)]">
                    <div
                        className="h-full rounded-full bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))]"
                        style={{
                            width: `${progress}%`,
                            // Only animate below 100% — let the snap to 100% feel instant-ish
                            transition: progress < 100 ? 'width 0.3s ease-out' : 'width 0.4s ease-out',
                        }}
                    />
                </div>
                <p className="pt-5 text-center text-base font-bold text-[var(--secondary-color)]">
                    Preparing your workspace...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;