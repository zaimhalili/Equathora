import { createElement, useState } from 'react';
import {
    FaBookOpen,
    FaChartLine,
    FaCheck,
    FaCheckCircle,
    FaChevronDown,
    FaClipboardList,
    FaExclamationCircle,
    FaFilter,
    FaPencilAlt,
    FaSearch,
    FaTrash,
    FaUsers
} from 'react-icons/fa';
import {
    Bar,
    BarChart,
    Cell,
    CartesianGrid,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import PrimaryButton from '../ui/Buttons/PrimaryButton';
import SecondaryButton from '../ui/Buttons/SecondaryButton';
import DismissiblePopover from './DismissiblePopover';
import TeacherDashboardStats from './TeacherDashboardStats';
import { getCurrentAccuracy } from './teacherDashboardMetrics';

const icons = {
    chart: FaChartLine,
    users: FaUsers,
    assignments: FaClipboardList,
    mistakes: FaExclamationCircle
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
                    <select className="w-full appearance-none rounded-xl border border-(--french-gray)/60 bg-(--white) py-2 pl-3 pr-8 text-xs text-(--secondary-color) focus-visible:outline-(--mid-main-secondary)" value={activeClassId} onChange={(event) => onClassChange(event.target.value)}>
                        {classes.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.period}</option>)}
                    </select>
                    <FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 text-[10px] text-(--mid-main-secondary)" />
                </label>
                <SecondaryButton text="Create a class" onClick={onCreateClass} className="w-full justify-start rounded-xl px-3 py-2 text-xs" />
            </div>
        </aside>
    );
}

