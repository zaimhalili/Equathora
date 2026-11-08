import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { FaChevronDown } from 'react-icons/fa';

const cardClass = 'flex min-w-0 flex-col gap-4 rounded-xl border border-(--french-gray)/50 bg-(--white) p-4 sm:p-5';
const tooltipStyle = {
    borderRadius: 10,
    borderColor: 'var(--french-gray)',
    background: 'var(--white)',
    color: 'var(--secondary-color)',
    fontSize: 11
};
const supportBands = [
    { name: 'On track', minimum: 80, color: 'var(--easy)' },
    { name: 'Developing', minimum: 65, color: 'var(--medium)' },
    { name: 'Needs support', minimum: 0, color: 'var(--accent-color)' }
];

function ChartHeading({ title, description, action }) {
    return (
        <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-sm font-semibold text-(--secondary-color)">{title}</h2>
                <p className="text-xs text-(--mid-main-secondary)">{description}</p>
            </div>
            {action}
        </header>
    );
}

function EmptyChart({ children }) {
    return <p className="flex min-h-40 items-center justify-center px-4 text-center text-xs text-(--mid-main-secondary)">{children}</p>;
}

function ChartSelect({ value, onChange, label, children }) {
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

export function PracticeActivityChart({ activity }) {
    const [selectedRange, setSelectedRange] = useState('7');
    const data = activity.slice(-Number(selectedRange));
    const correct = data.reduce((total, day) => total + day.correct, 0);
    const incorrect = data.reduce((total, day) => total + day.incorrect, 0);

    return (
        <section className={`${cardClass} min-h-80 w-full`}>
            <ChartHeading
                title="Daily practice"
                description="Questions answered by the class"
                action={
                    <ChartSelect label="Practice history range" value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)}>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                    </ChartSelect>
                }
            />
            {data.length ? (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-4 text-[10px] font-medium text-(--secondary-color)">
                            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--easy)' }} />Correct <strong>{correct.toLocaleString()}</strong></span>
                            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />Incorrect <strong>{incorrect.toLocaleString()}</strong></span>
                        </div>
                        <span className="text-[10px] text-(--mid-main-secondary)">
                            {data.length} of {selectedRange} requested practice days available
                        </span>
                    </div>
                    <div className="h-64 w-full min-w-0" role="img" aria-label="Stacked bar chart of correct and incorrect practice questions by weekday">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={data} barCategoryGap="35%">
                                <CartesianGrid vertical={false} stroke="var(--french-gray)" strokeDasharray="3 4" />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 10 }} />
                                <YAxis allowDecimals={false} width={32} tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 9 }} />
                                <Tooltip cursor={{ fill: 'var(--main-color)' }} contentStyle={tooltipStyle} />
                                <Bar dataKey="incorrect" name="Incorrect" stackId="answers" fill="var(--accent-color)" radius={0} />
                                <Bar dataKey="correct" name="Correct" stackId="answers" fill="var(--easy)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {Number(selectedRange) > data.length && (
                        <p className="text-[10px] text-(--mid-main-secondary)">More history will appear as the class practices; older activity is not available yet.</p>
                    )}
                </>
            ) : <EmptyChart>Class activity will appear when students start practicing.</EmptyChart>}
        </section>
    );
}

export function AccuracyTrendChart({ activity }) {
    const data = activity.map((day) => {
        const total = day.correct + day.incorrect;
        return { day: day.day, accuracy: total ? Math.round((day.correct / total) * 100) : 0 };
    });

    return (
        <section className={cardClass}>
            <ChartHeading title="Daily accuracy trend" description="Correct answers as a share of daily practice" />
            {data.length ? (
                <div className="h-56 w-full min-w-0" role="img" aria-label="Line chart of the class accuracy percentage for each practice day">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <LineChart data={data}>
                            <CartesianGrid vertical={false} stroke="var(--french-gray)" strokeDasharray="3 4" />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 10 }} />
                            <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tickFormatter={(value) => `${value}%`} width={38} tickLine={false} axisLine={false} tick={{ fill: 'var(--mid-main-secondary)', fontSize: 9 }} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="var(--rare-blue)" strokeWidth={3} dot={{ r: 3, fill: 'var(--rare-blue)' }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : <EmptyChart>Accuracy trends will appear when the class has practice activity.</EmptyChart>}
        </section>
    );
}

