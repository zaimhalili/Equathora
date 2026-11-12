import { motion } from 'framer-motion';
import { ClassAnalyticsPreview, ScoreReportPreview, StudyPlanPreview } from './FeaturePreviews';

const MotionArticle = motion.article;

const features = [
    {
        number: '01',
        title: 'Score reports',
        description: 'See how your students are progressing with clear, in-depth reports.',
        lead: 'Future Equathora tools will make it easier to:',
        bullets: ['Review accuracy and progress across practice sessions', 'Spot topics that may need extra support', 'Understand pacing and common mistakes'],
        Preview: ScoreReportPreview
    },
    {
        number: '02',
        title: 'Class analytics',
        description: 'Know your students’ strengths and where they need help.',
        lead: 'Future tools will make it easier to track:',
        bullets: ['Weekly activity across your class', 'Progress by topic and student', 'Concepts that need a closer look'],
        Preview: ClassAnalyticsPreview,
        reversed: true
    },
    {
        number: '03',
        title: 'Personalized study plans',
        description: 'Create tailored study plans for every student based on their progress and goals.',
        lead: 'Future tools will make it easier to build:',
        bullets: ['Schedules based on scores and test dates', 'Weekly tasks that adjust as accuracy changes', 'Focused practice on each student’s weak spots'],
        Preview: StudyPlanPreview
    }
];

const FeatureShowcase = () => (
    <section className="flex w-full justify-center py-8 sm:py-10">
        <div className="flex w-full max-w-[1500px] flex-col gap-12 px-[4vw] xl:px-[6vw] sm:gap-14">
            {features.map((feature) => {
                const { number, title, description, lead, bullets, Preview, reversed } = feature;
                const FeaturePreview = Preview;
                return (
                    <MotionArticle
                        key={number}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4 }}
                        className={`flex w-full flex-col items-center gap-7 md:gap-12 ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                    >
                        <div className="w-full min-w-0 flex-1">
                            <FeaturePreview />
                        </div>
                        <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-2 md:px-2">
                            <span className="text-[16px] font-normal text-[#aaa]">{number}</span>
                            <h2 className="text-[21px] font-medium leading-tight tracking-tight text-[#171717] sm:text-[23px]">{title}</h2>
                            <p className="max-w-[430px] text-[12px] leading-[1.5] text-[#6b7280] sm:text-[13px]">{description}</p>
                            <p className="pt-2 text-[12px] text-[#6b7280] sm:text-[13px]">{lead}</p>
                            <ul className="flex flex-col gap-0.5 pl-4">
                                {bullets.map((bullet) => (
                                    <li key={bullet} className="list-disc text-[12px] leading-[1.45] text-[#6b7280] marker:text-[#888] sm:text-[13px]">
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </MotionArticle>
                );
            })}
        </div>
    </section>
);

export default FeatureShowcase;