import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PrimaryButton from '../components/ui/Buttons/PrimaryButton';
import SecondaryButton from '../components/ui/Buttons/SecondaryButton';
import { submitMentorApplication } from '../lib/mentorApplicationService';

const roleOptions = ['Teacher', 'Tutor', 'School administrator', 'Parent or guardian', 'Learning supporter'];
const subjectOptions = ['General math', 'Algebra', 'Geometry', 'Precalculus', 'Calculus', 'SAT / ACT', 'AP math'];
const platformOptions = ['Khan Academy', 'IXL', 'ALEKS', 'Desmos', 'Quizlet', 'Other'];
const lmsOptions = ['Google Classroom', 'Canvas', 'Schoology', 'Microsoft Teams', 'No LMS', 'Other'];
const featureOptions = [
    'Practice questions',
    'Full-length practice tests',
    'Assigning homework or tests',
    'Student analytics and progress tracking',
    'Reports for students and families',
    'Personalized study plans',
    'Other'
];

const inputClasses = 'w-full rounded-xl border border-(--mid-main-secondary) bg-(--white) px-4 py-3 text-sm text-(--secondary-color) outline-none transition-all placeholder:text-(--mid-main-secondary) focus:border-transparent focus:ring-2 focus:ring-(--accent-color)';

function ChoiceList({ label, options, value, onChange, type = 'checkbox', required = false, name }) {
    const isSelected = (option) => type === 'radio' ? value === option : value.includes(option);

    const handleChange = (option) => {
        if (type === 'radio') {
            onChange(option);
            return;
        }

        onChange(isSelected(option)
            ? value.filter((item) => item !== option)
            : [...value, option]);
    };

    return (
        <fieldset className="flex flex-col items-start gap-2">
            <legend className="text-sm font-semibold text-(--secondary-color)">
                <span className="inline-flex items-baseline gap-1">
                    {label}
                    {required && <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>}
                </span>
            </legend>
            <div className="flex flex-col items-start gap-2">
                {options.map((option, index) => (
                    <label
                        key={option}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-(--accent-color)/30 ${
                            isSelected(option)
                                ? 'border-(--accent-color) bg-(--accent-color)/5 text-(--secondary-color)'
                                : 'border-(--mid-main-secondary) bg-(--white) text-(--secondary-color)/80 hover:border-(--accent-color)/60'
                        }`}
                    >
                        <input
                            type={type}
                            name={name}
                            value={option}
                            checked={isSelected(option)}
                            onChange={() => handleChange(option)}
                            required={required && type === 'radio' && index === 0}
                            className="sr-only"
                        />
                        <span aria-hidden="true" className={`flex h-4 w-4 items-center justify-center border text-[10px] ${type === 'radio' ? 'rounded-full' : 'rounded'} ${isSelected(option) ? 'border-(--accent-color) bg-(--accent-color) text-white' : 'border-(--mid-main-secondary) bg-(--white) text-transparent'}`}>
                            {type === 'radio' ? '•' : '✓'}
                        </span>
                        {option}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

const MentorApplication = () => {
    const { user } = useAuth() || {};
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        role: '',
        subjects: [],
        experience: '',
        platforms: [],
        schoolLms: [],
        interestedFeatures: [],
        additionalNotes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const updateField = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
        setHasUnsavedChanges(true);
    };

    useEffect(() => {
        if (!hasUnsavedChanges || isSubmitted) return undefined;

        const warning = 'Are you sure you want to leave? Your application information will not be saved.';
        const historyKey = window.history.state?.key;
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = warning;
        };
        const handlePopState = (event) => {
            if (event.state?.key === historyKey) return;
            if (window.confirm(warning)) {
                setHasUnsavedChanges(false);
                return;
            }
            window.history.go(1);
        };
        const handleInternalLink = (event) => {
            if (
                event.defaultPrevented
                || event.button !== 0
                || event.metaKey
                || event.ctrlKey
                || event.shiftKey
                || event.altKey
            ) return;

            const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
            if (!target || target.target || target.hasAttribute('download')) return;

            const destination = new URL(target.href, window.location.href);
            if (destination.origin !== window.location.origin) return;
            if (
                destination.pathname === window.location.pathname
                && destination.search === window.location.search
                && destination.hash === window.location.hash
            ) return;

            event.preventDefault();
            event.stopPropagation();
            if (window.confirm(warning)) {
                setHasUnsavedChanges(false);
                navigate(`${destination.pathname}${destination.search}${destination.hash}`);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
        document.addEventListener('click', handleInternalLink, true);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('click', handleInternalLink, true);
        };
    }, [hasUnsavedChanges, isSubmitted, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.subjects.length === 0) {
            setSubjectError('Select at least one subject.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            await submitMentorApplication({
                ...formData,
                userId: user.id
            });
            setHasUnsavedChanges(false);
            setIsSubmitted(true);
        } catch (error) {
            setSubmitError(error.message || 'We could not submit your application right now. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-(--white) text-(--secondary-color)">
            <header><Navbar /></header>
            <main className="flex w-full flex-1 justify-center bg-(--white) px-4 pb-12 pt-8 text-(--secondary-color) sm:px-8 lg:px-16 xl:px-24">
                <div className="flex w-full max-w-[1500px] justify-center">
                    <section className="flex h-fit w-full max-w-3xl flex-col gap-6 rounded-xl border border-(--main-color) bg-(--white) p-5 sm:gap-8 sm:p-8">
                        <div className="flex flex-col gap-3 border-b border-(--main-color) pb-6">
                            <SecondaryButton
                                text={<><FaArrowLeft aria-hidden="true" /> Back to Applymentor</>}
                                link
                                to="/applymentor"
                                className="w-fit rounded-xl px-4 py-2 text-sm"
                            />
                            <h1 className="pt-2 text-2xl font-medium leading-tight text-(--secondary-color) sm:text-3xl">
                                Apply to Equathora
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-(--secondary-color)/70">
                                Tell us a little about your teaching experience and how you would like to help shape Equathora.
                                Required questions are marked with an asterisk.
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div role="status" className="flex flex-col items-start gap-4 rounded-xl border border-(--main-color) bg-(--white) p-5 sm:p-6">
                                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full border border-green-600 text-green-700">
                                    <FaCheck className="text-base" />
                                </span>
                                <h2 className="text-xl font-medium text-(--secondary-color)">Application submitted</h2>
                                <p className="text-sm leading-6 text-(--secondary-color)/70">
                                    Thanks for applying. We’ll review your information and email you if you’re accepted, with the next steps for joining the teacher network.
                                </p>
                                <SecondaryButton
                                    text="Return to educator network"
                                    link
                                    to="/applymentor"
                                    className="w-fit rounded-xl px-4 py-2 text-sm"
                                />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-7 sm:gap-8">
                                <label className="flex flex-col gap-2 text-sm font-semibold text-(--secondary-color)">
                                    <span className="inline-flex items-baseline gap-1">
                                        Full name <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>
                                    </span>
                                    <input
                                        autoComplete="name"
                                        className={inputClasses}
                                        value={formData.fullName}
                                        onChange={(event) => updateField('fullName', event.target.value)}
                                        maxLength={120}
                                        required
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-semibold text-(--secondary-color)">
                                    <span className="inline-flex items-baseline gap-1">
                                        Email address <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>
                                    </span>
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        className={inputClasses}
                                        value={formData.email}
                                        onChange={(event) => updateField('email', event.target.value)}
                                        maxLength={255}
                                        required
                                    />
                                </label>

                                <label className="flex flex-col gap-2 text-sm font-semibold text-(--secondary-color)">
                                    <span className="inline-flex items-baseline gap-1">
                                        Phone number <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>
                                    </span>
                                    <span className="text-xs font-normal text-(--secondary-color)/65">
                                        Used for application follow-up and to help screen spam submissions.
                                    </span>
                                    <input
                                        type="tel"
                                        autoComplete="tel"
                                        className={inputClasses}
                                        value={formData.phone}
                                        onChange={(event) => updateField('phone', event.target.value)}
                                        maxLength={40}
                                        required
                                    />
                                </label>

                                <ChoiceList
                                    label="How do you work with students?"
                                    options={roleOptions}
                                    value={formData.role}
                                    onChange={(value) => updateField('role', value)}
                                    type="radio"
                                    name="role"
                                    required
                                />

                                <ChoiceList
                                    label="Which subjects do you teach or support? Select all that apply."
                                    options={subjectOptions}
                                    value={formData.subjects}
                                    required
                                    onChange={(value) => {
                                        updateField('subjects', value);
                                        if (value.length > 0) setSubjectError('');
                                    }}
                                />
                                {subjectError && <p role="alert" className="text-xs text-(--dark-accent-color)">{subjectError}</p>}

                                <ChoiceList
                                    label="How long have you been teaching or tutoring?"
                                    options={['Less than 1 year', '1–3 years', '4–7 years', '8+ years', 'I support learners in another way']}
                                    value={formData.experience}
                                    onChange={(value) => updateField('experience', value)}
                                    type="radio"
                                    name="experience"
                                    required
                                />

                                <ChoiceList
                                    label="Which learning platforms do you currently use? Select all that apply."
                                    options={platformOptions}
                                    value={formData.platforms}
                                    onChange={(value) => updateField('platforms', value)}
                                />

                                <ChoiceList
                                    label="What school or classroom platform do you use? Select all that apply."
                                    options={lmsOptions}
                                    value={formData.schoolLms}
                                    onChange={(value) => updateField('schoolLms', value)}
                                />

                                <ChoiceList
                                    label="Which Equathora tools would be most useful to you? Select all that apply."
                                    options={featureOptions}
                                    value={formData.interestedFeatures}
                                    onChange={(value) => updateField('interestedFeatures', value)}
                                />

                                <label className="flex flex-col gap-2 text-sm font-semibold text-(--secondary-color)">
                                    Anything else you would like us to know? <span className="font-normal text-(--secondary-color)/65">(Optional)</span>
                                    <textarea
                                        className={`${inputClasses} min-h-28 resize-y`}
                                        value={formData.additionalNotes}
                                        onChange={(event) => updateField('additionalNotes', event.target.value)}
                                        maxLength={2000}
                                    />
                                </label>

                                {submitError && <p role="alert" className="rounded-xl border border-(--accent-color)/30 bg-(--accent-color)/5 px-4 py-3 text-sm text-(--dark-accent-color)">{submitError}</p>}

                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--main-color) pt-5">
                                    <SecondaryButton text="Cancel" link to="/applymentor" className="rounded-xl px-5 py-2.5 text-sm" />
                                    <PrimaryButton
                                        text={isSubmitting ? 'Submitting…' : 'Submit application'}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-xl px-5 py-2.5 text-sm"
                                    />
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MentorApplication;
