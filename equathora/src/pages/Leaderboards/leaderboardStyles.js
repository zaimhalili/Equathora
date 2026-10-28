export const leaderboardPanelClass = 'relative flex min-h-[70vh] w-full max-w-[1080px] flex-col gap-5 rounded-2xl border border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--main-color)_94%,transparent)] p-4 text-(--secondary-color) shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-6 lg:p-8';

export const leaderboardTitleClass = 'm-0 text-2xl font-bold text-(--secondary-color) sm:text-3xl';
export const leaderboardSubtitleClass = 'm-0 text-sm text-(--secondary-color) opacity-70';

export const leaderboardFilterClass = 'flex min-h-[42px] items-center gap-2 rounded-[10px] border border-[color-mix(in_srgb,var(--secondary-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_4%,var(--main-color))] px-3 py-2 focus-within:border-[color-mix(in_srgb,var(--accent-color)_65%,var(--secondary-color))] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-color)_12%,transparent)]';
export const leaderboardFilterInputClass = 'min-w-0 flex-1 border-0 bg-transparent text-sm text-(--secondary-color) outline-none placeholder:opacity-60';
export const leaderboardFilterSelectClass = 'max-w-full border-0 bg-transparent text-sm text-(--secondary-color) outline-none [&>option]:bg-(--main-color) [&>option]:text-(--secondary-color)';
export const leaderboardFilterIconClass = 'shrink-0 text-xs text-(--secondary-color) opacity-65';

export const leaderboardListClass = 'flex max-h-[min(600px,58vh)] flex-col overflow-y-auto rounded-xl border border-[color-mix(in_srgb,var(--secondary-color)_13%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_2%,var(--main-color))] pb-[5.5rem]';
export const leaderboardRowClass = 'relative flex items-center gap-3 border-b border-[color-mix(in_srgb,var(--secondary-color)_10%,transparent)] px-4 py-3.5 text-(--secondary-color) no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--secondary-color)_5%,var(--main-color))] last:border-b-0 max-[680px]:gap-2 max-[680px]:px-2.5 max-[680px]:py-3';
export const leaderboardAvatarWrapClass = 'h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--secondary-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--secondary-color)_5%,var(--main-color))] max-[680px]:h-[38px] max-[680px]:w-[38px]';
export const leaderboardAvatarClass = 'block h-full w-full object-cover';
export const leaderboardPlayerInfoClass = 'flex min-w-0 flex-1 flex-col gap-1';
export const leaderboardPlayerNameClass = 'flex min-w-0 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-(--secondary-color)';
export const leaderboardPlayerStatsClass = 'flex flex-wrap gap-3 text-xs text-(--secondary-color) opacity-75 max-[680px]:gap-2 max-[680px]:text-[0.7rem]';
export const leaderboardStatClass = 'inline-flex items-center gap-1';
export const leaderboardXpClass = 'flex min-w-[82px] flex-col items-end gap-px text-(--secondary-color) max-[680px]:min-w-14';
export const leaderboardXpValueClass = 'text-base font-bold max-[680px]:text-sm';
export const leaderboardXpLabelClass = 'text-[0.7rem] uppercase tracking-wide opacity-70 max-[680px]:text-[0.6rem]';
export const leaderboardYouBadgeClass = 'inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--accent-color)_13%,var(--main-color))] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-(--secondary-color)';
export const leaderboardEmptyClass = 'p-10 text-center text-(--secondary-color) opacity-70';

export const getRankToneClass = (rank) => {
    if (rank === 1) return 'bg-[color-mix(in_srgb,#d6a936_10%,var(--main-color))]';
    if (rank === 2) return 'bg-[color-mix(in_srgb,#98a4b3_11%,var(--main-color))]';
    if (rank === 3) return 'bg-[color-mix(in_srgb,#b77a4c_10%,var(--main-color))]';
    return '';
};

export const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'bg-[color-mix(in_srgb,#d6a936_20%,var(--main-color))] text-[#a77a12]';
    if (rank === 2) return 'bg-[color-mix(in_srgb,#98a4b3_24%,var(--main-color))] text-[#6c7784]';
    if (rank === 3) return 'bg-[color-mix(in_srgb,#b77a4c_20%,var(--main-color))] text-[#985c30]';
    return '';
};
