import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaChartLine,
    FaFire,
    FaBook,
    FaSquareRootAlt,
    FaClock,
    FaLightbulb,
    FaCoffee,
    FaChartBar,
    FaArrowLeft,
    FaRocket,
    FaTrophy,
    FaGraduationCap,
    FaBrain,
    FaChalkboardTeacher
} from 'react-icons/fa';
import { MdTimeline } from 'react-icons/md';
import { BiMath } from 'react-icons/bi';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import WelcomeTeacher from '../assets/images/welcomeTeacher.svg';

const GetStarted = () => {
    const navigate = useNavigate();
    const { refreshOnboardingStatus } = useAuth();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [saving, setSaving] = useState(false);

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
                    description: 'Learn, explore mathematics, and get ready for upcoming teacher tools.'
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
                { id: 'algebra', label: 'Algebra', icon: <BiMath /> },
                { id: 'geometry', label: 'Geometry', icon: <FaSquareRootAlt /> },
                { id: 'number_theory', label: 'Number Theory', icon: <FaBook /> },
                { id: 'combinatorics', label: 'Combinatorics', icon: <FaBrain /> },
                { id: 'calculus', label: 'Calculus', icon: <FaChartLine /> },
                { id: 'probability', label: 'Probability', icon: <FaChartBar /> }
            ]
        },
        {
            type: 'selection',
            title: 'How would you rate your current level?',
            subtitle: 'This is only a starting point - we will adapt as you solve problems',
            options: [
                { id: 'beginner', label: 'Beginner', icon: <FaBook />, description: 'Just getting started' },
                { id: 'intermediate', label: 'Intermediate', icon: <FaBrain />, description: 'Comfortable with the basics' },
                { id: 'advanced', label: 'Advanced', icon: <FaChartLine />, description: 'Enjoy solving difficult problems' },
                { id: 'competitive', label: 'Competitive', icon: <FaRocket />, description: 'Looking for olympiad-level challenges' }
            ]
        },
        {
            type: 'selection',
            title: 'How much time can you study each week?',
            subtitle: "We'll build recommendations that fit your schedule",
            options: [
                { id: 'under-1', label: 'Less than 1 hour', icon: <FaCoffee />, description: 'A few short sessions' },
                { id: '1-3', label: '1–3 hours', icon: <FaClock />, description: 'Steady weekly progress' },
                { id: '3-6', label: '3–6 hours', icon: <MdTimeline />, description: 'Consistent practice' },
                { id: '6+', label: '6+ hours', icon: <FaRocket />, description: 'Serious commitment' }
            ]
        },
        {
            type: 'selection',
            title: 'What level of challenge do you enjoy?',
            subtitle: 'Choose the experience you prefer',
            options: [
                { id: 'easy', label: 'Build Confidence', icon: <FaBook />, description: 'Mostly easier problems' },
                { id: 'balanced', label: 'Balanced', icon: <FaBrain />, description: 'A mix of easy and difficult' },
                { id: 'challenging', label: 'Challenge Me', icon: <FaChartLine />, description: 'Mostly difficult problems' },
                { id: 'extreme', label: 'Push Me to My Limits', icon: <FaFire />, description: 'Give me the hardest problems' }
            ]
        },
        {
            type: 'final',
            title: "You're all set!",
            description: "We'll use your answers as a starting point and continuously adapt recommendations based on your progress.",
            icon: <FaRocket className="text-5xl text-[var(--accent-color)]" />
        }
    ];

    useEffect(() => {
        const fetchExistingOnboardingData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Fetch Profile Role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                const role = profile?.role || 'student';

                // 2. Fetch Student Data
                const { data: studentData } = await supabase
                    .from('student_profile')
                    .select('goal, level, weekly_commitment, preferred_challenge')
                    .eq('id', user.id)
                    .maybeSingle();

                // 3. Fetch Selected Topics
                const { data: topicData } = await supabase
                    .from('student_topics')
                    .select('topic')
                    .eq('student_id', user.id);

                const topics = topicData ? topicData.map(t => t.topic) : [];

                // Pre-fill state based on step indices (1 to 6)
                setSelectedOptions({
                    1: role,
                    2: studentData?.goal || undefined,
                    3: topics,
                    4: studentData?.level || undefined,
                    5: studentData?.weekly_commitment || undefined,
                    6: studentData?.preferred_challenge || undefined
                });
            } catch (err) {
                console.error("Error fetching existing onboarding data:", err);
            }
        };

        fetchExistingOnboardingData();
    }, []);

    const totalSteps = steps.length;
    const percentage = ((currentStep + 1) / totalSteps) * 100;

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

            const selectedRole = selectedOptions[1] || 'student';

            const { error: roleError } = await supabase
                .from('profiles')
                .update({
                    role: selectedRole,
                    onboarding_completed: true
                })
                .eq('id', user.id);

            if (roleError) throw roleError;

            const { error: profileError } = await supabase
                .from('student_profile')
                .upsert(
                    {
                        id: user.id,
                        onboarding_completed: true,
                        onboarding_completed_at: new Date().toISOString(),
                        goal: selectedOptions[2] || null,
                        level: selectedOptions[4] || null,
                        weekly_commitment: selectedOptions[5] || null,
                        preferred_challenge: selectedOptions[6] || null
                    },
                    { onConflict: 'id' }
                );

            if (profileError) throw profileError;

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
            await refreshOnboardingStatus();
            navigate('/dashboard', { replace: true });
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
    const imageSrc = typeof WelcomeTeacher === 'string' ? WelcomeTeacher : WelcomeTeacher?.default || WelcomeTeacher;

    return (
        <main className='relative flex flex-col w-full bg-[var(--main-color)] h-screen overflow-hidden items-center justify-center px-4 sm:px-6 font-[Sansation,sans-serif]'>

            {/* 1. PROGRESS BAR PINNED TO THE VERY TOP */}
            <header className='absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 flex flex-col gap-2 z-10'>
                <div className='flex items-center gap-3 w-full'>
                    <div className='w-8 flex justify-start'>
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                className='p-2 rounded-md hover:bg-[var(--french-gray)] transition-colors duration-200 text-[var(--secondary-color)] cursor-pointer'
                                aria-label='Go back'
                            >
                                <FaArrowLeft className='text-lg' />
                            </button>
                        )}
                    </div>

                    <div className='flex-1 h-1.5 bg-[var(--french-gray)] rounded-full overflow-hidden'>
                        <div
                            className='h-full rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--dark-accent-color)] transition-all duration-500 ease-out'
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <span className='text-xs font-medium text-[var(--secondary-color)] opacity-50 w-10 text-right'>
                        {currentStep + 1} / {totalSteps}
                    </span>
                </div>

                <div className="text-center text-[var(--secondary-color)] opacity-70 text-xs sm:text-sm">
                    Don't worry - you can change these answers whenever you like.
                </div>
            </header>

            {/* 2. FIXED HEIGHT CONTAINER (PREVENTS PAGE RESIZING) */}
            <div className='w-full max-w-xl h-[580px] flex flex-col justify-between items-center mt-12'>

                {/* Question Title & Subtitle Section */}
                <div className='flex flex-col items-center justify-center text-center h-[100px] w-full'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-[var(--secondary-color)] line-clamp-1 relative'>
                        {currentStepData.title}
                    </h1>

                    <p className='text-sm sm:text-base text-[var(--secondary-color)] pt-1 line-clamp-1'>
                        {currentStepData.subtitle}
                    </p>

                    {currentStepData.description && (
                        <p className='text-xs sm:text-sm text-[var(--secondary-color)] opacity-80 pt-1 max-w-md line-clamp-2'>
                            {currentStepData.description}
                        </p>
                    )}
                </div>

                {/* 3. CENTERED FIXED CONTENT SLOT */}
                <div className='w-full h-[340px] flex flex-col justify-center items-center'>

                    {/* Welcome Step Illustration */}
                    {currentStepData.type === 'welcome' && (
                        <div className='h-full flex items-center justify-center w-full'>
                            <img
                                src={imageSrc}
                                alt="Welcome to Equathora Illustration"
                                className='max-h-100 w-auto object-contain mx-auto rounded-md'
                            />
                        </div>
                    )}

                    {/* Options Grid (Selection & Multi-selection) */}
                    {(currentStepData.type === 'selection' || currentStepData.type === 'multi-selection') && (
                        <div className='w-full flex items-center justify-center h-full'>
                            {currentStepData.type === 'selection' && (
                                <div className='flex flex-col gap-2.5 w-full justify-center'>
                                    {currentStepData.options.map((option) => (
                                        <button
                                            key={option.id}
                                            type='button'
                                            onClick={() => handleSelection(option.id)}
                                            className={`group flex items-center gap-3 p-3.5 rounded-lg border-2 transition-all duration-200 cursor-pointer text-left ${selectedOptions[currentStep] === option.id
                                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white shadow-sm'
                                                : 'border-[var(--mid-main-secondary)] bg-[var(--white)] text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                                }`}
                                        >
                                            <div className='md:text-xl flex-shrink-0 text-lg'>
                                                {option.icon}
                                            </div>

                                            <div className='flex-1'>
                                                <div className='font-semibold text-sm md:text-base'>
                                                    {option.label}
                                                </div>

                                                {option.description && (
                                                    <div
                                                        className={`text-xs md:text-sm pt-0.5 leading-tight ${selectedOptions[currentStep] === option.id
                                                            ? 'opacity-90'
                                                            : 'opacity-60'
                                                            }`}
                                                    >
                                                        {option.description}
                                                    </div>
                                                )}
                                            </div>

                                            <div className='text-base w-5 flex justify-center font-bold'>
                                                {selectedOptions[currentStep] === option.id ? '✓' : ''}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStepData.type === 'multi-selection' && (
                                <div className='grid grid-cols-2 gap-3 w-full justify-center'>
                                    {currentStepData.options.map((option) => {
                                        const isSelected = (
                                            selectedOptions[currentStep] || []
                                        ).includes(option.id);

                                        return (
                                            <button
                                                key={option.id}
                                                type='button'
                                                onClick={() => handleSelection(option.id)}
                                                className={`flex items-center justify-center gap-2.5 px-3.5 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isSelected
                                                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white shadow-sm'
                                                    : 'border-[var(--mid-main-secondary)] bg-[var(--white)] text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                                    }`}
                                            >
                                                <div className='text-lg flex-shrink-0'>
                                                    {option.icon}
                                                </div>

                                                <div className='flex-1 text-left text-xs sm:text-sm font-semibold leading-tight'>
                                                    {option.label}
                                                </div>

                                                <div className='w-4 flex justify-center font-bold'>
                                                    {isSelected ? '✓' : ''}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Final Step Icon Display */}
                    {currentStepData.type === 'final' && (
                        <div className='h-full flex items-center justify-center w-full'>
                            {currentStepData.icon}
                        </div>
                    )}
                </div>

                {/* 4. CONTINUE BUTTON FIXED POSITION AT THE BOTTOM */}
                <div className='h-[60px] w-full flex justify-center items-center'>
                    <button
                        onClick={handleContinue}
                        disabled={!canContinue() || saving}
                        className={`w-60 px-8 py-3 rounded-full font-semibold text-sm transition-all ${canContinue() && !saving
                            ? 'bg-[var(--secondary-color)] text-[var(--white)] hover:bg-[var(--secondary-color)]/90 shadow-[0px_4px_0px_rgb(43,45,66,0.6)] active:shadow-none active:translate-y-1 cursor-pointer'
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
            </div>
        </main>
    );
};

export default GetStarted;