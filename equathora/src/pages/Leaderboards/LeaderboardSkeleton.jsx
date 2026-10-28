import React from 'react';
import { leaderboardPanelClass } from './leaderboardStyles';

const LeaderboardSkeleton = () => (
    <article className={`${leaderboardPanelClass} animate-pulse motion-reduce:animate-none`} aria-busy="true" aria-label="Loading leaderboard">
        <div className="space-y-3">
            <div className="h-[30px] w-[min(300px,55%)] rounded-full bg-[linear-gradient(100deg,color-mix(in_srgb,var(--secondary-color)_7%,var(--main-color))_25%,color-mix(in_srgb,var(--secondary-color)_14%,var(--main-color))_45%,color-mix(in_srgb,var(--secondary-color)_7%,var(--main-color))_65%)]" />
            <div className="h-[13px] w-[min(420px,78%)] rounded-full bg-[linear-gradient(100deg,color-mix(in_srgb,var(--secondary-color)_7%,var(--main-color))_25%,color-mix(in_srgb,var(--secondary-color)_14%,var(--main-color))_45%,color-mix(in_srgb,var(--secondary-color)_7%,var(--main-color))_65%)]" />
        </div>

        <section className="grid gap-3" aria-hidden="true">
            <div className="h-5 w-[170px] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[1, 2, 3].map((leader) => (
                    <div className="min-h-[145px] overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--secondary-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_3%,var(--main-color))]" key={leader}>
                        <div className="flex min-h-[90px] items-center gap-3 p-4">
                            <span className="h-11 w-11 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
                            <span className="grid min-w-0 flex-1 gap-2">
                                <span className="h-3.5 w-[72%] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
                                <span className="h-[18px] w-[45%] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
                            </span>
                        </div>
                        <div className="grid grid-cols-3 border-t border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)]">
                            {[1, 2, 3].map((stat) => (
                                <span className="h-[42px] bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" key={stat} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="grid gap-3" aria-hidden="true">
            <div className="h-5 w-[170px] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
            <div className="overflow-x-auto rounded-xl border border-[color-mix(in_srgb,var(--secondary-color)_13%,transparent)]">
                <div className="sticky top-0 z-[2] grid min-w-[930px] grid-cols-[64px_minmax(190px,2.2fr)_repeat(5,minmax(88px,1fr))_minmax(100px,1fr)] items-center gap-3 border-b border-[color-mix(in_srgb,var(--secondary-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_4%,var(--main-color))] px-4 py-3 text-xs font-bold text-(--secondary-color) opacity-80">
                    <span>Rank</span>
                    <span>Player</span>
                    <span>Problems solved</span>
                    <span>Time spent</span>
                    <span>Accuracy</span>
                    <span>Streak</span>
                    <span>Reputation</span>
                    <span>Total XP</span>
                </div>
                <div className="flex max-h-[min(600px,58vh)] min-w-[930px] flex-col overflow-auto">
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div className="grid min-h-[68px] grid-cols-[64px_minmax(190px,2.2fr)_repeat(5,minmax(88px,1fr))_minmax(100px,1fr)] items-center gap-3 border-b border-[color-mix(in_srgb,var(--secondary-color)_10%,transparent)] px-4 py-3" key={row}>
                            <span className="mx-auto h-3.5 w-[62%] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
                            <span className="flex min-w-0 items-center gap-2.5 whitespace-nowrap">
                                <i className="h-[38px] w-[38px] shrink-0 rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
                                <i className="h-3.5 w-[110px] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" />
                            </span>
                            {[1, 2, 3, 4, 5, 6].map((cell) => (
                                <span className="mx-auto h-3.5 w-[62%] rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_10%,var(--main-color))]" key={cell} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </article>
);

export default LeaderboardSkeleton;