export function ClassHeading({ activeClass, studentCount, classes, onClassChange, copyFeedback, onCopyClassCode, onDeleteClass }) {
    return (
        <section className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-(--french-gray)/50 bg-(--white) p-3 sm:p-4" aria-label="Selected class">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--main-color) text-sm font-semibold text-(--secondary-color)">{activeClass.name.slice(0, 1)}</span>
                <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-(--secondary-color)">{activeClass.name}</h2>
                        <span className="rounded-full bg-(--main-color) px-2 py-1 text-[10px] text-(--secondary-color)/70">{activeClass.period}</span>
                        {activeClass.isSample && <span className="rounded-full border border-(--french-gray)/60 px-2 py-1 text-[9px] text-(--mid-main-secondary)">Preview data</span>}
                    </div>
                    <span className="text-xs text-(--mid-main-secondary)">{studentCount} {studentCount === 1 ? 'student' : 'students'}</span>
                </div>
            </div>
            <label className="relative flex shrink-0 items-center lg:hidden">
                <span className="sr-only">Select a class</span>
                <select className="max-w-36 appearance-none rounded-xl border border-(--french-gray)/60 bg-(--white) py-2 pl-2 pr-6 text-[10px] text-(--secondary-color) focus-visible:outline-(--mid-main-secondary)" value={activeClass.id} onChange={(event) => onClassChange(event.target.value)}>
                    {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 text-[9px] text-(--mid-main-secondary)" />
            </label>
            <DismissiblePopover label="Class options">
                <button type="button" role="menuitem" onClick={onDeleteClass} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-(--accent-color) hover:bg-(--main-color)"><FaTrash aria-hidden="true" />Delete class</button>
            </DismissiblePopover>
            <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-(--main-color)/70 px-3 py-2 sm:w-auto sm:min-w-52">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-(--mid-main-secondary)">Class code</span>
                    <strong className="text-lg font-semibold tracking-wider text-(--secondary-color)">{activeClass.code}</strong>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <button type="button" onClick={onCopyClassCode} className="rounded-lg px-2 py-1 text-xs font-medium text-(--secondary-color) hover:bg-(--white)">Copy</button>
                    <span aria-live="polite" className="text-[9px] text-(--mid-main-secondary)">{copyFeedback}</span>
                </div>
            </div>
        </section>
    );
}

export function Overview({ activeClass, averageAccuracy, studentCount, onCopyClassCode }) {
    const currentAccuracy = getCurrentAccuracy(activeClass, averageAccuracy);

    return (
        <div className="flex flex-col gap-4">
            <TeacherDashboardStats activeClass={activeClass} currentAccuracy={currentAccuracy} />
            {studentCount === 0 ? (
                <section className={`${cardClass} items-center px-6 py-12 text-center`}>
                    <FaUsers aria-hidden="true" className="text-2xl text-(--mid-main-secondary)" />
                    <h2 className="text-base font-medium text-(--secondary-color)">Your class is ready for its first students</h2>
                    <p className="max-w-md text-xs leading-5 text-(--mid-main-secondary)">Share the class code below with your students. Progress will appear here as they practice.</p>
                    <strong className="rounded-xl bg-(--main-color) px-5 py-3 text-2xl font-semibold tracking-[0.2em] text-(--secondary-color)">{activeClass.code}</strong>
                    <SecondaryButton text="Copy class code" onClick={onCopyClassCode} className="rounded-xl px-4 py-2 text-xs" />
                </section>
            ) : (
                <>
                    <ClassBriefing activeClass={activeClass} currentAccuracy={currentAccuracy} />
                    <div className="flex flex-col gap-4">
                        <ActivityCard activity={activeClass.activity} />
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <TopicsCard topics={activeClass.topics} />
                            <StudentAccuracyCard students={activeClass.students} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function ClassBriefing({ activeClass, currentAccuracy }) {
    const strongestTopic = [...activeClass.topics].sort((a, b) => b.accuracy - a.accuracy)[0];
    const focusTopic = [...activeClass.topics].sort((a, b) => a.accuracy - b.accuracy)[0];
    const studentsByAccuracy = [...activeClass.students].sort((a, b) => b.accuracy - a.accuracy);
    const leadingStudent = studentsByAccuracy[0];
    const studentToSupport = studentsByAccuracy.at(-1);
    const hasDistinctStudents = leadingStudent.id !== studentToSupport.id;

    return (
        <section className="rounded-2xl border-2 border-sky-200 bg-sky-50/20 p-5 sm:px-6 sm:py-5">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-base font-semibold text-(--secondary-color)">
                    <FaChartLine aria-hidden="true" className="text-sky-500" />
                    Class briefing
                </h2>
                <span className="text-xs text-(--mid-main-secondary)">Current class snapshot</span>
            </header>
            <p className="text-sm leading-6 text-(--secondary-color)/85">
                Class accuracy is <strong>{currentAccuracy}%</strong>
                {strongestTopic && <>. Strongest topic: <strong>{strongestTopic.name}</strong> at <strong>{strongestTopic.accuracy}%</strong></>}
                {focusTopic && focusTopic !== strongestTopic && <>, with <strong>{focusTopic.name}</strong> as the clearest area to revisit at <strong>{focusTopic.accuracy}%</strong></>}
                {leadingStudent && hasDistinctStudents && (
                    <>. <span className="rounded bg-sky-100 px-1.5 py-0.5 font-medium text-sky-800">{leadingStudent.name}</span> currently leads at <strong>{leadingStudent.accuracy}%</strong>, while <span className="rounded bg-sky-100 px-1.5 py-0.5 font-medium text-sky-800">{studentToSupport.name}</span> may benefit from extra support at <strong>{studentToSupport.accuracy}%</strong>.</>
                )}
                {leadingStudent && !hasDistinctStudents && <>. Student accuracy is <strong>{leadingStudent.accuracy}%</strong>.</>}
            </p>
        </section>
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
    const [range, setRange] = useState('7');
    const [chartType, setChartType] = useState('bar');
    const availableDays = Number(range);
    const lastSunday = new Date();
    lastSunday.setHours(0, 0, 0, 0);
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastMonday.getDate() - 6);
    const chartData = activity.slice(-availableDays).map((day, index, days) => {
        const date = new Date(lastMonday);
        date.setDate(date.getDate() + (activity.length - days.length) + index);
        return { ...day, date, label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
    });
    const correctTotal = chartData.reduce((total, day) => total + day.correct, 0);
    const incorrectTotal = chartData.reduce((total, day) => total + day.incorrect, 0);
    const shownDateRange = chartData.length
        ? `${chartData[0].label} – ${chartData.at(-1).label}`
        : 'No dates available';

    return (
        <section className={`${cardClass} min-h-80 w-full`}>
            <header className="flex flex-wrap items-start justify-between gap-3">
                <PanelHeading title="Daily practice" description="Correct and incorrect answers over time" />
                <div className="flex flex-wrap gap-2">
                    <DashboardSelect label="Practice history range" value={range} onChange={(event) => setRange(event.target.value)}>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                    </DashboardSelect>
                    <DashboardSelect label="Practice chart type" value={chartType} onChange={(event) => setChartType(event.target.value)}>
                        <option value="bar">Bar chart</option>
                        <option value="line">Line chart</option>
                        <option value="pie">Pie chart</option>
                    </DashboardSelect>
                </div>
            </header>
            {chartData.length ? (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-4 text-[10px] font-medium text-(--secondary-color)">
                            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--easy)' }} />Correct <strong>{correctTotal.toLocaleString()}</strong></span>
                            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />Incorrect <strong>{incorrectTotal.toLocaleString()}</strong></span>
                        </div>
                        <span className="text-[10px] text-(--mid-main-secondary)">
                            {shownDateRange} · {chartData.length} available practice {chartData.length === 1 ? 'day' : 'days'}
                        </span>
                    </div>
                    <div className="h-64 w-full min-w-0" role="img" aria-label={`${chartType} chart of correct and incorrect daily practice answers`}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            {chartType === 'line' ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid vertical={false} stroke="var(--french-gray)" strokeDasharray="3 4" />
                                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 10 }} />
                                    <YAxis allowDecimals={false} width={32} tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 9 }} />
                                    <Tooltip contentStyle={{ borderRadius: 10, borderColor: 'var(--french-gray)', background: 'var(--white)', color: 'var(--secondary-color)', fontSize: 11 }} />
                                    <Line type="monotone" dataKey="correct" name="Correct" stroke="var(--easy)" strokeWidth={3} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="incorrect" name="Incorrect" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 3 }} />
                                </LineChart>
                            ) : chartType === 'pie' ? (
                                <PieChart>
                                    <Pie data={[{ name: 'Incorrect', value: incorrectTotal }, { name: 'Correct', value: correctTotal }]} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3}>
                                        <Cell fill="var(--accent-color)" />
                                        <Cell fill="var(--easy)" />
                                    </Pie>
                                    <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Answers']} contentStyle={{ borderRadius: 10, borderColor: 'var(--french-gray)', background: 'var(--white)', color: 'var(--secondary-color)', fontSize: 11 }} />
                                </PieChart>
                            ) : (
                                <BarChart data={chartData} barCategoryGap="35%">
                                    <CartesianGrid vertical={false} stroke="var(--french-gray)" strokeDasharray="3 4" />
                                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 10 }} />
                                    <YAxis allowDecimals={false} width={32} tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 9 }} />
                                    <Tooltip cursor={{ fill: 'var(--main-color)' }} contentStyle={{ borderRadius: 10, borderColor: 'var(--french-gray)', background: 'var(--white)', color: 'var(--secondary-color)', fontSize: 11 }} />
                                    <Bar dataKey="incorrect" name="Incorrect" stackId="answers" fill="var(--accent-color)" radius={0} />
                                    <Bar dataKey="correct" name="Correct" stackId="answers" fill="var(--easy)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                    {range === '30' && chartData.length < 30 && (
                        <p className="text-[10px] text-(--mid-main-secondary)">Only {chartData.length} practice days are available in this class right now.</p>
                    )}
                </>
            ) : <EmptyInline text="Class activity will appear when students start practicing." />}
        </section>
    );
}

