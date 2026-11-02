import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    FaChalkboardTeacher,
    FaHome
} from 'react-icons/fa';
import { MdTimeline } from 'react-icons/md';
import { BiMath } from 'react-icons/bi';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import WelcomeTeacher from '../assets/images/welcomeTeacher.svg';
import PrimaryButton from '../components/ui/Buttons/PrimaryButton';

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
                    icon: <FaGraduationCap className='text-purple-700' />,
                    description: 'Solve problems, improve your skills and track your progress.'
                },
                {
                    id: 'parent',
                    label: 'Parent',
                    icon: <FaHome className='text-pink-500' />,
                    description: 'Support your learner and follow their progress.'
                },
                {
                    id: 'teacher',
                    label: 'Teacher',
                    icon: <FaChalkboardTeacher className='text-teal-700' />,
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
                { id: '1-3', label: '1-3 hours', icon: <FaClock />, description: 'Steady weekly progress' },
                { id: '3-6', label: '3-6 hours', icon: <MdTimeline />, description: 'Consistent practice' },
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
            icon: <FaRocket className="text-5xl text-(--accent-color)" />
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
        <main className='flex min-h-screen w-full flex-col items-center overflow-y-auto bg-(--white) px-4 text-(--secondary-color) sm:px-6'>
            <header className='relative flex w-full max-w-3xl justify-center pt-9 sm:pt-10'>
                {currentStep > 0 && (
                    <button
                        type='button'
                        onClick={handleBack}
                        className='absolute left-0 top-7 rounded-full p-2 text-(--secondary-color) transition-colors hover:bg-[#f4f4f4]'
                        aria-label='Go back'
                    >
                        <FaArrowLeft className='text-lg' />
                    </button>
                )}
                <div
                    className='h-2.5 w-full max-w-md overflow-hidden rounded-full bg-[#f2f2f2]'
                    role='progressbar'
                    aria-label='Onboarding progress'
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(percentage)}
                >
                    <div
                        className='h-full rounded-full bg-(--beginner) transition-all duration-500 ease-out'
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </header>

            <section className='flex w-full max-w-2xl flex-1 flex-col justify-center gap-7 py-8 sm:gap-9 sm:py-10'>
                <div className={`flex w-full items-center justify-center ${currentStepData.type === 'selection' || currentStepData.type === 'multi-selection' ? 'gap-3 sm:gap-5' : 'flex-col text-center'}`}>
                    {(currentStepData.type === 'selection' || currentStepData.type === 'multi-selection') && (
                        <img
                            src={imageSrc}
                            alt=''
                            aria-hidden='true'
                            className='h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20'
                        />
                    )}
                    <div className={`max-w-xl ${currentStepData.type === 'selection' || currentStepData.type === 'multi-selection'
                        ? 'rounded-3xl border-2 border-[#e7e7e7] bg-(--white) px-4 py-3 text-left sm:px-5 sm:py-4'
                        : 'text-center'}`}>
                        <h1 className='text-xl font-semibold leading-tight sm:text-2xl'>
                            {currentStepData.title}
                        </h1>
                        {currentStepData.subtitle && (
                            <p className='pt-1 text-sm text-(--secondary-color) opacity-70 sm:text-base'>
                                {currentStepData.subtitle}
                            </p>
                        )}
                        {currentStepData.description && (
                            <p className='mx-auto max-w-md pt-2 text-sm text-(--secondary-color) opacity-80 sm:text-base'>
                                {currentStepData.description}
                            </p>
                        )}
                    </div>
                </div>

                {currentStepData.type === 'welcome' && (
                    <div className='flex w-full justify-center'>
                        <img
                            src={imageSrc}
                            alt='Welcome to Equathora'
                            className='max-h-56 w-auto object-contain sm:max-h-64'
                        />
                    </div>
                )}

                {(currentStepData.type === 'selection' || currentStepData.type === 'multi-selection') && (
                    <div className='grid w-full grid-cols-2 gap-3 sm:gap-4'>
                        {currentStepData.options.map((option, index) => {
                            const isMultiSelection = currentStepData.type === 'multi-selection';
                            const isSelected = isMultiSelection
                                ? (selectedOptions[currentStep] || []).includes(option.id)
                                : selectedOptions[currentStep] === option.id;
                            const isCenteredLastOption =
                                currentStepData.options.length % 2 !== 0 &&
                                index === currentStepData.options.length - 1;

                            return (
                                <button
                                    key={option.id}
                                    type='button'
                                    onClick={() => handleSelection(option.id)}
                                    aria-pressed={isSelected}
                                    className={`flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 bg-[#f4f4f4] px-3 py-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isCenteredLastOption ? 'col-span-2 w-1/2 justify-self-center' : ''
                                        } ${isSelected
                                            ? 'border-(--accent-color) bg-[#fff4f5] shadow-sm'
                                            : 'border-transparent hover:border-[#dedede]'
                                        }`}
                                >
                                    <span className='mb-2 text-3xl sm:text-4xl'>
                                        {option.icon}
                                    </span>
                                    <span className='text-sm font-semibold sm:text-base'>
                                        {option.label}
                                    </span>
                                    {option.description && (
                                        <span className='mt-1.5 max-w-xs text-xs leading-snug opacity-65 sm:text-sm'>
                                            {option.description}
                                        </span>
                                    )}
                                    {isSelected && (
                                        <span className='sr-only'>Selected</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {currentStepData.type === 'final' && (
                    <div className='flex justify-center py-2'>
                        {currentStepData.icon}
                    </div>
                )}
            </section>

            <footer className='flex w-full max-w-2xl flex-col items-center gap-4 pb-8 sm:gap-5 sm:pb-10'>
                {saveError && (
                    <p className='w-full text-center text-sm text-red-500' role='alert'>
                        {saveError}
                    </p>
                )}
                <div className='flex w-full justify-end'>
                    <PrimaryButton
                        text={saving
                            ? 'Preparing your journey'
                            : currentStep === totalSteps - 1
                                ? 'Start Learning'
                                : 'Continue'}
                        onClick={handleContinue}
                        disabled={!canContinue() || saving}
                        arrow
                        className='min-w-32 rounded-full px-6 py-2.5 text-sm sm:px-8'
                    />
                </div>
                <p className='text-center text-sm text-(--secondary-color) opacity-70 sm:text-base'>
                    Already have an account?{' '}
                    <Link to='/login' className='underline underline-offset-2 hover:opacity-80'>
                        Sign in
                    </Link>
                </p>
            </footer>
        </main>
    );
};

export default GetStarted;