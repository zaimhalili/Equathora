import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { ClassAnalyticsPreview, ScoreReportPreview, StudyPlanPreview } from './FeaturePreviews';

const MotionArticle = motion.article;

const features = [
    {
        number: '01',
        title: 'Understand every learner’s progress',
        description: 'Turn practice history into a clearer picture of what students understand and where a little more support could help.',
        bullets: ['Track confidence as well as accuracy', 'Spot recurring misconceptions sooner', 'Make progress easier to discuss'],
        Preview: ScoreReportPreview
    },
    {
        number: '02',
        title: 'See the whole class at a glance',
        description: 'Bring class activity and topic-level patterns together, so planning the next lesson feels more informed.',
        bullets: ['Find topics that need a second look', 'Recognize class-wide strengths', 'Keep an eye on learning over time'],
        Preview: ClassAnalyticsPreview,
        reversed: true
    },
    {
        number: '03',
        title: 'Make the next step personal',
        description: 'Help learners move forward with a practical plan that reflects their strengths, goals, and areas to practice.',
        bullets: ['Build from each student’s current level', 'Balance review with new challenges', 'Celebrate steady, meaningful progress'],
        Preview: StudyPlanPreview
    }
];

const FeatureShowcase = () => (
    <section className="flex w-full justify-center py-8 sm:py-12">
        <div className="flex w-full max-w-[1500px] flex-col gap-12 px-[4vw] xl:px-[6vw] sm:gap-16">
            {features.map((feature, index) => {
                const { number, title, description, bullets, Preview, reversed } = feature;
                const FeaturePreview = Preview;
                return (
                    <MotionArticle
                        key={number}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4 }}
                        className={`flex w-full flex-col items-center gap-6 md:gap-10 ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                    >
                        <div className="w-full min-w-0 flex-1">
                            <FeaturePreview />
                        </div>
                        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 md:px-2">
                            <span className="text-xs font-medium tracking-wide text-(--dark-accent-color)">{number}</span>
                            <h2 className="text-xl font-semibold leading-snug tracking-tight text-[#202231] sm:text-2xl">{title}</h2>
                            <p className="text-sm leading-6 text-slate-600">{description}</p>
                            <ul className="flex flex-col gap-2 pt-1">
                                {bullets.map((bullet) => (
                                    <li key={bullet} className="flex items-start gap-2 text-xs leading-5 text-slate-600 sm:text-sm">
                                        <FaCheck aria-hidden="true" className="mt-1 shrink-0 text-[10px] text-(--accent-color)" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                            <span className="mt-1 w-fit rounded-full border border-slate-200 px-3 py-1 text-[10px] font-medium text-slate-500">
                                {index === 0 ? 'Reporting preview' : index === 1 ? 'Analytics preview' : 'Study plan preview'}
                            </span>
                        </div>
                    </MotionArticle>
                );
            })}
        </div>
    </section>
);

export default FeatureShowcase;