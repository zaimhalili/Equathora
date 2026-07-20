import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

const supportContactSource = await readSource('./SupportContact.jsx');
const footerSource = await readSource('./Footer.jsx');
const appSource = await readSource('../App.jsx');

const authRoutes = [
    ['/login', 'Login'],
    ['/signup', 'Signup'],
    ['/verify', 'VerifyEmail'],
    ['/resend', 'Resend'],
    ['/forgotpassword', 'ForgotPassword'],
    ['/reset-password', 'ResetPassword'],
];

const authPageSources = await Promise.all(
    authRoutes.map(([, pageName]) => readSource(`../pages/${pageName}.jsx`)),
);

const footerPageNames = [
    'Landing',
    'About',
    'HelpCenter',
    'SystemUpdates',
    'EquathoraBriefs',
    'Blog',
    'BlogList',
    'BlogPost',
    'PrivacyPolicy',
    'TermsOfService',
    'CookiePolicy',
    'Learn',
];

const footerPageSources = await Promise.all(
    footerPageNames.map((pageName) => readSource(`../pages/${pageName}.jsx`)),
);

const publicContactPageNames = ['HelpCenter', 'PrivacyPolicy', 'TermsOfService', 'CookiePolicy'];
const publicContactPageSources = await Promise.all(
    publicContactPageNames.map((pageName) => readSource(`../pages/${pageName}.jsx`)),
);

test('support contact opens a message to the managed mailbox', () => {
    assert.match(supportContactSource, /SUPPORT_EMAIL = 'equathora@mail\.tin\.computer'/);
    assert.match(supportContactSource, /href={`mailto:\${SUPPORT_EMAIL}`}/);
});

test('shared footer includes the quiet support contact', () => {
    assert.match(footerSource, /<SupportContact variant="footer" \/>/);
});

test('every current account-access route includes the shared support contact', () => {
    authRoutes.forEach(([route, pageName], index) => {
        assert.match(
            appSource,
            new RegExp(`<Route path="${route}" element={<${pageName} \\/>}`),
            `${route} is missing from the current public route map`,
        );
        assert.match(authPageSources[index], /<SupportContact \/>/, `${route} is missing support contact`);
    });
});

test('every current shared-footer public page renders the shared footer', () => {
    footerPageSources.forEach((source, index) => {
        assert.match(source, /<Footer\s*\/>/, `${footerPageNames[index]} is missing the shared footer`);
    });
});

test('not-found route includes the shared support contact', async () => {
    const notFoundSource = await readSource('../pages/PageNotFound.jsx');
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
