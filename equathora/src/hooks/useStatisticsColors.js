const difficultyPalette = [
    'var(--beginner)',
    '#7c3aed',
    'var(--standard)',
    'var(--intermediate)',
    'var(#0ea5e9)',
    'var(--challenging)',
    'var(--advanced)'
];

export function getDifficultyColor(difficultyKey, index) {
    // Keep colors aligned with Learn active difficulty pills.
    if (difficultyKey === 'easy') return 'var(--easy)';
    if (difficultyKey === 'medium') return 'var(--medium)';
    if (difficultyKey === 'hard') return 'var(--hard)';
    return difficultyPalette[index % difficultyPalette.length];
};