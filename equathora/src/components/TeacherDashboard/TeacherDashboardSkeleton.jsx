function Ghost({ className = '' }) {
    return <span aria-hidden="true" className={`animate-pulse rounded-lg bg-(--main-color) ${className}`} />;
}

function TeacherDashboardSkeleton() {
    return (
        <div className="flex w-full flex-col gap-5" role="status" aria-label="Loading teacher dashboard">
            <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-2">
                    <Ghost className="h-3 w-24" />
                    <Ghost className="h-8 w-64 max-w-full" />
                    <Ghost className="h-3 w-80 max-w-full" />
                </div>
                <div className="flex gap-2">
                    <Ghost className="h-10 w-28" />
                    <Ghost className="h-10 w-36" />
                </div>
            </div>
            <Ghost className="h-[72px] w-full" />
            <div className="flex flex-wrap gap-3">
                {['students', 'accuracy', 'exercises', 'review'].map((item) => (
                    <div className="flex min-h-24 min-w-40 flex-1 items-start gap-3 rounded-xl border border-(--french-gray)/50 bg-(--white) p-4" key={item}>
                        <Ghost className="h-8 w-8 shrink-0 rounded-xl" />
                        <div className="flex flex-1 flex-col gap-2">
                            <Ghost className="h-3 w-24" />
                            <Ghost className="h-6 w-12" />
                            <Ghost className="h-3 w-28" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-4">
                <div className="flex min-h-72 min-w-64 flex-1 flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-5">
                    <Ghost className="h-5 w-36" />
                    <Ghost className="h-4 w-56" />
                    <Ghost className="h-40 w-full" />
                </div>
                <div className="flex min-h-72 min-w-64 flex-1 flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-5">
                    <Ghost className="h-5 w-40" />
                    <Ghost className="h-4 w-52" />
                    {['topic-1', 'topic-2', 'topic-3', 'topic-4'].map((item) => <Ghost key={item} className="h-7 w-full" />)}
                </div>
            </div>
            <span className="sr-only">Loading classroom data…</span>
        </div>
    );
}

export default TeacherDashboardSkeleton;
