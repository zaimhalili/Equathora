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
            <Ghost className="h-24 w-full" />
            <div className="grid min-h-[136px] grid-cols-2 overflow-hidden rounded-2xl border border-(--french-gray)/45 bg-(--white) lg:grid-cols-4">
                {['questions', 'accuracy', 'solved', 'review'].map((item) => (
                    <div className="flex flex-col gap-2 border-b border-r border-(--french-gray)/40 p-5 last:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:last:border-r-0" key={item}>
                        <Ghost className="h-4 w-32 max-w-full" />
                        <Ghost className="h-8 w-20" />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex min-h-80 w-full flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-5">
                    <Ghost className="h-5 w-36" />
                    <Ghost className="h-64 w-full" />
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="flex min-h-72 flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-5">
                        <Ghost className="h-5 w-40" />
                        {['topic-1', 'topic-2', 'topic-3', 'topic-4'].map((item) => <Ghost key={item} className="h-7 w-full" />)}
                    </div>
                    <div className="flex min-h-72 flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-5">
                        <Ghost className="h-5 w-40" />
                        <Ghost className="h-52 w-full" />
                    </div>
                </div>
            </div>
            <span className="sr-only">Loading classroom data…</span>
        </div>
    );
}

export default TeacherDashboardSkeleton;
