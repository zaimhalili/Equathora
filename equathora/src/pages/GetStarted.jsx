import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRocket, FaTrophy, FaGraduationCap, FaBrain, FaChartLine, FaFire } from 'react-icons/fa';

const GetStarted = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [encouragement, setEncouragement] = useState('');

    const totalSteps = 10;
    const percentage = ((currentStep + 1) / totalSteps) * 100;

    const encouragementMessages = {
        1: {
            'Ace my exams': 'Smart move! Let\'s crush those tests! 🎯',
            'Build problem-solving skills': 'Brilliant choice! You\'re thinking like a mathematician! 🧠',
            'Boost my confidence': 'Love it! Confidence is key to mastery! 💪',
            'Explore math for fun': 'Amazing! Curiosity is the best teacher! 🚀'
        },
        2: {
            'Algebra': 'Excellent! The foundation of all math! 📐',
            'Geometry': 'Great pick! Shapes and spaces await! 📏',
            'Calculus': 'Bold choice! Ready to level up! 📈',
            'Trigonometry': 'Nice! Angles and waves are fascinating! 📊',
            'Statistics': 'Smart! Data tells amazing stories! 📉',
            'Number Theory': 'Brilliant! The poetry of mathematics! 🔢'
        },
        4: {
            'Daily problem sets': 'Perfect! Consistency builds mastery! 🔥',
            'Timed challenges': 'Exciting! Let\'s build that speed! ⚡',
            'Collaborative learning': 'Awesome! Learning together is powerful! 👥',
            'Self-paced exploration': 'Great! Take your time to master it! 🎯'
        }
    };

    const steps = [
        {
            type: 'welcome',
            title: '👋 Hey there, future math wizard!',
            subtitle: 'Ready to turn those "I can\'t" into "I totally can"?',
            description: 'We\'re about to build your perfect learning adventure. This will only take 2 minutes!'
        },
        {
            type: 'selection',
            title: 'What\'s your main mission?',
            subtitle: 'Pick what gets you excited (or what you need most right now)',
            options: [
                { id: 'exams', label: 'Ace my exams', icon: '🎯' },
                { id: 'problem-solving', label: 'Build problem-solving skills', icon: '🧠' },
                { id: 'confidence', label: 'Boost my confidence', icon: '💪' },
                { id: 'fun', label: 'Explore math for fun', icon: '🚀' }
            ]
        },
        {
            type: 'multi-selection',
            title: 'Which topics make you curious?',
            subtitle: 'Choose as many as you like! We\'ll create your custom path.',
            options: [
                { id: 'algebra', label: 'Algebra', icon: '📐' },
                { id: 'geometry', label: 'Geometry', icon: '📏' },
                { id: 'calculus', label: 'Calculus', icon: '📈' },
                { id: 'trigonometry', label: 'Trigonometry', icon: '📊' },
                { id: 'statistics', label: 'Statistics', icon: '📉' },
                { id: 'number-theory', label: 'Number Theory', icon: '🔢' }
            ]
        },
        {
            type: 'selection',
            title: 'How would you describe your level?',
            subtitle: 'Be honest! There\'s no wrong answer here.',
            options: [
                { id: 'beginner', label: 'Just starting out', icon: '🌱', description: 'New to this topic' },
                { id: 'intermediate', label: 'Getting the hang of it', icon: '🌿', description: 'Know the basics' },
                { id: 'advanced', label: 'Pretty comfortable', icon: '🌳', description: 'Ready for challenges' },
                { id: 'expert', label: 'Bring on the hard stuff!', icon: '🚀', description: 'I love a challenge' }
            ]
        },
        {
            type: 'selection',
            title: 'What\'s your ideal learning style?',
            subtitle: 'Everyone learns differently. What works for you?',
            options: [
                { id: 'daily', label: 'Daily problem sets', icon: '🔥', description: '15-20 min per day' },
                { id: 'challenges', label: 'Timed challenges', icon: '⚡', description: 'Race against time' },
                { id: 'collaborative', label: 'Collaborative learning', icon: '👥', description: 'Learn with others' },
                { id: 'self-paced', label: 'Self-paced exploration', icon: '🎯', description: 'Go at your speed' }
            ]
        },
        {
            type: 'selection',
            title: 'How much time can you commit?',
            subtitle: 'Setting realistic goals helps you succeed!',
            options: [
                { id: '5-10', label: '5-10 minutes/day', icon: '☕', description: 'Quick daily boost' },
                { id: '15-30', label: '15-30 minutes/day', icon: '⏰', description: 'Solid practice time' },
                { id: '30-60', label: '30-60 minutes/day', icon: '🎯', description: 'Deep dive sessions' },
                { id: '60+', label: '1+ hour/day', icon: '🚀', description: 'Power learner mode' }
            ]
        },
        {
            type: 'selection',
            title: 'What motivates you most?',
            subtitle: 'Let\'s tap into what drives you forward!',
            options: [
                { id: 'achievements', label: 'Unlocking achievements', icon: '🏆', description: 'Collect all the badges' },
                { id: 'streaks', label: 'Building streaks', icon: '🔥', description: 'Don\'t break the chain' },
                { id: 'leaderboards', label: 'Climbing leaderboards', icon: '📊', description: 'Compete with others' },
                { id: 'mastery', label: 'Mastering concepts', icon: '🎓', description: 'Deep understanding' }
            ]
        },
        {
            type: 'selection',
            title: 'When do you work best?',
            subtitle: 'We\'ll send you reminders at the perfect time!',
            options: [
                { id: 'morning', label: 'Morning person', icon: '🌅', description: '6 AM - 12 PM' },
                { id: 'afternoon', label: 'Afternoon focus', icon: '☀️', description: '12 PM - 6 PM' },
                { id: 'evening', label: 'Evening learner', icon: '🌆', description: '6 PM - 10 PM' },
                { id: 'night', label: 'Night owl', icon: '🌙', description: '10 PM - 2 AM' }
            ]
        },
        {
            type: 'selection',
            title: 'How do you handle challenges?',
            subtitle: 'This helps us provide the right level of support.',
            options: [
                { id: 'hints-please', label: 'I love hints!', icon: '💡', description: 'Guide me through it' },
                { id: 'some-help', label: 'Occasional nudge', icon: '👉', description: 'Help when stuck' },
                { id: 'minimal', label: 'Minimal guidance', icon: '🎯', description: 'Let me figure it out' },
                { id: 'hardcore', label: 'Hardcore mode', icon: '🔥', description: 'No hints, pure challenge' }
            ]
        },
        {
            type: 'final',
            title: '🎉 You\'re all set!',
            subtitle: 'Your personalized learning journey is ready to begin!',
            description: 'We\'ve crafted a path that matches your goals, interests, and style. Time to make math your superpower!',
            icon: <FaRocket className="text-6xl text-[var(--accent-color)]" />
        }
    ];

    const handleSelection = (optionId, optionLabel) => {
        const stepType = steps[currentStep].type;

        if (stepType === 'multi-selection') {
            const currentSelections = selectedOptions[currentStep] || [];
            const isSelected = currentSelections.includes(optionId);

            if (isSelected) {
                setSelectedOptions({
                    ...selectedOptions,
                    [currentStep]: currentSelections.filter(id => id !== optionId)
                });
            } else {
                setSelectedOptions({
                    ...selectedOptions,
                    [currentStep]: [...currentSelections, optionId]
                });
            }
        } else {
            setSelectedOptions({
                ...selectedOptions,
                [currentStep]: optionId
            });

            // Show encouragement message
            if (encouragementMessages[currentStep] && encouragementMessages[currentStep][optionLabel]) {
                setEncouragement(encouragementMessages[currentStep][optionLabel]);
                setTimeout(() => setEncouragement(''), 2000);
            }
        }
    };

    const handleContinue = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            setEncouragement('');
        } else {
            // Navigate to dashboard with user preferences
            navigate('/dashboard', { state: { preferences: selectedOptions } });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setEncouragement('');
        }
    };

    const canContinue = () => {
        const stepType = steps[currentStep].type;
        if (stepType === 'welcome' || stepType === 'final') return true;
        if (stepType === 'multi-selection') {
            const selections = selectedOptions[currentStep] || [];
            return selections.length > 0;
        }
        return selectedOptions[currentStep] !== undefined;
    };

    const currentStepData = steps[currentStep];

    return (
        <main className='flex flex-col w-full bg-[var(--main-color)] min-h-screen items-center justify-center px-4 sm:px-6 py-8 font-[Inter]'>
            {/* Progress Bar Section */}
            <div className='w-full max-w-2xl mb-12'>
                <div className='flex items-center gap-4'>
                    {/* Back Arrow */}
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className='p-2 rounded-full hover:bg-[var(--french-gray)] transition-colors duration-200 text-[var(--secondary-color)]'
                            aria-label="Go back"
                        >
                            <FaArrowLeft className='text-xl' />
                        </button>
                    )}

                    {/* Progress Bar */}
                    <div className="flex-1 h-2 bg-[var(--french-gray)] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Step Counter */}
                    <span className='text-sm font-medium text-[var(--secondary-color)] opacity-60 min-w-[60px] text-right'>
                        {currentStep + 1} / {totalSteps}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <article className='flex flex-col items-center justify-center flex-1 w-full max-w-3xl text-center'>
                {/* Encouragement Message */}
                {encouragement && (
                    <div className='mb-6 px-6 py-3 bg-green-100 text-green-800 rounded-lg animate-bounce-in font-semibold'>
                        {encouragement}
                    </div>
                )}

                {/* Title and Subtitle */}
                <div className='flex flex-col gap-3 mb-8 sm:mb-12'>
                    {currentStepData.icon && (
                        <div className='mb-4'>
                            {currentStepData.icon}
                        </div>
                    )}
                    <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--secondary-color)] leading-tight'>
                        {currentStepData.title}
                    </h1>
                    <p className='text-base sm:text-lg md:text-xl text-[var(--secondary-color)] opacity-70'>
                        {currentStepData.subtitle}
                    </p>
                    {currentStepData.description && (
                        <p className='text-sm sm:text-base text-[var(--secondary-color)] opacity-60 mt-2'>
                            {currentStepData.description}
                        </p>
                    )}
                </div>

                {/* Options/Content */}
                {currentStepData.type === 'selection' && (
                    <div className='flex flex-col gap-3 w-full max-w-xl mb-8'>
                        {currentStepData.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleSelection(option.id, option.label)}
                                className={`group relative flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer text-left ${selectedOptions[currentStep] === option.id
                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white shadow-lg scale-105'
                                        : 'border-[var(--french-gray)] bg-white text-[var(--secondary-color)] hover:border-[var(--accent-color)] hover:shadow-md'
                                    }`}
                            >
                                <span className='text-3xl'>{option.icon}</span>
                                <div className='flex-1'>
                                    <div className='font-semibold text-lg'>{option.label}</div>
                                    {option.description && (
                                        <div className={`text-sm mt-1 ${selectedOptions[currentStep] === option.id ? 'opacity-90' : 'opacity-60'
                                            }`}>
                                            {option.description}
                                        </div>
                                    )}
                                </div>
                                {selectedOptions[currentStep] === option.id && (
                                    <div className='text-2xl'>✓</div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {currentStepData.type === 'multi-selection' && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-8'>
                        {currentStepData.options.map((option) => {
                            const isSelected = (selectedOptions[currentStep] || []).includes(option.id);
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelection(option.id, option.label)}
                                    className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${isSelected
                                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white shadow-lg'
                                            : 'border-[var(--french-gray)] bg-white text-[var(--secondary-color)] hover:border-[var(--accent-color)] hover:shadow-md'
                                        }`}
                                >
                                    <span className='text-2xl'>{option.icon}</span>
                                    <div className='flex-1 text-left font-semibold'>{option.label}</div>
                                    {isSelected && (
                                        <div className='text-xl'>✓</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!canContinue()}
                    className={`w-full sm:w-auto px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${canContinue()
                            ? 'bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-color)]/90 shadow-[0px_6px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    {currentStep === totalSteps - 1 ? 'Start Learning! 🚀' : 'Continue'}
                </button>
            </article>
        </main>
    );
};

export default GetStarted;