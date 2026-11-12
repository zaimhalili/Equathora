import { motion } from 'framer-motion';
import { FaComments, FaLightbulb, FaUserPlus } from 'react-icons/fa';

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const steps = [
    {
        number: '01',
        icon: FaUserPlus,
        title: 'Join the network',
        description: 'Tell us a little about your teaching experience and the subjects you care about.',
        preview: (
            <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-(--accent-color)"><FaUserPlus /></span><span className="text-[10px] font-semibold text-slate-700">Your educator profile</span></div>
                <div className="flex gap-2"><span className="h-5 flex-1 rounded border border-slate-200 bg-slate-50" /><span className="h-5 flex-1 rounded border border-slate-200 bg-slate-50" /></div>
                <span className="h-5 w-2/3 rounded border border-slate-200 bg-slate-50" />
            </div>
        )
    },
    {
        number: '02',
        icon: FaComments,
        title: 'Share your perspective',
        description: 'Join product conversations and help us understand what learners and teachers need.',
        preview: (
            <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-(--accent-color)"><FaComments /></span><span className="text-[10px] font-semibold text-slate-700">Community discussion</span></div>
                <div className="flex items-start gap-2 rounded-md bg-slate-50 p-2"><span className="h-5 w-5 shrink-0 rounded-full bg-rose-200" /><div className="flex flex-1 flex-col gap-1.5"><span className="h-1.5 w-4/5 rounded bg-slate-200" /><span className="h-1.5 w-full rounded bg-slate-200" /><span className="h-1.5 w-1/2 rounded bg-rose-200" /></div></div>
            </div>
        )
    },
    {
        number: '03',
        icon: FaLightbulb,
        title: 'Shape what comes next',
        description: 'Help guide useful teaching tools, from meaningful reports to more personal study plans.',
        preview: (
            <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-(--accent-color)"><FaLightbulb /></span><span className="text-[10px] font-semibold text-slate-700">Ideas in progress</span></div>
                <div className="flex flex-wrap gap-1.5"><span className="rounded border border-rose-100 bg-rose-50 px-2 py-1 text-[9px] text-(--dark-accent-color)">Clearer reports</span><span className="rounded border border-slate-200 px-2 py-1 text-[9px] text-slate-500">Study plans</span></div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500"><span className="h-1.5 flex-1 rounded-full bg-slate-100"><span className="block h-full w-2/3 rounded-full bg-(--accent-color)" /></span>In development</div>
            </div>
        )
    }
];

const HowItWorks = () => (
    <section className="flex w-full justify-center py-10 sm:py-14">
        <div className="flex w-full max-w-[1500px] flex-col items-center gap-6 px-[4vw] xl:px-[6vw]">
            <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex max-w-xl flex-col items-center gap-2 text-center"
            >
                <h2 className="text-2xl font-semibold tracking-tight text-[#202231] sm:text-3xl">How it works</h2>
                <p className="text-sm leading-6 text-slate-600">A simple way to bring your experience into the future of learning.</p>
            </MotionDiv>
            <div className="flex w-full flex-wrap items-stretch gap-3 sm:gap-4">
                {steps.map(({ number, title, description, preview }, index) => (
                    <MotionArticle
                        key={number}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className="flex w-full min-w-0 flex-1 basis-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white sm:basis-[calc(50%-0.5rem)] lg:basis-0"
                    >
                        <div className="flex min-h-32 items-center justify-center border-b border-slate-100 bg-rose-50/50 p-4 sm:min-h-36">
                            <div className="w-full max-w-[230px]">{preview}</div>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4">
                            <span className="text-[11px] font-medium tracking-wide text-(--dark-accent-color)">{number}</span>
                            <h3 className="text-sm font-semibold text-[#2b2d42] sm:text-base">{title}</h3>
                            <p className="text-xs leading-5 text-slate-600">{description}</p>
                        </div>
                    </MotionArticle>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;