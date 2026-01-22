import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRocket, FaTrophy, FaGraduationCap, FaBrain, FaChartLine, FaFire, FaBook, FaSquareRootAlt, FaClock, FaUsers, FaLightbulb, FaSun, FaMoon, FaCoffee, FaChartBar, FaFlask } from 'react-icons/fa';
import { MdScience, MdTimeline, MdSpeed, MdGroup, MdSelfImprovement } from 'react-icons/md';
import { IoMdCalculator } from 'react-icons/io';
import { BiMath } from 'react-icons/bi';

const GetStarted = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});

    const totalSteps = 10;
    const percentage = ((currentStep + 1) / totalSteps) * 100;

    const encouragementMessages = {
        1: 'Excellent choice for focused learning',
        2: 'Great selection to build your foundation',
        3: 'This will help structure your practice',
        4: 'Perfect fit for your learning style',
        5: 'Realistic goals lead to better results',
        6: 'This will keep you motivated',
        7: 'Optimizing for your schedule',
        8: 'Tailoring difficulty to your preference'
    };

    const steps = [
        {
            type: 'welcome',
            title: 'Welcome to Equathora',
            subtitle: 'Let\'s personalize your learning experience',
            description: 'Answer a few questions to help us create the perfect study plan for you'
        },
        {
            type: 'selection',
            title: 'What\'s your primary goal?',
            subtitle: 'Select the option that best describes your objective',
            options: [
                { id: 'exams', label: 'Prepare for exams', icon: <FaGraduationCap /> },
                { id: 'problem-solving', label: 'Improve problem-solving', icon: <FaBrain /> },
                { id: 'confidence', label: 'Build confidence', icon: <FaTrophy /> },
                { id: 'exploration', label: 'Explore new topics', icon: <FaLightbulb /> }
            ]
        },
        {
            type: 'multi-selection',
            title: 'Select topics to focus on',
            subtitle: 'Choose one or more areas you want to study',
            options: [
                { id: 'algebra', label: 'Algebra', icon: <BiMath /> },
                { id: 'geometry', label: 'Geometry', icon: <FaSquareRootAlt /> },
                { id: 'calculus', label: 'Calculus', icon: <FaChartLine /> },
                { id: 'trigonometry', label: 'Trigonometry', icon: <IoMdCalculator /> },
                { id: 'statistics', label: 'Statistics', icon: <FaChartBar /> },
                { id: 'number-theory', label: 'Number Theory', icon: <FaBook /> }
            ]
        },
        {
            type: 'selection',
            title: 'What\'s your current level?',
            subtitle: 'This helps us match you with appropriate content',
            options: [
                { id: 'beginner', label: 'Beginner', icon: <FaBook />, description: 'Learning fundamentals' },
                { id: 'Sansationmediate', label: 'Sansationmediate', icon: <FaBrain />, description: 'Comfortable with basics' },
                { id: 'advanced', label: 'Advanced', icon: <FaChartLine />, description: 'Ready for complex problems' },
                { id: 'expert', label: 'Expert', icon: <FaRocket />, description: 'Seeking challenges' }
            ]
        },
        {
            type: 'selection',
            title: 'Choose your learning approach',
            subtitle: 'Select the method that works best for you',
            options: [
                { id: 'daily', label: 'Daily practice', icon: <FaFire />, description: 'Consistent short sessions' },
                { id: 'challenges', label: 'Timed challenges', icon: <MdSpeed />, description: 'Test under pressure' },
                { id: 'collaborative', label: 'Group learning', icon: <FaUsers />, description: 'Study with peers' },
                { id: 'self-paced', label: 'Self-paced', icon: <MdSelfImprovement />, description: 'Learn at your rhythm' }
            ]
        },
        {
            type: 'selection',
            title: 'Daily time commitment',
            subtitle: 'How much time can you dedicate each day?',
            options: [
                { id: '5-10', label: '5-10 minutes', icon: <FaCoffee />, description: 'Quick review' },
                { id: '15-30', label: '15-30 minutes', icon: <FaClock />, description: 'Standard session' },
                { id: '30-60', label: '30-60 minutes', icon: <MdTimeline />, description: 'In-depth practice' },
                { id: '60+', label: '60+ minutes', icon: <FaRocket />, description: 'Extended study' }
            ]
        },
        {
            type: 'selection',
            title: 'What drives your progress?',
            subtitle: 'Choose your primary motivation',
            options: [
                { id: 'achievements', label: 'Achievements', icon: <FaTrophy />, description: 'Unlock badges and rewards' },
                { id: 'streaks', label: 'Streaks', icon: <FaFire />, description: 'Maintain daily consistency' },
                { id: 'leaderboards', label: 'Leaderboards', icon: <FaChartLine />, description: 'Compete with others' },
                { id: 'mastery', label: 'Mastery', icon: <FaGraduationCap />, description: 'Deep understanding' }
            ]
        },
        {
            type: 'selection',
            title: 'Preferred study time',
            subtitle: 'When are you most productive?',
            options: [
                { id: 'morning', label: 'Morning', icon: <FaSun />, description: '6 AM - 12 PM' },
                { id: 'afternoon', label: 'Afternoon', icon: <FaSun />, description: '12 PM - 6 PM' },
                { id: 'evening', label: 'Evening', icon: <FaMoon />, description: '6 PM - 10 PM' },
                { id: 'night', label: 'Night', icon: <FaMoon />, description: '10 PM - 2 AM' }
            ]
        },
        {
            type: 'selection',
            title: 'Problem-solving preference',
            subtitle: 'How much guidance do you want?',
            options: [
                { id: 'hints-please', label: 'Full guidance', icon: <FaLightbulb />, description: 'Step-by-step hints' },
                { id: 'some-help', label: 'Moderate help', icon: <FaBrain />, description: 'Hints when needed' },
                { id: 'minimal', label: 'Minimal hints', icon: <FaTrophy />, description: 'Figure it out mostly alone' },
                { id: 'hardcore', label: 'No hints', icon: <FaFire />, description: 'Pure challenge mode' }
            ]
        },
        {
            type: 'final',
            title: 'Setup Complete',
            subtitle: 'Your personalized learning path is ready',
            description: 'We\'ve configured your experience based on your preferences. Let\'s begin your journey.',
            icon: <FaRocket className="text-5xl text-[var(--accent-color)]" />
        }
    ];

    const handleSelection = (optionId) => {
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
        }
    }; const handleContinue = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate('/dashboard', { state: { preferences: selectedOptions } });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
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

    const getFeedbackMessage = () => {
        if (!selectedOptions[currentStep]) return '';
        return encouragementMessages[currentStep] || '';
    };

    return (
        <main className='flex flex-col w-full bg-[var(--main-color)] min-h-screen items-center justify-center px-4 sm:px-6 py-6 font-[Sansation]'>
            {/* Progress Bar Section */}
            <div className='w-full max-w-xl flex flex-col gap-3 pb-6'>
                <div className='flex items-center gap-3'>
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className='p-2 rounded-lg hover:bg-[var(--french-gray)] transition-colors duration-200 text-[var(--secondary-color)] cursor-pointer'
                            aria-label="Go back"
                        >
                            <FaArrowLeft className='text-lg' />
                        </button>
                    )}

                    <div className="flex-1 h-1.5 bg-[var(--french-gray)] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <span className='text-xs font-medium text-[var(--secondary-color)] opacity-50 min-w-[50px] text-right'>
                        {currentStep + 1} / {totalSteps}
                    </span>
                </div>

                {getFeedbackMessage() && (
                    <div className='px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium text-center'>
                        {getFeedbackMessage()}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <article className='flex flex-col items-center justify-around flex-1 w-full max-w-xl text-center'>
                <div className='flex flex-col gap-2 pb-6'>
                    {currentStepData.icon && (
                        <div className='pb-2'>
                            {currentStepData.icon}
                        </div>
                    )}
                    <h1 className='text-2xl sm:text-3xl font-bold text-[var(--secondary-color)]'>
                        {currentStepData.title}
                    </h1>
                    <p className='text-sm sm:text-base text-[var(--secondary-color)] opacity-60'>
                        {currentStepData.subtitle}
                    </p>
                    {currentStepData.description && (
                        <p className='text-xs sm:text-sm text-[var(--secondary-color)] opacity-50 pt-1'>
                            {currentStepData.description}
                        </p>
                    )}
                </div>

                {currentStepData.type === 'selection' && (
                    <div className='flex flex-col gap-2 w-full pb-6'>
                        {currentStepData.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleSelection(option.id)}
                                className={`group flex items-center gap-2.5 p-2.5 rounded-lg border-2 transition-colors duration-200 cursor-pointer text-left ${selectedOptions[currentStep] === option.id
                                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                    : 'border-[var(--french-gray)] bg-white text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                    }`}
                            >
                                <div className='text-lg flex-shrink-0'>{option.icon}</div>
                                <div className='flex-1'>
                                    <div className='font-semibold text-xs'>{option.label}</div>
                                    {option.description && (
                                        <div className={`text-[11px] pt-0.5 leading-tight ${selectedOptions[currentStep] === option.id ? 'opacity-90' : 'opacity-50'
                                            }`}>
                                            {option.description}
                                        </div>
                                    )}
                                </div>
                                <div className='text-base flex-shrink-0 w-4'>
                                    {selectedOptions[currentStep] === option.id ? '✓' : ''}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {currentStepData.type === 'multi-selection' && (
                    <div className='grid grid-cols-2 gap-2 w-full pb-6'>
                        {currentStepData.options.map((option) => {
                            const isSelected = (selectedOptions[currentStep] || []).includes(option.id);
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelection(option.id)}
                                    className={`flex flex-row items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors duration-200 cursor-pointer ${isSelected
                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                        : 'border-[var(--french-gray)] bg-white text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                        }`}
                                >
                                    <div className='text-lg flex items-center'>{option.icon}</div>
                                    <div className='text-xs font-semibold flex-1 text-left leading-tight'>{option.label}</div>
                                    <div className='text-sm w-4 flex items-center justify-center'>
                                        {isSelected ? '✓' : ''}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                <button
                    onClick={handleContinue}
                    disabled={!canContinue()}
                    className={`w-60 px-8 py-3 rounded-full font-semibold text-sm ${canContinue()
                        ? 'bg-[var(--secondary-color)] text-white hover:bg-[var(--secondary-color)]/90 shadow-[0px_4px_0px_rgb(43,45,66,0.6)] active:shadow-none active:translate-y-1 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    {currentStep === totalSteps - 1 ? 'Start Learning' : 'Continue'}
                </button>
            </article>
        </main>
    );
};

export default GetStarted;