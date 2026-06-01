const getDifficultyColor = (difficultyKey, index) => {
  if (difficultyKey === 'easy') return '#16a34a';
  if (difficultyKey === 'medium') return '#d97706';
  if (difficultyKey === 'hard') return '#a3142c';
  return difficultyPalette[index % difficultyPalette.length];
};

const formatDifficultyLabel = (difficulty) => {
  const raw = String(difficulty || '').trim();
  if (!raw) return 'Unspecified';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const hexToRgba = (hex, alpha) => {
  const safeHex = String(hex || '').replace('#', '');
  if (!/^[a-fA-F0-9]{6}$/.test(safeHex)) return `rgba(255,255,255,${alpha})`;
  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const difficultyPalette = ['#2563eb', '#7c3aed', '#0f766e', '#be123c', '#0ea5e9', '#f97316', '#6366f1'];

const normalizeDifficultyKey = (difficulty) => String(difficulty || '').trim().toLowerCase();

const difficultyDisplayRank = {
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

const normalizeCompletedProblemId = (rawValue) => {
  if (rawValue === null || rawValue === undefined) return '';

  if (typeof rawValue === 'string' && rawValue.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawValue);
      return String(parsed?.problemId ?? parsed?.id ?? '').trim();
    } catch {
      return '';
    }
  }

  return String(rawValue).trim();
};

export { getDifficultyColor, formatDifficultyLabel, hexToRgba, normalizeDifficultyKey, difficultyDisplayRank, normalizeCompletedProblemId };