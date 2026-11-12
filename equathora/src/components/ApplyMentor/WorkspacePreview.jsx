import { motion } from 'framer-motion';
import { FaCheckCircle, FaRegBell } from 'react-icons/fa';

const barHeights = [22, 32, 27, 38, 35, 57, 48, 73, 65, 87, 77, 59, 43, 35, 46, 28, 40, 31];
const MotionDiv = motion.div;

const WorkspacePreview = () => (
    <section aria-label="Preview of the Equathora learning dashboard" className="flex w-full justify-center pb-14 sm:pb-20">
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="w-full max-w-[1500px] px-[4vw] xl:px-[6vw]"
        >
            <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-2 shadow-[0_18px_55px_rgba(32,34,49,0.08)] sm:p-4">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-(--accent-color)" />
                            <span className="text-xs font-semibold text-[#2b2d42] sm:text-sm">Teacher workspace</span>
                            <span className="hidden rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-(--dark-accent-color) sm:inline-flex">Preview</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <span className="hidden text-[10px] sm:inline">Last updated just now</span>
                            <FaRegBell aria-hidden="true" className="text-xs" />
                            <span className="h-7 w-7 rounded-full bg-rose-100" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-5">
                        <div className="flex flex-col justify-between gap-3 rounded-lg border border-(--accent-color)/20 bg-rose-50/40 p-3 sm:flex-row sm:items-center sm:px-4">
                            <div className="flex items-start gap-2.5">
                                <FaCheckCircle aria-hidden="true" className="mt-0.5 shrink-0 text-(--accent-color)" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-[#2b2d42] sm:text-sm">A clearer view of student progress</span>
                                    <span className="text-[10px] leading-4 text-slate-500 sm:text-xs">Bring practice, understanding, and next steps together in one place.</span>
                                </div>
                            </div>
                            <span className="pl-6 text-[10px] font-medium text-(--dark-accent-color) sm:pl-0">Learning tools preview</span>
                        </div>

                        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-xs font-semibold text-[#2b2d42] sm:text-sm">Class activity</h2>
                                    <p className="mt-1 text-[10px] text-slate-500">A quick look at practice across the week</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-3 text-[9px] text-slate-500">
                                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-(--accent-color)" />Needs support</span>
                                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-rose-200" />On track</span>
                                </div>
                            </div>
                            <div className="flex h-28 items-end gap-1 border-b border-slate-100 px-1 sm:h-40 sm:gap-2">
                                {barHeights.map((height, index) => (
                                    <div key={index} className="flex h-full min-w-0 flex-1 items-end justify-center gap-px" aria-hidden="true">
                                        <span className="w-1/2 rounded-t-[2px] bg-rose-200 sm:w-2" style={{ height: `${height * 0.62}%` }} />
                                        <span className="w-1/2 rounded-t-[2px] bg-(--accent-color) sm:w-2" style={{ height: `${height * 0.34}%` }} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between px-1 text-[9px] text-slate-400">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionDiv>
    </section>
);

export default WorkspacePreview;