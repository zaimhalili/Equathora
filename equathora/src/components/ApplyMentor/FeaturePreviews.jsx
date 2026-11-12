const reportPoints = '0,32 22,28 44,30 66,20 88,24 110,16 132,19 154,12 176,17 198,9 220,13 242,5';
const analyticsBars = [34, 54, 42, 68, 51, 82, 61, 93, 73, 57, 77, 48];

export const ScoreReportPreview = () => (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(32,34,49,0.06)] sm:p-5">
        <div className="flex items-start justify-between gap-3">
            <div><p className="text-[10px] font-medium text-slate-400">STUDENT REPORT</p><h3 className="mt-1 text-sm font-semibold text-[#2b2d42]">Practice summary</h3></div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-medium text-(--dark-accent-color)">This month</span>
        </div>
        <div className="flex flex-wrap gap-2">
            {[['84%', 'Accuracy'], ['12', 'Sessions'], ['+8%', 'Growth']].map(([value, label]) => (
                <div key={label} className="flex min-w-[72px] flex-1 flex-col gap-1 rounded-lg bg-slate-50 p-2.5">
                    <span className="text-sm font-semibold text-[#2b2d42]">{value}</span><span className="text-[9px] text-slate-500">{label}</span>
                </div>
            ))}
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3">
            <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-600">Accuracy over time</span><span className="text-[9px] text-slate-400">Last 6 weeks</span></div>
            <svg viewBox="0 0 242 42" role="img" aria-label="Practice accuracy trending upward" className="h-16 w-full overflow-visible">
                <path d="M0 10H242M0 24H242M0 38H242" stroke="#e2e8f0" strokeWidth="1" />
                <polyline points={reportPoints} fill="none" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex justify-between text-[8px] text-slate-400"><span>Week 1</span><span>Week 3</span><span>Week 6</span></div>
        </div>
    </div>
);

export const ClassAnalyticsPreview = () => (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(32,34,49,0.06)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
            <div><p className="text-[10px] font-medium text-slate-400">CLASS INSIGHTS</p><h3 className="mt-1 text-sm font-semibold text-[#2b2d42]">Algebra foundations</h3></div>
            <span className="rounded-md border border-slate-200 px-2 py-1 text-[9px] text-slate-500">Overview</span>
        </div>
        <div className="flex flex-wrap gap-2">
            {[['24', 'Learners'], ['78%', 'Class average'], ['6', 'Skills practiced']].map(([value, label]) => (
                <div key={label} className="flex min-w-[78px] flex-1 flex-col gap-1 rounded-lg border border-slate-100 p-2.5">
                    <span className="text-sm font-semibold text-[#2b2d42]">{value}</span><span className="text-[9px] text-slate-500">{label}</span>
                </div>
            ))}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-slate-100 p-3">
            <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-600">Practice by topic</span><span className="text-[9px] text-slate-400">This week</span></div>
            <div className="flex h-24 items-end gap-2 border-b border-slate-100 px-1">
                {analyticsBars.map((height, index) => (
                    <div key={index} className="flex h-full flex-1 items-end gap-0.5" aria-hidden="true">
                        <span className="w-1/2 rounded-t-sm bg-rose-200" style={{ height: `${height * 0.72}%` }} />
                        <span className="w-1/2 rounded-t-sm bg-(--accent-color)" style={{ height: `${height * 0.48}%` }} />
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-500"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-(--accent-color)" />On track</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-rose-200" />Needs a closer look</span></div>
        </div>
    </div>
);

export const StudyPlanPreview = () => (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(32,34,49,0.06)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
            <div><p className="text-[10px] font-medium text-slate-400">PERSONAL STUDY PLAN</p><h3 className="mt-1 text-sm font-semibold text-[#2b2d42]">Avery’s next steps</h3></div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-medium text-(--dark-accent-color)">4 weeks</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-(--accent-color) text-[10px] font-semibold text-[#2b2d42]">68%</div>
            <div className="flex flex-col gap-1"><span className="text-[10px] font-semibold text-[#2b2d42]">Plan progress</span><span className="text-[9px] text-slate-500">A steady pace this week</span></div>
        </div>
        <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 px-3">
            {[
                ['Review linear equations', 'Completed', 'w-full'],
                ['Practice graphing skills', 'In progress', 'w-2/3'],
                ['Try mixed word problems', 'Up next', 'w-1/4']
            ].map(([label, status, progress]) => (
                <div key={label} className="flex flex-col gap-2 py-3">
                    <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-medium text-slate-700">{label}</span><span className="shrink-0 text-[9px] text-slate-400">{status}</span></div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100"><span className={`block h-full ${progress} rounded-full bg-(--accent-color)`} /></div>
                </div>
            ))}
        </div>
    </div>
);