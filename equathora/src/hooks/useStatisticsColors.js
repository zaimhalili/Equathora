export const difficultyDisplayRank = {
    beginner: 1,
    easy: 2,
    standard: 3,
    intermediate: 4,
    medium: 5,
    challenging: 6,
    hard: 7,
    advanced: 8,
    expert: 9,
};

export const difficultyPalette = [
    'var(--beginner)',
    'var(--easy)',
    'var(--standard)',
    'var(--intermediate)',
    'var(--medium)',
    'var(--challenging)',
    'var(--hard)',
    'var(--advanced)',
    'var(--advanced)',
];

export function normalizeDifficultyKey(difficulty) {
    return String(difficulty ?? '').trim().toLowerCase();
}

export function formatDifficultyLabel(difficulty) {
    const raw = String(difficulty ?? '').trim();
    if (!raw) return 'Unspecified';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function getDifficultyColor(difficulty, index = 0) {
    const normalizedKey = normalizeDifficultyKey(difficulty);

    const lookup = {
        beginner: 'var(--beginner)',
        easy: 'var(--easy)',
        standard: 'var(--standard)',
        intermediate: 'var(--intermediate)',
        medium: 'var(--medium)',
        challenging: 'var(--challenging)',
        hard: 'var(--hard)',
        advanced: 'var(--advanced)',
        expert: 'var(--advanced)',
    };

    if (lookup[normalizedKey]) {
        return lookup[normalizedKey];
    }

    return difficultyPalette[index % difficultyPalette.length];
}

export function withAlpha(color, alpha) {
    const normalized = String(color ?? '').trim();
    if (!normalized) {
        return `rgba(255, 255, 255, ${alpha})`;
    }

    if (normalized.startsWith('var(')) {
        return `color-mix(in srgb, ${normalized} ${Math.round(alpha * 100)}%, transparent)`;
    }

    if (normalized.startsWith('#') && normalized.length === 7) {
        const hex = normalized.slice(1);
        const r = Number.parseInt(hex.slice(0, 2), 16);
        const g = Number.parseInt(hex.slice(2, 4), 16);
        const b = Number.parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return `color-mix(in srgb, ${normalized} ${Math.round(alpha * 100)}%, transparent)`;
}
