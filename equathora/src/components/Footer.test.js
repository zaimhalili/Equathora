import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const supportContactSource = await readFile(new URL('./SupportContact.jsx', import.meta.url), 'utf8');
const footerSource = await readFile(new URL('./Footer.jsx', import.meta.url), 'utf8');
const authPageNames = [
    'Login',
    'Signup',
    'VerifyEmail',
    'Resend',
    'ForgotPassword',
    'ResetPassword',
];
const authPageSources = await Promise.all(
    authPageNames.map((pageName) => readFile(new URL(`../pages/${pageName}.jsx`, import.meta.url), 'utf8')),
);
const notFoundSource = await readFile(new URL('../pages/PageNotFound.jsx', import.meta.url), 'utf8');
const publicContactPageNames = ['HelpCenter', 'PrivacyPolicy', 'TermsOfService', 'CookiePolicy'];
const publicContactPageSources = await Promise.all(
    publicContactPageNames.map((pageName) => readFile(new URL(`../pages/${pageName}.jsx`, import.meta.url), 'utf8')),
);

test('support contact points to the managed mailbox', () => {
    assert.match(supportContactSource, /SUPPORT_EMAIL = 'equathora@mail\.tin\.computer'/);
    assert.match(supportContactSource, /href={`mailto:\${SUPPORT_EMAIL}`}/);
});

test('public footer includes the shared support contact', () => {
    assert.match(footerSource, /<SupportContact variant="footer" \/>/);
});

test('focused auth routes include the shared support contact', () => {
    authPageSources.forEach((source, index) => {
        assert.match(source, /<SupportContact \/>/, `${authPageNames[index]} is missing support contact`);
    });
});

test('not-found route includes the shared support contact', () => {
    assert.match(notFoundSource, /<SupportContact variant="dark" \/>/);
});

test('public contact copy uses only the managed mailbox', () => {
    publicContactPageSources.forEach((source, index) => {
        assert.match(
            source,
            /mailto:equathora@mail\.tin\.computer/,
            `${publicContactPageNames[index]} is missing the managed support address`,
        );
        assert.doesNotMatch(
            source,
            /equathora@gmail\.com|support@equathora\.com/,
            `${publicContactPageNames[index]} still references a stale public address`,
        );
    });
});
