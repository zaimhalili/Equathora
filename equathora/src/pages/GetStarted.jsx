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
    FaBrain,
    FaChalkboardTeacher
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

const GetStarted = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [saving, setSaving] = useState(false);

    const totalSteps = 8;
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
            description: null
        },
        {
            type: 'selection',
            title: 'Who are you?',
            subtitle: "We'll tailor Equathora to your role.",
            options: [
                {
                    id: 'student',
                    label: 'Student',
                    icon: <FaGraduationCap />,
                    description: 'Solve problems, improve your skills and track your progress.'
                },
                {
                    id: 'teacher',
                    label: 'Teacher',
                    icon: <FaChalkboardTeacher />,
                    description: 'Create classes, assign work and monitor your students.'
                }
            ]
        },
        {
            type: 'selection',
            title: "What's your main goal?",
            subtitle: 'Choose the reason you joined Equathora',
            options: [
                {
                    id: 'school',
                    label: 'School & University',
                    icon: <FaGraduationCap />,
                    description: 'Improve grades and prepare for classes'
                },
                {
                    id: 'competitions',
                    label: 'Math Competitions',
                    icon: <FaTrophy />,
                    description: 'Train for olympiads and contests'
                },
                {
                    id: 'problem-solving',
                    label: 'Problem Solving',
                    icon: <FaBrain />,
                    description: 'Become a stronger mathematical thinker'
                },
                {
                    id: 'fun',
                    label: 'Learn for Fun',
                    icon: <FaLightbulb />,
                    description: 'Explore mathematics at your own pace'
                }
            ]
        },
        {
            type: 'multi-selection',
            title: 'Which topics interest you?',
            subtitle: 'Choose all that you enjoy or want to improve',
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
                    id: 'number_theory',
                    label: 'Number Theory',
                    icon: <FaBook />
                },
                {
                    id: 'combinatorics',
                    label: 'Combinatorics',
                    icon: <FaBrain />
                },
                {
                    id: 'calculus',
                    label: 'Calculus',
                    icon: <FaChartLine />
                },
                {
                    id: 'probability',
                    label: 'Probability',
                    icon: <FaChartBar />
                }
            ]
        },
        {
            type: 'selection',
            title: 'How would you rate your current level?',
            subtitle: 'This is only a starting point - we will adapt as you solve problems',
            options: [
                {
                    id: 'beginner',
                    label: 'Beginner',
                    icon: <FaBook />,
                    description: 'Just getting started'
                },
                {
                    id: 'intermediate',
                    label: 'Intermediate',
                    icon: <FaBrain />,
                    description: 'Comfortable with the basics'
                },
                {
                    id: 'advanced',
                    label: 'Advanced',
                    icon: <FaChartLine />,
                    description: 'Enjoy solving difficult problems'
                },
                {
                    id: 'competitive',
                    label: 'Competitive',
                    icon: <FaRocket />,
                    description: 'Looking for olympiad-level challenges'
                }
            ]
        },
        {
            type: 'selection',
            title: 'How much time can you study each week?',
            subtitle: "We'll build recommendations that fit your schedule",
            options: [
                {
                    id: 'under-1',
                    label: 'Less than 1 hour',
                    icon: <FaCoffee />,
                    description: 'A few short sessions'
                },
                {
                    id: '1-3',
                    label: '1–3 hours',
                    icon: <FaClock />,
                    description: 'Steady weekly progress'
                },
                {
                    id: '3-6',
                    label: '3–6 hours',
                    icon: <MdTimeline />,
                    description: 'Consistent practice'
                },
                {
                    id: '6+',
                    label: '6+ hours',
                    icon: <FaRocket />,
                    description: 'Serious commitment'
                }
            ]
        },
        {
            type: 'selection',
            title: 'What level of challenge do you enjoy?',
            subtitle: 'Choose the experience you prefer',
            options: [
                {
                    id: 'easy',
                    label: 'Build Confidence',
                    icon: <FaBook />,
                    description: 'Mostly easier problems'
                },
                {
                    id: 'balanced',
                    label: 'Balanced',
                    icon: <FaBrain />,
                    description: 'A mix of easy and difficult'
                },
                {
                    id: 'challenging',
                    label: 'Challenge Me',
                    icon: <FaChartLine />,
                    description: 'Mostly difficult problems'
                },
                {
                    id: 'extreme',
                    label: 'Push Me to My Limits',
                    icon: <FaFire />,
                    description: 'Give me the hardest problems'
                }
            ]
        },
        {
            type: 'final',
            title: "You're all set!",
            subtitle: 'Your personalized learning journey is ready',
            description:
                "We'll use your answers as a starting point and continuously adapt recommendations based on your progress.",
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

    const saveQuestionnaire = async () => {
        setSaving(true);

        try {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error('User not authenticated.');

            // Update role
            const { error: roleError } = await supabase
                .from('profiles')
                .update({
                    role: selectedOptions[1]
                })
                .eq('id', user.id);

            if (roleError) throw roleError;

            const { error: profileError } = await supabase
                .from('student_profile')
                .upsert({
                    id: user.id,

                    onboarding_completed: true,
                    onboarding_completed_at: new Date().toISOString(),

                    goal: selectedOptions[2],
                    level: selectedOptions[4],
                    weekly_commitment: selectedOptions[5],
                    preferred_challenge: selectedOptions[6]
                });

            if (profileError) throw profileError;

            // Save topics
            const { error: deleteTopicsError } = await supabase
                .from('student_topics')
                .delete()
                .eq('student_id', user.id);

            if (deleteTopicsError) throw deleteTopicsError;

            const topics = (selectedOptions[3] || []).map(topic => ({
                student_id: user.id,
                topic
            }));

            if (topics.length > 0) {
                const { error: topicsError } = await supabase
                    .from('student_topics')
                    .insert(topics);

                if (topicsError) throw topicsError;
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
            navigate('/journey');
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
        <main className='flex flex-col w-full bg-[var(--main-color)] min-h-screen items-center justify-center px-4 sm:px-6 py-6 font-[Sansation,sans-serif]'>
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
                <div className="text-center text-[var(--secondary-color)] opacity-70 text-sm">Don't worry - you can change these answers whenever you like.</div>
            </div>
            {/* Content Section */}
            <article className='flex flex-col items-center justify-around flex-1 w-full max-w-xl text-center'>
                <div className='w-full'>
                    <div className='flex flex-col pb-10 pt-10 min-h-[140px] relative'>
                        {currentStepData.icon && (
                            <div className='pb-2 absolute top-0 left-0'>
                                {currentStepData.icon}
                            </div>
                        )}

                        <h1 className='text-2xl sm:text-3xl font-bold text-[var(--secondary-color)] pb-1'>
                            {currentStepData.title}
                        </h1>

                        <p className='text-sm sm:text-base text-[var(--secondary-color)]'>
                            {currentStepData.subtitle}
                        </p>

                        {currentStepData.description && (
                            <p className='text-xs sm:text-sm text-[var(--secondary-color)] opacity-80 pt-3'>
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
                        />
                    )}

                    <button
                        onClick={handleContinue}
                        disabled={!canContinue() || saving}
                        className={`w-60 px-8 py-3 rounded-full font-semibold text-sm ${
                            canContinue() && !saving
                                ? 'bg-[var(--secondary-color)] text-[var(--white)] hover:bg-[var(--secondary-color)]/90 shadow-[0px_4px_0px_rgb(43,45,66,0.6)] active:shadow-none active:translate-y-1 cursor-pointer transition-all'
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