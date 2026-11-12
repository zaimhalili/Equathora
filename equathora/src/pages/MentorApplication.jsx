import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

const inputClasses = 'w-full rounded-md border border-[#d8d8d8] bg-white px-3 py-2 text-sm text-[#222] outline-none transition focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/10';

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
        <fieldset className="flex flex-col items-start gap-1.5">
            <legend className="mb-1 text-[13px] font-medium text-[#222]">
                {label}{required && <span className="ml-1 text-(--dark-accent-color)" aria-hidden="true">*</span>}
            </legend>
            <div className="flex flex-col items-start gap-1.5">
                {options.map((option, index) => (
                    <label
                        key={option}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] leading-4 transition-colors ${
                            isSelected(option)
                                ? 'border-(--accent-color)/40 bg-(--accent-color)/5 text-[#272727]'
                                : 'border-[#dedede] bg-white text-[#444] hover:border-[#aaa]'
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
                        <span aria-hidden="true" className={`flex h-3 w-3 items-center justify-center rounded-[2px] text-[8px] font-semibold text-white ${isSelected(option) ? 'bg-(--dark-accent-color)' : 'bg-[#777]'}`}>
                            {String.fromCharCode(65 + index)}
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
    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        role: '',
        phone: '',
        hasWhatsapp: '',
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

    const updateField = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

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
            setIsSubmitted(true);
        } catch (error) {
            setSubmitError(error.message || 'We could not submit your application right now. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white text-[#222]">
            <header><Navbar /></header>
            <main className="flex w-full justify-center px-5 py-9 sm:px-8 sm:py-12">
                <div className="flex w-full max-w-[1500px] justify-center">
                    <section className="flex w-full max-w-[600px] flex-col gap-7">
                        <div className="flex flex-col gap-2">
                            <Link to="/applymentor" className="w-fit text-xs text-[#777] hover:text-(--dark-accent-color)">
                                ← Back to the educator network
                            </Link>
                            <h1 className="pt-2 text-[23px] font-normal leading-tight text-[#222] sm:text-[26px]">
                                Equathora Educator Network Application
                            </h1>
                            <p className="text-[12px] leading-5 text-[#666]">
                                Tell us a little about your teaching experience and how you would like to help shape Equathora.
                                Required questions are marked with an asterisk.
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div role="status" className="flex flex-col gap-3 border-l-2 border-(--accent-color) bg-[#fafafa] p-5">
                                <h2 className="text-lg font-medium text-[#222]">Application received</h2>
                                <p className="text-sm leading-6 text-[#666]">
                                    Thank you for sharing your experience. We’ll review your application and reach out using the contact details you provided.
                                </p>
                                <Link to="/applymentor" className="mt-1 w-fit text-sm font-medium text-(--dark-accent-color) underline underline-offset-2">
                                    Return to the educator network
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#222]">
                                    Full name <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>
                                    <input
                                        autoComplete="name"
                                        className={inputClasses}
                                        value={formData.fullName}
                                        onChange={(event) => updateField('fullName', event.target.value)}
                                        maxLength={120}
                                        required
                                    />
                                </label>

                                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#222]">
                                    Email address <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>
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

                                <ChoiceList
                                    label="How do you work with students?"
                                    options={roleOptions}
                                    value={formData.role}
                                    onChange={(value) => updateField('role', value)}
                                    type="radio"
                                    name="role"
                                    required
                                />

                                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#222]">
                                    Phone number <span className="text-(--dark-accent-color)" aria-hidden="true">*</span>
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
                                    label="Can we contact you on WhatsApp?"
                                    options={['Yes', 'No']}
                                    value={formData.hasWhatsapp}
                                    onChange={(value) => updateField('hasWhatsapp', value)}
                                    type="radio"
                                    name="whatsapp"
                                    required
                                />

                                <ChoiceList
                                    label="Which subjects do you teach or support? Select all that apply."
                                    options={subjectOptions}
                                    value={formData.subjects}
                                    onChange={(value) => {
                                        updateField('subjects', value);
                                        if (value.length > 0) setSubjectError('');
                                    }}
                                />
                                {subjectError && <p role="alert" className="-mt-5 text-xs text-(--dark-accent-color)">{subjectError}</p>}

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

                                <label className="flex flex-col gap-2 text-[13px] font-medium text-[#222]">
                                    Anything else you would like us to know? <span className="font-normal text-[#777]">(Optional)</span>
                                    <textarea
                                        className={`${inputClasses} min-h-24 resize-y`}
                                        value={formData.additionalNotes}
                                        onChange={(event) => updateField('additionalNotes', event.target.value)}
                                        maxLength={2000}
                                    />
                                </label>

                                {submitError && (
                                    <p role="alert" className="text-sm text-(--dark-accent-color)">{submitError}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-fit rounded-md bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--dark-accent-color) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Submitting…' : 'Submit application'}
                                </button>
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
