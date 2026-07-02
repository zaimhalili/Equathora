import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaChartLine,
    FaFire,
    FaBook,
    FaSquareRootAlt,
    FaClock,
    FaUsers,
    FaLightbulb,
    FaSun,
    FaMoon,
    FaCoffee,
    FaChartBar,
    FaArrowLeft,
    FaRocket,
    FaTrophy,
    FaGraduationCap,
    FaBrain
} from 'react-icons/fa';
import {
    MdTimeline,
    MdSpeed,
    MdSelfImprovement
} from 'react-icons/md';
import { IoMdCalculator } from 'react-icons/io';
import { BiMath } from 'react-icons/bi';

import { supabase } from '@/lib/supabaseClient';

import WelcomeTeacher from '../assets/images/welcomeTeacher.svg';
import Mascot from '../assets/images/mascot.png';

const GetStarted = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [saving, setSaving] = useState(false);

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
            subtitle: "Let's personalize your learning experience",
            description:
                'Answer a few questions to help us create the perfect study plan for you'
        },
        {
            type: 'selection',
            title: "What's your primary goal?",
            subtitle: 'Select the option that best describes your objective',
            options: [
                {
                    id: 'exams',
                    label: 'Prepare for exams',
                    icon: <FaGraduationCap />
                },
                {
                    id: 'problem-solving',
                    label: 'Improve problem-solving',
                    icon: <FaBrain />
                },
                {
                    id: 'confidence',
                    label: 'Build confidence',
                    icon: <FaTrophy />
                },
                {
                    id: 'exploration',
                    label: 'Explore new topics',
                    icon: <FaLightbulb />
                }
            ]
        },
        {
            type: 'multi-selection',
            title: 'Select topics to focus on',
            subtitle: 'Choose one or more areas you want to study',
            options: [
                {
                    id: 'algebra',
                    label: 'Algebra',
                    icon: <BiMath />
                },
                {
                    id: 'geometry',
                    label: 'Geometry',
                    icon: <FaSquareRootAlt />
                },
                {
                    id: 'calculus',
                    label: 'Calculus',
                    icon: <FaChartLine />
                },
                {
                    id: 'trigonometry',
                    label: 'Trigonometry',
                    icon: <IoMdCalculator />
                },
                {
                    id: 'statistics',
                    label: 'Statistics',
                    icon: <FaChartBar />
                },
                {
                    id: 'number-theory',
                    label: 'Number Theory',
                    icon: <FaBook />
                }
            ]
        },
        {
            type: 'selection',
            title: "What's your current level?",
            subtitle: 'This helps us match you with appropriate content',
            options: [
                {
                    id: 'beginner',
                    label: 'Beginner',
                    icon: <FaBook />,
                    description: 'Learning fundamentals'
                },
                {
                    id: 'intermediate',
                    label: 'Intermediate',
                    icon: <FaBrain />,
                    description: 'Comfortable with basics'
                },
                {
                    id: 'advanced',
                    label: 'Advanced',
                    icon: <FaChartLine />,
                    description: 'Ready for complex problems'
                },
                {
                    id: 'expert',
                    label: 'Expert',
                    icon: <FaRocket />,
                    description: 'Seeking challenges'
                }
            ]
        },        {
            type: 'selection',
            title: 'Choose your learning approach',
            subtitle: 'Select the method that works best for you',
            options: [
                {
                    id: 'daily',
                    label: 'Daily practice',
                    icon: <FaFire />,
                    description: 'Consistent short sessions'
                },
                {
                    id: 'challenges',
                    label: 'Timed challenges',
                    icon: <MdSpeed />,
                    description: 'Test under pressure'
                },
                {
                    id: 'collaborative',
                    label: 'Group learning',
                    icon: <FaUsers />,
                    description: 'Study with peers'
                },
                {
                    id: 'self-paced',
                    label: 'Self-paced',
                    icon: <MdSelfImprovement />,
                    description: 'Learn at your own pace'
                }
            ]
        },
        {
            type: 'selection',
            title: 'Daily time commitment',
            subtitle: 'How much time can you dedicate each day?',
            options: [
                {
                    id: '5-10',
                    label: '5–10 minutes',
                    icon: <FaCoffee />,
                    description: 'Quick review'
                },
                {
                    id: '15-30',
                    label: '15–30 minutes',
                    icon: <FaClock />,
                    description: 'Standard session'
                },
                {
                    id: '30-60',
                    label: '30–60 minutes',
                    icon: <MdTimeline />,
                    description: 'In-depth practice'
                },
                {
                    id: '60+',
                    label: '60+ minutes',
                    icon: <FaRocket />,
                    description: 'Extended study'
                }
            ]
        },
        {
            type: 'selection',
            title: 'What drives your progress?',
            subtitle: 'Choose your primary motivation',
            options: [
                {
                    id: 'achievements',
                    label: 'Achievements',
                    icon: <FaTrophy />,
                    description: 'Unlock badges and rewards'
                },
                {
                    id: 'streaks',
                    label: 'Streaks',
                    icon: <FaFire />,
                    description: 'Maintain consistency'
                },
                {
                    id: 'leaderboards',
                    label: 'Leaderboards',
                    icon: <FaChartLine />,
                    description: 'Compete with others'
                },
                {
                    id: 'mastery',
                    label: 'Mastery',
                    icon: <FaGraduationCap />,
                    description: 'Deep understanding'
                }
            ]
        },
        {
            type: 'selection',
            title: 'Preferred study time',
            subtitle: 'When are you most productive?',
            options: [
                {
                    id: 'morning',
                    label: 'Morning',
                    icon: <FaSun />,
                    description: '6 AM – 12 PM'
                },
                {
                    id: 'afternoon',
                    label: 'Afternoon',
                    icon: <FaSun />,
                    description: '12 PM – 6 PM'
                },
                {
                    id: 'evening',
                    label: 'Evening',
                    icon: <FaMoon />,
                    description: '6 PM – 10 PM'
                },
                {
                    id: 'night',
                    label: 'Night',
                    icon: <FaMoon />,
                    description: '10 PM – 2 AM'
                }
            ]
        },
        {
            type: 'selection',
            title: 'Problem-solving preference',
            subtitle: 'How much guidance do you want?',
            options: [
                {
                    id: 'hints-please',
                    label: 'Full guidance',
                    icon: <FaLightbulb />,
                    description: 'Step-by-step hints'
                },
                {
                    id: 'some-help',
                    label: 'Moderate help',
                    icon: <FaBrain />,
                    description: 'Hints only when needed'
                },
                {
                    id: 'minimal',
                    label: 'Minimal hints',
                    icon: <FaTrophy />,
                    description: 'Mostly solve on your own'
                },
                {
                    id: 'hardcore',
                    label: 'No hints',
                    icon: <FaFire />,
                    description: 'Pure challenge'
                }
            ]
        },
        {
            type: 'final',
            title: 'Setup Complete',
            subtitle: 'Your personalized learning path is ready',
            description:
                "We've configured your experience based on your preferences. Let's begin your journey.",
            icon: (
                <FaRocket className="text-5xl text-[var(--accent-color)]" />
            )
        }
    ];

    const handleSelection = (optionId) => {
        const stepType = steps[currentStep].type;

        if (stepType === 'multi-selection') {
            const currentSelections = selectedOptions[currentStep] || [];
            const isSelected = currentSelections.includes(optionId);

            setSelectedOptions({
                ...selectedOptions,
                [currentStep]: isSelected
                    ? currentSelections.filter(id => id !== optionId)
                    : [...currentSelections, optionId]
            });

            return;
        }

        setSelectedOptions({
            ...selectedOptions,
            [currentStep]: optionId
        });
    };

    const buildOnboardingSettings = () => ({
        completed: true,
        completedAt: new Date().toISOString(),

        goal: selectedOptions[1] || null,
        topics: selectedOptions[2] || [],
        level: selectedOptions[3] || null,
        learningStyle: selectedOptions[4] || null,
        dailyTime: selectedOptions[5] || null,
        motivation: selectedOptions[6] || null,
        preferredStudyTime: selectedOptions[7] || null,
        problemSolvingPreference: selectedOptions[8] || null
    });
    const saveQuestionnaire = async () => {
        setSaving(true);

        try {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error('User not authenticated.');

            const { data: existingSettings, error: settingsError } = await supabase
                .from('user_settings')
                .select('id, settings')
                .eq('user_id', user.id)
                .single();

            if (settingsError && settingsError.code !== 'PGRST116') {
                throw settingsError;
            }

            const updatedSettings = {
                ...(existingSettings?.settings || {}),
                onboarding: buildOnboardingSettings()
            };

            if (existingSettings) {
                const { error } = await supabase
                    .from('user_settings')
                    .update({
                        settings: updatedSettings,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('user_settings')
                    .insert({
                        user_id: user.id,
                        settings: updatedSettings
                    });

                if (error) throw error;
            }

            return true;
        } catch (err) {
            console.error('Error saving onboarding:', err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleContinue = async () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            return;
        }

        const success = await saveQuestionnaire();

        if (success) {
            navigate('/discover');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canContinue = () => {
        const stepType = steps[currentStep].type;

        if (stepType === 'welcome' || stepType === 'final') {
            return true;
        }

        if (stepType === 'multi-selection') {
            return (selectedOptions[currentStep] || []).length > 0;
        }

        return selectedOptions[currentStep] !== undefined;
    };

    const currentStepData = steps[currentStep];

    return (
        <main className='flex flex-col w-full bg-[var(--main-color)] min-h-screen items-center justify-center px-4 sm:px-6 py-6 font-[Sansation]'>
            {/* Progress Bar Section */}
            <div className='w-full max-w-xl flex flex-col gap-3 pb-6'>
                <div className='flex items-center gap-3'>
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className='p-2 rounded-md hover:bg-[var(--french-gray)] transition-colors duration-200 text-[var(--secondary-color)] cursor-pointer'
                            aria-label='Go back'
                        >
                            <FaArrowLeft className='text-lg' />
                        </button>
                    )}

                    <div className='flex-1 h-1.5 bg-[var(--french-gray)] rounded-full overflow-hidden'>
                        <div
                            className='h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 ease-out'
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <span className='text-xs font-medium text-[var(--secondary-color)] opacity-50 min-w-[50px] text-right'>
                        {currentStep + 1} / {totalSteps}
                    </span>
                </div>
            </div>
            {/* Content Section */}
            <article className='flex flex-col items-center justify-around flex-1 w-full max-w-xl text-center'>
                <div className='w-full'>
                    <div className='flex flex-col gap-2 pb-2 pt-20 min-h-[140px]'>
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

                    {(currentStepData.type === 'selection' ||
                        currentStepData.type === 'multi-selection') && (
                        <div className='w-full pt-6 pb-6 min-h-[260px] sm:min-h-[300px] flex flex-col justify-start'>
                            {currentStepData.type === 'selection' && (
                                <div className='flex flex-col gap-2 w-full'>
                                    {currentStepData.options.map((option) => (
                                        <button
                                            key={option.id}
                                            type='button'
                                            onClick={() => handleSelection(option.id)}
                                            className={`group flex items-center gap-2.5 p-2.5 rounded-md border-2 duration-200 cursor-pointer text-left ${
                                                selectedOptions[currentStep] === option.id
                                                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                                    : 'border-[var(--mid-main-secondary)] bg-[var(--white)] text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                            }`}
                                        >
                                            <div className='text-lg flex-shrink-0'>
                                                {option.icon}
                                            </div>

                                            <div className='flex-1'>
                                                <div className='font-semibold text-xs'>
                                                    {option.label}
                                                </div>

                                                {option.description && (
                                                    <div
                                                        className={`text-[11px] pt-0.5 leading-tight ${
                                                            selectedOptions[currentStep] === option.id
                                                                ? 'opacity-90'
                                                                : 'opacity-50'
                                                        }`}
                                                    >
                                                        {option.description}
                                                    </div>
                                                )}
                                            </div>

                                            <div className='text-base w-4 flex justify-center'>
                                                {selectedOptions[currentStep] === option.id
                                                    ? '✓'
                                                    : ''}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStepData.type === 'multi-selection' && (
                                <div className='grid grid-cols-2 gap-2 w-full'>
                                    {currentStepData.options.map((option) => {
                                        const isSelected = (
                                            selectedOptions[currentStep] || []
                                        ).includes(option.id);

                                        return (
                                            <button
                                                key={option.id}
                                                type='button'
                                                onClick={() =>
                                                    handleSelection(option.id)
                                                }
                                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border-2 transition-colors duration-200 cursor-pointer ${
                                                    isSelected
                                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                                        : 'border-[var(--mid-main-secondary)] bg-[var(--white)] text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                                }`}
                                            >
                                                <div className='text-lg'>
                                                    {option.icon}
                                                </div>

                                                <div className='flex-1 text-left text-xs font-semibold leading-tight'>
                                                    {option.label}
                                                </div>

                                                <div className='w-4 flex justify-center'>
                                                    {isSelected ? '✓' : ''}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {currentStepData.type === 'welcome' && (
                        <img
                            src={WelcomeTeacher}
                            alt='Teacher'
                        />
                    )}

                    <button
                        onClick={handleContinue}
                        disabled={!canContinue() || saving}
                        className={`w-60 px-8 py-3 rounded-full font-semibold text-sm ${
                            canContinue() && !saving
                                ? 'bg-[var(--secondary-color)] text-[var(--white)] hover:bg-[var(--secondary-color)]/90 shadow-[0px_4px_0px_rgb(43,45,66,0.6)] active:shadow-none active:scale-95 cursor-pointer transition-all'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                    >
                        {saving
                            ? 'Saving...'
                            : currentStep === totalSteps - 1
                                ? 'Start Learning'
                                : 'Continue'}
                    </button>
                </div>
            </article>
        </main>
    );
};

export default GetStarted;