export function StudentSupportChart({ students }) {
    const data = supportBands.map((band, index) => {
        const upper = supportBands[index - 1]?.minimum ?? 101;
        return {
            ...band,
            value: students.filter((student) => student.accuracy >= band.minimum && student.accuracy < upper).length
        };
    });
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <section className={cardClass}>
            <ChartHeading title="Class support snapshot" description="Students grouped by current practice accuracy" />
            {total ? (
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="relative h-48 min-w-0" role="img" aria-label="Donut chart grouping students by accuracy: on track 80 percent or above, developing 65 to 79 percent, needs support below 65 percent">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie data={data.filter((item) => item.value > 0)} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3}>
                                    {data.filter((item) => item.value > 0).map((item) => <Cell key={item.name} fill={item.color} />)}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} ${Number(value) === 1 ? 'student' : 'students'}`, name]} contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <strong className="text-2xl font-semibold text-(--secondary-color)">{total}</strong>
                            <span className="text-[10px] text-(--mid-main-secondary)">students</span>
                        </div>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {data.map((item) => (
                            <li key={item.name} className="flex items-center justify-between gap-3 text-xs">
                                <span className="flex items-center gap-2 font-medium text-(--secondary-color)">
                                    <i aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                </span>
                                <strong>{item.value}<span className="ml-1 font-normal text-(--mid-main-secondary)">({Math.round((item.value / total) * 100)}%)</span></strong>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : <EmptyChart>Student support levels will appear once students join the class.</EmptyChart>}
        </section>
    );
}

export function AssignmentProgressChart({ assignments }) {
    const complete = assignments.reduce((sum, assignment) => sum + Math.min(assignment.submitted, assignment.total), 0);
    const remaining = assignments.reduce((sum, assignment) => sum + Math.max(assignment.total - assignment.submitted, 0), 0);
    const data = [
        { name: 'Submitted', value: complete, color: 'var(--easy)' },
        { name: 'Awaiting submission', value: remaining, color: 'var(--mid-main-secondary)' }
    ];
    const total = complete + remaining;

    return (
        <section className={cardClass}>
            <ChartHeading title="Assignment completion" description="Submissions received across assigned exercises" />
            {total ? (
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="relative h-48 min-w-0" role="img" aria-label={`Donut chart of assignment submissions: ${complete} submitted and ${remaining} awaiting submission`}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie data={data.filter((item) => item.value > 0)} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3}>
                                    {data.filter((item) => item.value > 0).map((item) => <Cell key={item.name} fill={item.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Submissions']} contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <strong className="text-2xl font-semibold text-(--secondary-color)">{total.toLocaleString()}</strong>
                            <span className="text-[10px] text-(--mid-main-secondary)">assigned seats</span>
                        </div>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {data.map((item) => (
                            <li key={item.name} className="flex items-center justify-between gap-3 text-xs">
                                <span className="flex items-center gap-2 font-medium text-(--secondary-color)">
                                    <i aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                </span>
                                <strong>{item.value.toLocaleString()}</strong>
                            </li>
                        ))}
                        <li className="border-t border-(--french-gray)/40 pt-3 text-xs text-(--mid-main-secondary)">
                            {assignments.length} assigned {assignments.length === 1 ? 'exercise' : 'exercises'}
                        </li>
                    </ul>
                </div>
            ) : <EmptyChart>Submission progress will appear after exercises are assigned to students.</EmptyChart>}
        </section>
    );
}

export function MistakeTopicChart({ mistakes }) {
    const totals = mistakes.reduce((result, mistake) => {
        const topic = mistake.topic || 'Other';
        result.set(topic, (result.get(topic) ?? 0) + (Number(mistake.attempts) || 1));
        return result;
    }, new Map());
    const data = [...totals].map(([name, value], index) => ({
        name,
        value,
        color: ['var(--accent-color)', 'var(--challenging)', 'var(--medium)', 'var(--rare-blue)', 'var(--mid-main-secondary)'][index % 5]
    }));

    return (
        <section className={cardClass}>
            <ChartHeading title="Repeated attempts by topic" description="Where students are making the most retries" />
            {data.length ? (
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="relative h-48 min-w-0" role="img" aria-label="Donut chart of repeated incorrect attempts grouped by topic">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3}>
                                    {data.map((item) => <Cell key={item.name} fill={item.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} retries`, 'Practice']} contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <strong className="text-2xl font-semibold text-(--secondary-color)">{data.reduce((sum, item) => sum + item.value, 0)}</strong>
                            <span className="text-[10px] text-(--mid-main-secondary)">retries logged</span>
                        </div>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {data.sort((a, b) => b.value - a.value).map((item) => (
                            <li key={item.name} className="flex items-center justify-between gap-3 text-xs">
                                <span className="flex min-w-0 items-center gap-2 font-medium text-(--secondary-color)">
                                    <i aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="truncate">{item.name}</span>
                                </span>
                                <strong className="shrink-0">{item.value}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : <EmptyChart>No mistake patterns match this filter.</EmptyChart>}
        </section>
    );
}
