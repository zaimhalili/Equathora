import { createElement } from 'react';
import {
    FaArrowRight,
    FaArrowUp,
    FaBookOpen,
    FaChartLine,
    FaCheck,
    FaCheckCircle,
    FaChevronDown,
    FaClipboardList,
    FaExclamationCircle,
    FaFilter,
    FaSearch,
    FaUsers
} from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import PrimaryButton from '../ui/Buttons/PrimaryButton';
import SecondaryButton from '../ui/Buttons/SecondaryButton';
import DismissiblePopover from './DismissiblePopover';

const icons = {
    chart: FaChartLine,
    users: FaUsers,
    assignments: FaClipboardList,
    mistakes: FaExclamationCircle,
    analytics: FaBookOpen
};

const cardClass = 'flex min-w-0 flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-4 sm:p-5';
const headingClass = 'flex flex-wrap items-start justify-between gap-3';
const mutedClass = 'text-xs text-(--mid-main-secondary)';

export function TeacherNavigation({ sections, activeSection, onSectionChange, activeMistakes, classes, activeClassId, onClassChange, onCreateClass }) {
    return (
        <aside className="flex min-w-0 flex-col gap-4 lg:w-52 lg:shrink-0 lg:gap-8">
            <div className="hidden items-center gap-3 px-1 text-sm font-medium text-(--secondary-color) lg:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--main-color) text-(--secondary-color)">
                    <FaUsers aria-hidden="true" />
                </span>
                Teaching space
            </div>
            <nav aria-label="Teacher dashboard sections" className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {sections.map((section) => (
                    <button
                        type="button"
                        key={section.id}
                        aria-current={activeSection === section.id ? 'page' : undefined}
                        onClick={() => onSectionChange(section.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors lg:w-full lg:py-2.5 ${
                            activeSection === section.id
                                ? 'bg-(--main-color) text-(--secondary-color)'
                                : 'text-(--secondary-color)/70 hover:bg-(--main-color) hover:text-(--secondary-color)'
                        }`}
                    >
                        {createElement(icons[section.icon], { 'aria-hidden': true, className: 'shrink-0' })}
                        {section.label}
                        {section.id === 'mistakes' && activeMistakes > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--main-color) px-1 text-[10px]">{activeMistakes}</span>
                        )}
                    </button>
                ))}
            </nav>
            <div className="hidden flex-col gap-3 border-t border-(--french-gray)/50 pt-4 lg:flex">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-(--mid-main-secondary)">Your class</span>
                <label className="relative flex items-center">
                    <span className="sr-only">Select a class</span>
                    <select className="w-full appearance-none rounded-xl border border-(--french-gray)/60 bg-(--white) py-2 pl-3 pr-8 text-xs text-(--secondary-color)" value={activeClassId} onChange={(event) => onClassChange(event.target.value)}>
                        {classes.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.period}</option>)}
                    </select>
                    <FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 text-[10px] text-(--mid-main-secondary)" />
                </label>
                <SecondaryButton text="Create a class" onClick={onCreateClass} className="w-full justify-start rounded-xl px-3 py-2 text-xs" />
            </div>
        </aside>
    );
}

export function ClassHeading({ activeClass, studentCount, classes, onClassChange, copyFeedback, onCopyClassCode, onArchive }) {
    return (
        <section className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-(--french-gray)/50 bg-(--white) p-3 sm:p-4" aria-label="Selected class">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--main-color) text-sm font-semibold text-(--secondary-color)">{activeClass.name.slice(0, 1)}</span>
                <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-(--secondary-color)">{activeClass.name}</h2>
                        <span className="rounded-full bg-(--main-color) px-2 py-1 text-[10px] text-(--secondary-color)/70">{activeClass.period}</span>
                        {activeClass.isSample && <span className="rounded-full border border-(--french-gray)/60 px-2 py-1 text-[9px] text-(--mid-main-secondary)">Preview data</span>}
                    </div>
                    <p className="flex flex-wrap items-center gap-1.5 text-[10px] text-(--mid-main-secondary)">
                        Class code <strong className="font-medium text-(--secondary-color)">{activeClass.code}</strong>
                        <span aria-hidden="true">·</span>{studentCount} students
                        <span aria-live="polite" className="text-(--secondary-color)">{copyFeedback}</span>
                    </p>
                </div>
            </div>
            <label className="relative flex shrink-0 items-center lg:hidden">
                <span className="sr-only">Select a class</span>
                <select className="max-w-28 appearance-none rounded-xl border border-(--french-gray)/60 bg-(--white) py-2 pl-2 pr-6 text-[10px] text-(--secondary-color)" value={activeClass.id} onChange={(event) => onClassChange(event.target.value)}>
                    {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 text-[9px] text-(--mid-main-secondary)" />
            </label>
            <DismissiblePopover label="Class options">
                <button type="button" role="menuitem" onClick={onCopyClassCode} className="rounded-lg px-3 py-2 text-left text-xs text-(--secondary-color)/80 hover:bg-(--main-color)">Copy class code</button>
                <button type="button" role="menuitem" disabled={classes.length < 2} onClick={onArchive} className="rounded-lg px-3 py-2 text-left text-xs text-(--secondary-color)/80 hover:bg-(--main-color) disabled:opacity-40">Archive class</button>
            </DismissiblePopover>
        </section>
    );
}

export function Overview({ activeClass, averageAccuracy, studentCount, activeMistakes, onSectionChange, onResolveMistake, onCopyClassCode }) {
    const submissionCount = activeClass.assignments.reduce((total, assignment) => total + assignment.submitted, 0);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3" aria-label="Class summary">
                <Metric icon={FaUsers} label="Students" value={studentCount} note={studentCount ? 'In this class' : 'Invite students to begin'} />
                <Metric icon={FaChartLine} label="Average accuracy" value={`${averageAccuracy}%`} note={studentCount ? 'Across all students' : 'No attempts yet'} />
                <Metric icon={FaClipboardList} label="Exercises" value={activeClass.assignments.length} note={`${submissionCount} submissions`} />
                <Metric icon={FaExclamationCircle} label="Mistakes to review" value={activeMistakes} note="Open review items" />
            </div>
            {studentCount === 0 ? (
                <section className={`${cardClass} items-center px-6 py-12 text-center`}>
                    <FaUsers aria-hidden="true" className="text-2xl text-(--mid-main-secondary)" />
                    <h2 className="text-base font-medium text-(--secondary-color)">Your class is ready for its first students</h2>
                    <p className="max-w-md text-xs leading-5 text-(--mid-main-secondary)">Share class code <strong className="text-(--secondary-color)">{activeClass.code}</strong> with your students. Progress will appear here as they practice.</p>
                    <SecondaryButton text="Copy class code" onClick={onCopyClassCode} className="rounded-xl px-4 py-2 text-xs" />
                </section>
            ) : (
                <>
                    <section className="flex items-start gap-3 rounded-xl border border-(--french-gray)/50 bg-(--white) px-4 py-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--main-color) text-sm text-(--secondary-color)">i</span>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <h2 className="text-xs font-semibold text-(--secondary-color)">A quick read on your class <span className="font-normal text-(--mid-main-secondary)">· THIS WEEK</span></h2>
                            <p className="text-[11px] leading-5 text-(--mid-main-secondary)">Students are strongest in <strong className="font-medium text-(--secondary-color)">{activeClass.topics[0]?.name ?? 'core skills'}</strong> and may benefit from extra practice with <strong className="font-medium text-(--secondary-color)">{activeClass.topics.at(-1)?.name ?? 'new topics'}</strong>.</p>
                        </div>
                        <button type="button" onClick={() => onSectionChange('analytics')} aria-label="View class analytics" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--mid-main-secondary) hover:bg-(--main-color)"><FaArrowRight /></button>
                    </section>
                    <div className="flex flex-wrap items-stretch gap-4">
                        <ActivityCard activity={activeClass.activity} />
                        <TopicsCard topics={activeClass.topics.slice(0, 4)} onViewAll={() => onSectionChange('analytics')} />
                    </div>
                    <div className="flex flex-wrap items-stretch gap-4">
                        <AssignmentsCard assignments={activeClass.assignments.slice(0, 3)} onViewAll={() => onSectionChange('assignments')} />
                        <MistakesCard mistakes={activeClass.mistakes.filter((mistake) => !mistake.resolved).slice(0, 3)} onViewAll={() => onSectionChange('mistakes')} onResolve={onResolveMistake} />
                    </div>
                </>
            )}
        </div>
    );
}

function Metric({ icon, label, value, note }) {
    return (
        <article className="flex min-h-24 min-w-40 flex-1 items-start gap-3 rounded-xl border border-(--french-gray)/50 bg-(--white) p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--main-color) text-xs text-(--secondary-color)">{createElement(icon, { 'aria-hidden': true })}</span>
            <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[11px] text-(--mid-main-secondary)">{label}</span>
                <strong className="text-xl font-medium leading-6 text-(--secondary-color)">{value}</strong>
                <small className="text-[10px] text-(--mid-main-secondary)">{note}</small>
            </div>
        </article>
    );
}

function PanelHeading({ title, description, action }) {
    return (
        <div className={headingClass}>
            <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-sm font-medium text-(--secondary-color)">{title}</h2>
                <p className={mutedClass}>{description}</p>
            </div>
            {action}
        </div>
    );
}

export function ActivityCard({ activity }) {
    const totalCorrect = activity.reduce((sum, day) => sum + day.correct, 0);
    const totalIncorrect = activity.reduce((sum, day) => sum + day.incorrect, 0);
    const busiestDay = activity.reduce((best, day) => !best || day.correct + day.incorrect > best.correct + best.incorrect ? day : best, null);
    return (
        <section className={`${cardClass} min-h-72 flex-1 basis-96`}>
            <PanelHeading title="Class activity" description="Questions answered this week" action={<DismissiblePopover label="Chart options" contentClassName="p-2 text-xs text-(--secondary-color)"><span className="px-2 py-1">Last 7 days</span><span className="px-2 py-1">Correct and incorrect</span></DismissiblePopover>} />
            <div className="flex items-center justify-end gap-4 text-[10px] text-(--mid-main-secondary)">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--easy)' }} />{totalCorrect} correct</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />{totalIncorrect} incorrect</span>
            </div>
            {activity.length ? (
                <div className="h-44 w-full min-w-0" role="img" aria-label="Stacked bar chart of correct and incorrect answers for the last seven days">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={activity} barCategoryGap="35%">
                            <CartesianGrid vertical={false} stroke="var(--french-gray)" strokeDasharray="3 4" />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 10 }} />
                            <YAxis allowDecimals={false} width={34} tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 9 }} />
                            <Tooltip
                                cursor={{ fill: 'var(--main-color)' }}
                                contentStyle={{ borderRadius: 10, borderColor: 'var(--french-gray)', background: 'var(--white)', color: 'var(--secondary-color)', fontSize: 11 }}
                            />
                            <Bar dataKey="correct" name="Correct" stackId="answers" fill="var(--easy)" radius={0} />
                            <Bar dataKey="incorrect" name="Incorrect" stackId="answers" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : <EmptyInline text="Class activity will appear when students start practicing." />}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--french-gray)/50 pt-3 text-[10px] text-(--mid-main-secondary)">
                <span className="flex items-center gap-1.5"><FaArrowUp className="text-(--secondary-color)" />{busiestDay ? <>Most questions were solved on <strong className="font-medium text-(--secondary-color)">{busiestDay.day}</strong>.</> : 'No activity recorded yet.'}</span>
                <span>{activity.length} days</span>
            </div>
        </section>
    );
}

function TopicsCard({ topics, onViewAll }) {
    return (
        <section className={`${cardClass} min-h-72 flex-1 basis-80`}>
            <PanelHeading title="Accuracy by topic" description="Where the class feels confident" action={<TextAction onClick={onViewAll}>View all</TextAction>} />
            {topics.length ? <div className="flex flex-col gap-5 pt-2">{topics.map((topic) => <TopicRow topic={topic} key={topic.name} />)}</div> : <EmptyInline text="Topic insights will appear when students start practicing." />}
        </section>
    );
}

function TopicRow({ topic }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex min-w-28 flex-1 flex-col gap-1">
                <span className="truncate text-[11px] text-(--secondary-color)">{topic.name}</span>
                <small className="text-[10px] text-(--mid-main-secondary)">{topic.attempts} attempts</small>
            </div>
            <div className="h-1.5 min-w-12 flex-[1.4] overflow-hidden rounded-full bg-(--main-color)">
                <span className="block h-full rounded-full bg-(--secondary-color)" style={{ width: `${topic.accuracy}%` }} />
            </div>
            <strong className="w-9 text-right text-xs font-medium text-(--secondary-color)">{topic.accuracy}%</strong>
        </div>
    );
}

function AssignmentsCard({ assignments, onViewAll }) {
    return (
        <section className={`${cardClass} min-h-64 flex-1 basis-80`}>
            <PanelHeading title="Recent exercises" description="What’s in progress" action={<TextAction onClick={onViewAll}>All exercises</TextAction>} />
            {assignments.length ? <div className="flex flex-col">{assignments.map((assignment) => <AssignmentRow key={assignment.id} assignment={assignment} compact />)}</div> : <EmptyInline text="No exercises assigned yet." />}
        </section>
    );
}

function AssignmentRow({ assignment, compact = false }) {
    return (
        <div className={`flex min-w-0 flex-col border-t border-(--french-gray)/40 py-3 first:border-t-0 ${compact ? '' : 'sm:gap-1'}`}>
            <div className={`flex min-w-0 items-center gap-3 ${compact ? '' : 'sm:gap-4'}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--main-color) text-xs text-(--secondary-color)"><FaBookOpen /></span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <strong className="truncate text-[11px] font-medium text-(--secondary-color)">{assignment.title}</strong>
                    <span className="truncate text-[10px] text-(--mid-main-secondary)">
                        {assignment.topic}
                        {assignment.problems?.length ? ` · ${assignment.problems.length} selected` : ''}
                        {!compact && ` · Due ${assignment.due}`}
                    </span>
                </div>
                <span className="shrink-0 text-[10px] text-(--secondary-color)">{assignment.submitted}<span className="text-(--mid-main-secondary)">/{assignment.total}</span></span>
                <span className="hidden shrink-0 rounded-full bg-(--main-color) px-2 py-1 text-[9px] text-(--secondary-color)/80 sm:inline">{assignment.status}</span>
            </div>
            {assignment.problems?.length > 0 && (
                <details className="flex flex-col pl-11">
                    <summary className="w-fit cursor-pointer list-none py-2 text-[10px] text-(--secondary-color)/70 hover:text-(--secondary-color)">
                        View assigned exercises
                    </summary>
                    <ul className="flex flex-col gap-2 border-l border-(--french-gray)/50 pl-3">
                        {assignment.problems.map((problem) => (
                            <li key={problem.id} className="flex min-w-0 flex-col gap-0.5">
                                <span className="truncate text-[10px] text-(--secondary-color)">{problem.title}</span>
                                <span className="text-[9px] text-(--mid-main-secondary)">{[problem.topic, problem.difficulty].filter(Boolean).join(' · ') || 'General'}</span>
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
    );
}

function MistakesCard({ mistakes, onViewAll, onResolve }) {
    return (
        <section className={`${cardClass} min-h-64 flex-1 basis-80`}>
            <PanelHeading title="Mistakes to review" description="Patterns worth a second look" action={<TextAction onClick={onViewAll}>Open log</TextAction>} />
            {mistakes.length ? <div className="flex flex-col">{mistakes.map((mistake) => <MistakeRow key={mistake.id} mistake={mistake} onResolve={onResolve} compact />)}</div> : <EmptyInline text="No mistakes to review." />}
        </section>
    );
}

export function StudentsView({ students, query, onQueryChange }) {
    return (
        <section className={cardClass}>
            <PanelHeading title="Your students" description="Individual progress and practice activity" />
            <label className="flex h-10 items-center gap-2 rounded-xl bg-(--main-color) px-3 text-xs text-(--secondary-color)/70 focus-within:ring-2 focus-within:ring-(--secondary-color)">
                <FaSearch aria-hidden="true" />
                <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Find a student" aria-label="Find a student" className="min-w-0 flex-1 bg-transparent text-xs text-(--secondary-color) outline-none placeholder:text-(--secondary-color)/50" />
            </label>
            {students.length ? (
                <div className="flex min-w-0 flex-col overflow-x-auto">
                    <div className="flex min-w-[600px] items-center border-y border-(--french-gray)/50 py-2 text-[9px] font-semibold uppercase tracking-wide text-(--mid-main-secondary)">
                        <span className="flex-1">Student</span><span className="w-28">Accuracy</span><span className="w-36">Questions solved</span><span className="w-32">Status</span>
                    </div>
                    {students.map((student) => (
                        <div className="flex min-w-[600px] items-center border-b border-(--french-gray)/30 py-3 text-xs last:border-0" key={student.id}>
                            <span className="flex flex-1 items-center gap-2.5 font-medium text-(--secondary-color)"><StudentAvatar initials={student.initials} />{student.name}</span>
                            <span className="w-28 text-(--secondary-color)">{student.accuracy}%</span>
                            <span className="w-36 text-(--secondary-color)">{student.solved} <span className="text-(--mid-main-secondary)">this week</span></span>
                            <span className="w-32 text-(--secondary-color)/70">{student.status}</span>
                        </div>
                    ))}
                </div>
            ) : <EmptyInline text={query ? 'No students match that search.' : 'Students will appear here after they join the class.'} />}
        </section>
    );
}

export function AssignmentsView({ assignments, onCreate, studentCount }) {
    return (
        <section className={cardClass}>
            <PanelHeading
                title="Exercises"
                description="Assignments and class submission progress"
                action={<PrimaryButton text="Assign exercise" onClick={onCreate} disabled={studentCount === 0} className="rounded-xl px-3 py-2 text-xs" />}
            />
            {assignments.length ? <div className="flex flex-col">{assignments.map((assignment) => <AssignmentRow assignment={assignment} key={assignment.id} />)}</div> : <EmptyInline text="Your class is ready for its first exercise. Assign one when students have joined." />}
        </section>
    );
}

export function MistakesView({ mistakes, filter, onFilterChange, onResolve }) {
    return (
        <section className={cardClass}>
            <PanelHeading
                title="Mistakes log"
                description="Repeated errors can point to a useful teaching moment."
                action={
                    <label className="flex h-9 items-center gap-2 rounded-xl bg-(--main-color) px-3 text-xs text-(--secondary-color)/70">
                        <FaFilter aria-hidden="true" />
                        <select value={filter} onChange={(event) => onFilterChange(event.target.value)} aria-label="Filter mistakes" className="appearance-none bg-transparent text-xs text-(--secondary-color) outline-none">
                            <option>All</option><option>Needs review</option><option>Resolved</option>
                        </select>
                        <FaChevronDown aria-hidden="true" className="text-[9px]" />
                    </label>
                }
            />
            {mistakes.length ? <div className="flex flex-col">{mistakes.map((mistake) => <MistakeRow key={mistake.id} mistake={mistake} onResolve={onResolve} />)}</div> : <EmptyInline text="Nothing in this view yet." />}
            <p className="flex items-start gap-2 rounded-xl bg-(--main-color) p-3 text-[10px] leading-4 text-(--mid-main-secondary)"><FaExclamationCircle className="shrink-0" /> Mistakes are learning signals, not grades. Review a pattern with the student before drawing conclusions.</p>
        </section>
    );
}

function MistakeRow({ mistake, onResolve, compact = false }) {
    return (
        <article className="flex min-w-0 items-center gap-2.5 border-t border-(--french-gray)/40 py-3 first:border-t-0 sm:gap-3">
            <StudentAvatar initials={mistake.initials} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <strong className="truncate text-[11px] font-medium text-(--secondary-color)">{mistake.topic}</strong>
                <span className="truncate text-[10px] text-(--mid-main-secondary)">{mistake.student} · {mistake.detail}</span>
                {!compact && <small className="text-[10px] text-(--mid-main-secondary)">{mistake.attempts} similar attempts · {mistake.when}</small>}
            </div>
            {compact && <span className="hidden shrink-0 text-[9px] text-(--mid-main-secondary) sm:inline">{mistake.when}</span>}
            <SecondaryButton
                text={mistake.resolved ? <><FaCheck /> <span className="hidden sm:inline">Reviewed</span></> : <><FaCheckCircle /> <span className="hidden sm:inline">Review</span></>}
                onClick={() => onResolve(mistake.id)}
                ariaLabel={mistake.resolved ? 'Reopen mistake' : 'Mark mistake reviewed'}
                className="shrink-0 rounded-lg px-2 py-1.5 text-[10px]"
            />
        </article>
    );
}

export function AnalyticsView({ activeClass }) {
    const correct = activeClass.activity.reduce((total, day) => total + day.correct, 0);
    const incorrect = activeClass.activity.reduce((total, day) => total + day.incorrect, 0);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
                <Metric icon={FaBookOpen} label="Questions attempted" value={correct + incorrect} note="Across the last 7 days" />
                <Metric icon={FaCheckCircle} label="Answered correctly" value={correct} note="Practice activity" />
                <Metric icon={FaExclamationCircle} label="Incorrect attempts" value={incorrect} note="Another look can help" />
            </div>
            <ActivityCard activity={activeClass.activity} />
            <section className={cardClass}>
                <PanelHeading title="Topic mastery" description="Accuracy across the topics students have practiced" />
                {activeClass.topics.length ? <div className="flex flex-col gap-5 pt-2">{activeClass.topics.map((topic) => <TopicRow topic={topic} key={topic.name} />)}</div> : <EmptyInline text="Topic analytics will appear once your students start practicing." />}
            </section>
        </div>
    );
}

function StudentAvatar({ initials }) {
    return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--main-color) text-[10px] font-medium text-(--secondary-color)">{initials}</span>;
}

function TextAction({ children, onClick }) {
    return <button type="button" onClick={onClick} className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium text-(--secondary-color)/70 hover:bg-(--main-color) hover:text-(--secondary-color)">{children}<FaArrowRight aria-hidden="true" /></button>;
}

function EmptyInline({ text }) {
    return <p className="flex items-center justify-center px-4 py-8 text-center text-xs text-(--mid-main-secondary)">{text}</p>;
}
