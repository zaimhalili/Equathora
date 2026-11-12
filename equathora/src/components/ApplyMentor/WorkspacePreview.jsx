import { motion } from 'framer-motion';

const bars = [24, 31, 25, 30, 43, 58, 84, 72, 20, 13, 18, 19, 16];
const labels = ['May 29', 'May 30', 'May 31', 'Jun 1', 'Jun 2', 'Jun 3', 'Jun 4', 'Jun 5', 'Jun 6', 'Jun 8', 'Jun 9', 'Jun 10', 'Jun 11'];
const MotionDiv = motion.div;

const WorkspacePreview = () => (
    <section aria-label="Preview of the Equathora learning dashboard" className="flex w-full justify-center pb-14 sm:pb-20">
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]"
        >
            <div className="rounded-[16px] border border-[#eeeeee] bg-[#f5f5f5] p-2.5 sm:p-4">
                <div className="flex flex-col gap-3 rounded-[10px] border border-[#eeeeee] bg-white p-3 sm:gap-4 sm:p-5 md:p-8">
                    <div className="flex flex-col gap-2 rounded-[8px] border-2 border-(--accent-color)/15 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-4 sm:py-4">
                        <div className="flex min-w-0 items-start gap-2.5">
                            <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-(--accent-color)/10 text-[10px] font-bold text-(--dark-accent-color)">Σ</span>
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <h2 className="text-[12px] font-medium text-[#222] sm:text-[14px]">Your class briefing</h2>
                                <p className="text-[10px] leading-[1.55] text-[#555] sm:text-[11px]">
                                    Your students are building a strong foundation in algebra. See where the class is making progress, which skills need a closer look, and what to practice next.
                                </p>
                            </div>
                        </div>
                        <span className="shrink-0 pl-7 text-[9px] text-[#888] sm:pl-3">Updated just now</span>
                    </div>

                    <div className="flex flex-col gap-2 rounded-[8px] border border-[#eeeeee] p-3 sm:gap-3 sm:p-4">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                            <div>
                                <h2 className="text-[14px] font-medium text-[#222] sm:text-[16px]">Class activity</h2>
                                <p className="mt-0.5 text-[9px] text-[#777] sm:text-[10px]">Questions solved each day, split by on track and needs review.</p>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] text-[#777]">
                                <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-(--dark-accent-color)" />On track</span>
                                <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-(--accent-color)" />Needs review</span>
                            </div>
                        </div>
                        <div className="flex h-28 gap-2 sm:h-40">
                            <div className="flex flex-col justify-between pb-3 text-[8px] text-[#999] sm:text-[9px]">
                                <span>3,400</span><span>2,550</span><span>1,700</span><span>850</span><span>0</span>
                            </div>
                            <div className="relative flex min-w-0 flex-1 flex-col justify-between pb-4">
                                <div className="absolute inset-x-0 top-0 flex h-[82%] flex-col justify-between" aria-hidden="true">
                                    <span className="border-t border-dashed border-slate-100" /><span className="border-t border-dashed border-slate-100" /><span className="border-t border-dashed border-slate-100" /><span className="border-t border-dashed border-slate-100" /><span className="border-t border-dashed border-slate-200" />
                                </div>
                                <div className="relative flex h-full items-end justify-between gap-1 px-1 sm:gap-2 sm:px-2">
                                    {bars.map((height, index) => (
                                        <div key={index} className="flex h-[82%] min-w-0 flex-1 items-end justify-center gap-px" aria-hidden="true">
                                            <span className="w-1/2 bg-(--accent-color)/35 sm:max-w-7" style={{ height: `${height * 0.78}%` }} />
                                            <span className="w-1/2 bg-(--dark-accent-color) sm:max-w-7" style={{ height: `${height * 0.22}%` }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 flex justify-between text-[7px] text-[#999] sm:text-[8px]">
                                    {labels.map((label) => <span key={label}>{label}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionDiv>
    </section>
);

export default WorkspacePreview;