import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SubmitProblem = () => {
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        grade: '',
        difficulty: 'Beginner',
        isPremium: false,
        isActive: true,
        displayOrder: '',
        slug: '',
        shareAuthorName: false,
        publicAuthorName: '',
        description: '',
        answer: '',
        accepted_answers: [''],
        hints: [''],
        solution: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const parsedValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleArrayChange = (index, field, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting problem: ', formData);
        alert('Thank you! Your problem has been submitted and will be reviewed.');
    };

    const inputClasses = 'w-full bg-[var(--main-color)] border border-[rgba(43,45,66,0.2)] rounded-md px-4 py-2.5 text-[var(--secondary-color)] focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder-[var(--mid-main-secondary)]';
    const labelClasses = 'block text-sm font-semibold text-[var(--secondary-color)] opacity-90';
    const cardClasses = 'bg-[var(--white)] rounded-md border border-[rgba(43,45,66,0.12)] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6';
    const fieldGroupClasses = 'flex flex-col gap-2';
    const sectionTitleClasses = 'text-2xl font-bold text-[var(--secondary-color)] flex items-center gap-2';
    const difficultyOptions = [
        'Beginner',
        'Easy',
        'Standard',
        'Intermediate',
        'Medium',
        'Challenging',
        'Hard',
        'Advanced',
        'Expert'
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed font-[Sansation]">
            <header>
                <Navbar />
            </header>

            <main className='flex w-full justify-center items-center'>
                <section className='flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8 w-full'>
                    <article className='w-full max-w-[980px] flex flex-col gap-3 text-center md:text-left'>
                        <h1 className="text-4xl text-[var(--secondary-color)] font-extrabold tracking-tight">Submit a New Problem</h1>
                        <p className="text-md lg:text-lg font-normal leading-[1.2] text-[var(--secondary-color)] opacity-80">
                            Help expand Equathora by contributing high-quality challenges. Each submission is reviewed by AI checks and then manually approved before publishing.
                        </p>
                        <p className="text-md lg:text-lg font-normal leading-[1.2] text-[var(--secondary-color)] opacity-70">
                            Include clear steps and accepted answer formats. Use LaTeX if possible, otherwise it is no issue.
                        </p>
                    </article>

                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-[980px] flex flex-col gap-6"
                        aria-label="Submit a new math problem"
                    >
                        <section className={cardClasses} aria-labelledby="general-information-heading">
                            <h2 id="general-information-heading" className={sectionTitleClasses}>
                                <svg className="w-6 h-6 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                General Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`${fieldGroupClasses} md:col-span-2`}>
                                    <label htmlFor="problem-title" className={labelClasses}>Problem Title</label>
                                    <input
                                        id="problem-title"
                                        required
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Evaluate algebraic expression"
                                        className={inputClasses}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className={fieldGroupClasses}>
                                    <label htmlFor="problem-topic" className={labelClasses}>Topic / Category</label>
                                    <input
                                        id="problem-topic"
                                        required
                                        type="text"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        placeholder="e.g. scientific_notation"
                                        className={inputClasses}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className={fieldGroupClasses}>
                                    <label htmlFor="problem-difficulty" className={labelClasses}>Difficulty</label>
                                    <div className="relative">
                                        <select
                                            id="problem-difficulty"
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleChange}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            {difficultyOptions.map((level) => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--secondary-color)]">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className={fieldGroupClasses}>
                                    <label htmlFor="problem-grade" className={labelClasses}>Grade Level</label>
                                    <input
                                        id="problem-grade"
                                        required
                                        type="text"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        placeholder="e.g. 10"
                                        className={inputClasses}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="md:col-span-2 flex flex-col gap-3 rounded-md border border-[rgba(43,45,66,0.14)] bg-[var(--main-color)] p-4">
                                    <label htmlFor="share-author-name" className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            id="share-author-name"
                                            type="checkbox"
                                            name="shareAuthorName"
                                            checked={formData.shareAuthorName}
                                            onChange={handleChange}
                                            className="h-5 w-5 rounded-md border-[rgba(43,45,66,0.4)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                                        />
                                        <span className="text-md text-[var(--secondary-color)] font-semibold">
                                            Share my name as the contributor for this problem
                                        </span>
                                    </label>
                                    <p className="text-sm text-[var(--secondary-color)] opacity-70">
                                        If enabled, your problem can show author credit like "By Alex".
                                    </p>

                                    {formData.shareAuthorName && (
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="public-author-name" className={labelClasses}>Display Name</label>
                                            <input
                                                id="public-author-name"
                                                type="text"
                                                name="publicAuthorName"
                                                value={formData.publicAuthorName}
                                                onChange={handleChange}
                                                placeholder="e.g. Alex"
                                                className={inputClasses}
                                                autoComplete="nickname"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2 flex flex-col gap-4 rounded-md border border-[rgba(43,45,66,0.14)] bg-[var(--main-color)] p-4">
                                    <h3 className="text-lg font-semibold text-[var(--secondary-color)]">Additional Characteristics</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label htmlFor="is-premium-problem" className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                id="is-premium-problem"
                                                type="checkbox"
                                                name="isPremium"
                                                checked={formData.isPremium}
                                                onChange={handleChange}
                                                className="h-5 w-5 rounded-md border-[rgba(43,45,66,0.4)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                                            />
                                            <span className="text-md text-[var(--secondary-color)] font-semibold">Mark as premium problem</span>
                                        </label>

                                        <label htmlFor="is-active-problem" className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                id="is-active-problem"
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleChange}
                                                className="h-5 w-5 rounded-md border-[rgba(43,45,66,0.4)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                                            />
                                            <span className="text-md text-[var(--secondary-color)] font-semibold">Recommend active on approval</span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={fieldGroupClasses}>
                                            <label htmlFor="problem-display-order" className={labelClasses}>Suggested Display Order (optional)</label>
                                            <input
                                                id="problem-display-order"
                                                type="number"
                                                min="0"
                                                name="displayOrder"
                                                value={formData.displayOrder}
                                                onChange={handleChange}
                                                placeholder="e.g. 12"
                                                className={inputClasses}
                                            />
                                        </div>

                                        <div className={fieldGroupClasses}>
                                            <label htmlFor="problem-slug" className={labelClasses}>Suggested Slug (optional)</label>
                                            <input
                                                id="problem-slug"
                                                type="text"
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                placeholder="e.g. evaluate-linear-expression"
                                                className={inputClasses}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={cardClasses} aria-labelledby="problem-content-heading">
                            <h2 id="problem-content-heading" className={sectionTitleClasses}>
                                <svg className="w-6 h-6 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Problem Content
                            </h2>

                            <div className="flex flex-col gap-6">
                                <div className={fieldGroupClasses}>
                                    <label htmlFor="problem-description" className={labelClasses}>Description</label>
                                    <textarea
                                        id="problem-description"
                                        required
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="e.g. Evaluate 8(x+3)-64 for x=2. Use LaTeX if possible, otherwise plain text is fine."
                                        className={`${inputClasses} resize-y`}
                                    />
                                    <p className="text-sm text-[var(--secondary-color)] opacity-70">
                                        Use LaTeX if possible, otherwise it is no issue.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={fieldGroupClasses}>
                                        <label htmlFor="problem-answer" className={labelClasses}>Main Answer</label>
                                        <input
                                            id="problem-answer"
                                            required
                                            type="text"
                                            name="answer"
                                            value={formData.answer}
                                            onChange={handleChange}
                                            placeholder="e.g. -24"
                                            className={inputClasses}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className={labelClasses}>Accepted Formats</label>
                                        <div className="flex flex-col gap-3">
                                            {formData.accepted_answers.map((ans, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={ans}
                                                        onChange={(e) => handleArrayChange(index, 'accepted_answers', e.target.value)}
                                                        placeholder="e.g. -24.0"
                                                        className="w-full bg-[var(--main-color)] border border-[rgba(43,45,66,0.2)] rounded-md px-3 py-2 text-[var(--secondary-color)] focus:outline-none focus:border-[var(--accent-color)]"
                                                        autoComplete="off"
                                                    />
                                                    {formData.accepted_answers.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeArrayItem(index, 'accepted_answers')}
                                                            className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                                                            title="Remove format"
                                                            aria-label={`Remove accepted format ${index + 1}`}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('accepted_answers')}
                                                className="text-sm text-[var(--accent-color)] font-medium hover:underline flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add Alternative Format
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={cardClasses} aria-labelledby="guidance-support-heading">
                            <h2 id="guidance-support-heading" className={sectionTitleClasses}>
                                <svg className="w-6 h-6 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Guidance & Support
                            </h2>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className={labelClasses}>Step-by-Step Hints</label>
                                    <p className="text-xs text-[var(--secondary-color)] opacity-70">Provide helpful clues without giving away the direct answer.</p>
                                    <div className="flex flex-col gap-3">
                                        {formData.hints.map((hint, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <span className="bg-[rgba(43,45,66,0.1)] text-[var(--secondary-color)] font-bold text-sm w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md">{index + 1}</span>
                                                <textarea
                                                    required
                                                    value={hint}
                                                    onChange={(e) => handleArrayChange(index, 'hints', e.target.value)}
                                                    rows="2"
                                                    placeholder="e.g. Substitute x = 2 first."
                                                    className="w-full bg-[var(--main-color)] border border-[rgba(43,45,66,0.2)] rounded-md px-3 py-2 text-[var(--secondary-color)] focus:outline-none focus:border-[var(--accent-color)] resize-y"
                                                />
                                                {formData.hints.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem(index, 'hints')}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                                                        title="Remove hint"
                                                        aria-label={`Remove hint ${index + 1}`}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('hints')}
                                            className="text-sm text-[var(--accent-color)] font-medium hover:underline flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Another Hint
                                        </button>
                                    </div>
                                </div>

                                <div className={fieldGroupClasses}>
                                    <label htmlFor="problem-solution" className={labelClasses}>Full Solution Explanation</label>
                                    <textarea
                                        id="problem-solution"
                                        required
                                        name="solution"
                                        value={formData.solution}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Write the complete solution that leads to the answer. Use LaTeX if possible, otherwise plain text is fine."
                                        className={`${inputClasses} resize-y`}
                                    />
                                    <p className="text-sm text-[var(--secondary-color)] opacity-70">
                                        Use LaTeX if possible, otherwise it is no issue.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="w-full flex justify-end pb-8">
                            <button
                                type="submit"
                                className="cursor-pointer px-6 py-3 font-bold text-center border-2 border-[var(--accent-color)] rounded-md bg-[var(--accent-color)] text-[var(--white)] hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
                            >
                                <span>Submit Problem</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default SubmitProblem;
