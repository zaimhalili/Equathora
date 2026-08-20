import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const comparisonPaths = [
    '/khan-academy-alternative',
    '/ixl-alternative',
    '/brilliant-alternative',
];

const readProjectFile = (relativePath) => readFileSync(
    fileURLToPath(new URL(relativePath, import.meta.url)),
    'utf8',
);

test('the Learn catalog links to every comparison page once', () => {
    const learnSource = readProjectFile('../pages/Learn.jsx');

    for (const path of comparisonPaths) {
        assert.equal(learnSource.split(`to="${path}"`).length - 1, 1);
    }
});

test('the homepage offers one restrained route into comparison content', () => {
    const exercisesSource = readProjectFile('../components/Landing/ExercisesSection.jsx');
    const comparisonLinkCount = comparisonPaths.reduce(
        (count, path) => count + exercisesSource.split(`to="${path}"`).length - 1,
        0,
    );

    assert.equal(comparisonLinkCount, 1);
});

test('the sitemap lists each canonical comparison address once', () => {
    const sitemap = readProjectFile('../../public/sitemap.xml');

    for (const path of comparisonPaths) {
        const canonicalAddress = `<loc>https://equathora.com${path}</loc>`;
        assert.equal(sitemap.split(canonicalAddress).length - 1, 1);
    }
});