function DashboardSelect({ label, value, onChange, children }) {
    return (
        <label className="relative flex items-center">
            <span className="sr-only">{label}</span>
            <select
                aria-label={label}
                value={value}
                onChange={onChange}
                className="appearance-none rounded-xl border border-(--french-gray)/60 bg-(--white) py-2 pl-3 pr-8 text-xs font-medium text-(--secondary-color) shadow-sm transition hover:border-(--mid-main-secondary) focus-visible:outline-(--mid-main-secondary)"
            >
                {children}
            </select>
            <FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 text-[9px] text-(--mid-main-secondary)" />
        </label>
    );
}

function TopicsCard({ topics }) {
    const orderedTopics = [...topics].sort((a, b) => b.accuracy - a.accuracy);
    return (
        <section className={`${cardClass} min-h-72`}>
            <PanelHeading title="Accuracy by topic" description="Class accuracy across practiced topics" />
            {orderedTopics.length ? (
                <div className="flex flex-col gap-4 pt-1" role="img" aria-label="Class accuracy by practiced topic">
                    {orderedTopics.map((topic) => <TopicRow topic={topic} key={topic.name} />)}
                </div>
            ) : <EmptyInline text="Topic insights will appear when students start practicing." />}
        </section>
    );
}

function TopicRow({ topic }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-(--secondary-color)">{topic.name}</span>
                <strong className="shrink-0 font-semibold text-(--secondary-color)">{topic.accuracy}%</strong>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-(--main-color)">
                <span className="block h-full rounded-full bg-sky-500" style={{ width: `${topic.accuracy}%` }} />
            </div>
        </div>
    );
}

