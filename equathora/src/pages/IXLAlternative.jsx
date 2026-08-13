import React from 'react';
import AlternativeComparisonPage from './AlternativeComparisonPage';
import { comparisonAlternatives } from '@/data/comparisonAlternatives';

const IXLAlternative = () => (
    <AlternativeComparisonPage page={comparisonAlternatives.ixl} />
);

export default IXLAlternative;
