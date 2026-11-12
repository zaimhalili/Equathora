import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const steps = [
    {
        number: '01',
        title: 'Share your experience',
        description: 'Tell us what matters most to you and your students.',
        preview: (
            <div className="flex w-full flex-col gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                <span className="text-[10px] font-medium text-[#333]">Your teaching profile</span>
                <div className="flex gap-2"><span className="flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 bg-white text-[8px] text-[#555]"><i className="h-4 w-4 rounded-md bg-(--accent-color)/15" />Experience</span><span className="flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 bg-white text-[8px] text-[#555]"><i className="h-4 w-4 rounded-md bg-(--accent-color)/25" />Subjects</span><span className="flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 bg-white text-[8px] text-[#555]"><i className="h-4 w-4 rounded-md bg-(--dark-accent-color)/15" />Goals</span></div>
                <span className="text-[9px] leading-4 text-slate-500">A little about you helps us start the right conversation.</span>
            </div>
        )
    },
    {
        number: '02',
        title: 'Exchange ideas',
        description: 'Connect with educators and share practical insights.',
        preview: (
            <div className="flex w-full flex-col gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                <span className="text-[10px] font-medium text-[#333]">Educator community</span>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-color)/15 text-[8px] text-(--dark-accent-color)">A</span><span className="h-1.5 w-3/4 rounded bg-slate-200" /></div>
                    <div className="ml-7 flex flex-col gap-1.5 rounded-md bg-slate-50 p-2"><span className="h-1.5 w-full rounded bg-slate-200" /><span className="h-1.5 w-4/5 rounded bg-slate-200" /></div>
                    <div className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--dark-accent-color)/10 text-[8px] text-(--dark-accent-color)">M</span><span className="h-1.5 w-1/2 rounded bg-slate-200" /></div>
                </div>
            </div>
        )
    },
    {
        number: '03',
        title: 'Help students grow',
        description: 'Help us build a more thoughtful way to learn math.',
        preview: (
            <div className="flex w-full flex-col gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-[#333]">Student progress</span><span className="text-[8px] text-slate-400">This week</span></div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[8px] text-slate-500"><span>Algebra</span><span>On track</span></div>
                    <span className="h-1.5 rounded-full bg-slate-100"><i className="block h-full w-3/4 rounded-full bg-(--dark-accent-color)" /></span>
                    <div className="flex items-center justify-between text-[8px] text-slate-500"><span>Geometry</span><span>Practicing</span></div>
                    <span className="h-1.5 rounded-full bg-slate-100"><i className="block h-full w-1/2 rounded-full bg-(--accent-color)" /></span>
                </div>
            </div>
        )
    }
];

const HowItWorks = () => (
    <section className="flex w-full justify-center py-10 sm:py-14">
        <div className="flex w-full max-w-[1500px] flex-col items-center gap-7 px-[4vw] xl:px-[6vw]">
            <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center"
            >
                <h2 className="text-[26px] font-medium tracking-tight text-[#171717] sm:text-[28px]">How it works</h2>
            </MotionDiv>
            <div className="flex w-full flex-wrap items-stretch gap-3 sm:gap-4">
                {steps.map(({ number, title, description, preview }, index) => (
                    <MotionArticle
                        key={number}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className="flex w-full min-w-0 flex-1 basis-full flex-col overflow-hidden rounded-[9px] border border-[#e7e7e7] bg-white sm:basis-[calc(50%-0.5rem)] lg:basis-0"
                    >
                        <div className="flex h-[180px] items-start justify-center overflow-hidden border-b border-slate-100 bg-(--accent-color)/[0.07] p-4 sm:h-[188px] sm:p-5">
                            <div className="w-full max-w-[260px]">{preview}</div>
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                            <span className="text-[16px] font-normal text-[#aaa]">{number}</span>
                            <h3 className="text-[14px] font-medium text-[#171717] sm:text-[16px]">{title}</h3>
                            <p className="text-[11px] leading-[1.45] text-[#777] sm:text-[12px]">{description}</p>
                        </div>
                    </MotionArticle>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;