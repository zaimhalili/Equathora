import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const srcDirectory = fileURLToPath(new URL('../', import.meta.url));
const projectDirectory = fileURLToPath(new URL('../../', import.meta.url));

const collectPublicSourceFiles = (directory) => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
        const entryPath = join(directory, entry.name);

        if (entry.isDirectory()) {
            if (entryPath.endsWith(join('pages', 'Premium')) || entryPath.endsWith(join('components', 'Admin'))) {
                return [];
            }

            return collectPublicSourceFiles(entryPath);
        }

        if (!['.js', '.jsx'].includes(extname(entry.name)) || entry.name.endsWith('.test.js')) {
            return [];
        }

        return [entryPath];
    });

test('public copy does not promise permanent free access or token gating', () => {
    const publicCopy = collectPublicSourceFiles(srcDirectory)
        .map((filePath) => readFileSync(filePath, 'utf8'))
        .join('\n');

    const unsupportedClaims = [
        /free forever/i,
        /always free/i,
        /will remain free/i,
        /token-based system/i,
        /sign up for free/i,
    ];

    for (const claim of unsupportedClaims) {
        assert.doesNotMatch(publicCopy, claim);
    }
});

test('public access surfaces use the verified free-to-start position', () => {
    const accessSurfacePaths = [
        'src/components/About/sections/AboutCtaSection.jsx',
        'src/components/ApplyMentor/Hero.jsx',
        'src/components/Landing/CTASection.jsx',
        'src/pages/ApplyMentor.jsx',
        'src/pages/ForgotPassword.jsx',
        'src/pages/Login.jsx',
        'src/pages/Resend.jsx',
        'src/data/blogPosts.js',
    ];

    for (const relativePath of accessSurfacePaths) {
        const source = readFileSync(join(projectDirectory, relativePath), 'utf8');
        assert.match(source, /free to start/i, `${relativePath} must use the verified access wording`);
    }
});

test('disabled pricing routes are not advertised to visitors or search engines', () => {
    const appSource = readFileSync(join(projectDirectory, 'src/App.jsx'), 'utf8');
    const robotsSource = readFileSync(join(projectDirectory, 'public/robots.txt'), 'utf8');

    assert.doesNotMatch(appSource, /path=["']\/premium["']/i);
    assert.doesNotMatch(appSource, /["']\/premium["']\s*:/i);
    assert.doesNotMatch(robotsSource, /^Allow:\s*\/(?:premium|pricing)\s*$/im);
});