function StudentAccuracyCard({ students }) {
    const chartData = [...students]
        .sort((a, b) => a.accuracy - b.accuracy)
        .map((student) => ({ name: student.name, accuracy: student.accuracy }));

    return (
        <section className={`${cardClass} min-h-72`}>
            <PanelHeading title="Student accuracy" description="Compare individual math practice accuracy" />
            {chartData.length ? (
                <div className="h-52 w-full min-w-0" role="img" aria-label="Horizontal bar chart comparing student practice accuracy">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={chartData} layout="vertical" margin={{ left: 4, right: 12 }}>
                            <CartesianGrid horizontal={false} stroke="var(--french-gray)" strokeDasharray="3 4" />
                            <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 9 }} />
                            <YAxis type="category" dataKey="name" width={94} tickLine={false} axisLine={false} tick={{ fill: 'var(--secondary-color)', fontSize: 10 }} />
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'Accuracy']}
                                contentStyle={{ borderRadius: 10, borderColor: 'var(--french-gray)', background: 'var(--white)', color: 'var(--secondary-color)', fontSize: 11 }}
                            />
                            <Bar dataKey="accuracy" name="Accuracy" fill="var(--secondary-color)" radius={[0, 5, 5, 0]} barSize={14} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : <EmptyInline text="Student accuracy will appear once students start practicing." />}
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

export function StudentsView({ students, query, onQueryChange, onEditStudent }) {
    return (
        <section className={cardClass}>
            <PanelHeading title="Your students" description="Individual progress and practice activity" />
            <label className="flex h-10 items-center gap-2 rounded-xl border border-(--french-gray)/60 bg-(--white) px-3 text-xs text-(--mid-main-secondary) transition focus-within:border-(--mid-main-secondary) focus-within:ring-2 focus-within:ring-(--mid-main-secondary)/20">
                <FaSearch aria-hidden="true" />
                <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Find a student" aria-label="Find a student" className="min-w-0 flex-1 border-0 bg-transparent text-xs text-(--secondary-color) outline-none placeholder:text-(--mid-main-secondary) focus:outline-none focus-visible:outline-none" />
            </label>
            {students.length ? (
                <div className="flex min-w-0 flex-col overflow-x-auto">
                    <div className="flex min-w-[660px] items-center border-y border-(--french-gray)/50 py-2 text-[9px] font-semibold uppercase tracking-wide text-(--mid-main-secondary)">
                        <span className="flex-1">Student</span><span className="w-28">Accuracy</span><span className="w-36">Questions solved</span><span className="w-32">Status</span><span className="w-20 text-right">Actions</span>
                    </div>
                    {students.map((student) => (
                        <div className="flex min-w-[660px] items-center border-b border-(--french-gray)/30 py-3 text-xs last:border-0" key={student.id}>
                            <span className="flex flex-1 items-center gap-2.5 font-medium text-(--secondary-color)"><StudentAvatar initials={student.initials} />{student.name}</span>
                            <span className="w-28 text-(--secondary-color)">{student.accuracy}%</span>
                            <span className="w-36 text-(--secondary-color)">{student.solved} <span className="text-(--mid-main-secondary)">this week</span></span>
                            <span className="w-32 text-(--secondary-color)/70">{student.status}</span>
                            <span className="flex w-20 justify-end">
                                <button type="button" onClick={() => onEditStudent(student)} aria-label={`Edit ${student.name}`} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium text-(--secondary-color) hover:bg-(--main-color)">
                                    <FaPencilAlt aria-hidden="true" /> Edit
                                </button>
                            </span>
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
                    <label className="relative flex h-9 items-center gap-2 rounded-xl border border-(--french-gray)/60 bg-(--white) px-3 text-xs text-(--secondary-color)/70 shadow-sm">
                        <FaFilter aria-hidden="true" />
                        <select value={filter} onChange={(event) => onFilterChange(event.target.value)} aria-label="Filter mistakes" className="appearance-none bg-transparent pr-4 text-xs text-(--secondary-color) outline-none focus-visible:outline-(--mid-main-secondary)">
                            <option>All</option><option>Needs review</option><option>Resolved</option>
                        </select>
                        <FaChevronDown aria-hidden="true" className="text-[9px]" />
                    </label>
                }
            />
            {mistakes.length ? <div className="flex flex-col">{mistakes.map((mistake) => <MistakeRow key={mistake.id} mistake={mistake} onResolve={onResolve} />)}</div> : <EmptyInline text="Nothing in this view yet." />}
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

function StudentAvatar({ initials }) {
    return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--main-color) text-[10px] font-medium text-(--secondary-color)">{initials}</span>;
}

function EmptyInline({ text }) {
    return <p className="flex items-center justify-center px-4 py-8 text-center text-xs text-(--mid-main-secondary)">{text}</p>;
}
