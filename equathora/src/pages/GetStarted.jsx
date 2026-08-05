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
    const [saveError, setSaveError] = useState('');

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

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .maybeSingle();

                const role = profile?.role || 'student';

                const { data: studentData } = await supabase
                    .from('student_profile')
                    .select('goal, level, weekly_commitment, preferred_challenge')
                    .eq('id', user.id)
                    .maybeSingle();

                const { data: topicData } = await supabase
                    .from('student_topics')
                    .select('topic')
                    .eq('student_id', user.id);

                const topics = topicData ? topicData.map(t => t.topic) : [];

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

            const { error: roleError } = await supabase.rpc('complete_onboarding', {
                p_role: selectedRole
            });

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

        setSaveError('');
        const success = await saveQuestionnaire();

        if (success) {
            await refreshOnboardingStatus();
            navigate('/journey', { replace: true });
        } else {
            setSaveError("Something went wrong saving your answers. Please try again, or contact support if this keeps happening.");
        }
    };

    const handleBack = () => {
        setSaveError('');
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
        <main className='relative flex flex-col w-full bg-[var(--main-color)] min-h-screen h-full overflow-y-auto items-center px-4 sm:px-6 font-[Sansation,sans-serif]'>

            {/* Progress bar — sticky instead of absolute, so it always stays
                pinned above the content instead of overlapping it when the
                viewport is short. */}
            <header className='sticky top-0 z-20 w-full max-w-xl px-4 pt-4 pb-2 flex flex-col gap-2 bg-[var(--main-color)]'>
                <div className='flex items-center gap-3 w-full'>
                    <div className='w-8 flex justify-start shrink-0'>
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

                    <span className='text-xs font-medium text-[var(--secondary-color)] opacity-50 w-10 text-right shrink-0'>
                        {currentStep + 1} / {totalSteps}
                    </span>
                </div>

                <div className="text-center text-[var(--secondary-color)] opacity-70 text-xs sm:text-sm px-2">
                    Don't worry - you can change these answers whenever you like.
                </div>
            </header>

            {/* Main content column. min-h instead of a fixed h so it can grow
                on short/narrow viewports instead of clipping; content still
                centers within it on tall viewports via justify-between +
                flex-1 spacers. */}
            <div className='w-full max-w-xl flex-1 flex flex-col justify-between items-center py-4 sm:py-6'>

                <div className='flex flex-col items-center justify-center text-center w-full px-2 min-h-[64px] sm:min-h-[80px]'>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-[var(--secondary-color)]'>
                        {currentStepData.title}
                    </h1>

                    <p className='text-xs sm:text-sm md:text-base text-[var(--secondary-color)] pt-1'>
                        {currentStepData.subtitle}
                    </p>

                    {currentStepData.description && (
                        <p className='text-xs sm:text-sm text-[var(--secondary-color)] opacity-80 pt-1 max-w-md'>
                            {currentStepData.description}
                        </p>
                    )}
                </div>

                <div className='w-full flex-1 flex flex-col justify-center items-center py-4 min-h-0'>

                    {currentStepData.type === 'welcome' && (
                        <div className='h-full w-full flex items-center justify-center min-h-[160px]'>
                            <img
                                src={imageSrc}
                                alt="Welcome to Equathora Illustration"
                                className='max-h-100 w-auto object-contain mx-auto rounded-md'
                            />
                        </div>
                    )}

                    {(currentStepData.type === 'selection' || currentStepData.type === 'multi-selection') && (
                        <div className='w-full flex items-center justify-center'>
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

                                            <div className='flex-1 min-w-0'>
                                                <div className='font-semibold text-sm md:text-base break-words'>
                                                    {option.label}
                                                </div>

                                                {option.description && (
                                                    <div
                                                        className={`text-xs md:text-sm pt-0.5 leading-tight break-words ${selectedOptions[currentStep] === option.id
                                                            ? 'opacity-90'
                                                            : 'opacity-60'
                                                            }`}
                                                    >
                                                        {option.description}
                                                    </div>
                                                )}
                                            </div>

                                            <div className='text-base w-5 flex-shrink-0 flex justify-center font-bold'>
                                                {selectedOptions[currentStep] === option.id ? '✓' : ''}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStepData.type === 'multi-selection' && (
                                <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 w-full justify-center'>
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

                                                <div className='flex-1 min-w-0 text-left text-xs sm:text-sm font-semibold leading-tight break-words'>
                                                    {option.label}
                                                </div>

                                                <div className='w-4 flex-shrink-0 flex justify-center font-bold'>
                                                    {isSelected ? '✓' : ''}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {currentStepData.type === 'final' && (
                        <div className='h-full flex items-center justify-center w-full min-h-[100px]'>
                            {currentStepData.icon}
                        </div>
                    )}
                </div>

                {saveError && (
                    <div className='w-full px-2 pb-2'>
                        <p className='text-xs sm:text-sm text-red-500 text-center break-words'>
                            {saveError}
                        </p>
                    </div>
                )}

                <div className='w-full flex justify-center items-center py-2'>
                    <button
                        onClick={handleContinue}
                        disabled={!canContinue() || saving}
                        className={`w-60 max-w-full px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-all ${canContinue() && !saving
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