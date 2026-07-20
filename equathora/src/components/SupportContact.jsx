import React from 'react';
import './SupportContact.css';

export const SUPPORT_EMAIL = 'equathora@mail.tin.computer';

const SupportContact = ({ variant = 'auth' }) => (
    <p className={`support-contact support-contact--${variant}`}>
        Need help? Email{' '}
        <a
            href={`mailto:${SUPPORT_EMAIL}`}
            aria-label={`Email Equathora support at ${SUPPORT_EMAIL}`}
        >
            {SUPPORT_EMAIL}
        </a>
    </p>
);

export default SupportContact;
