import {
    FaChartBar,
    FaCheckCircle,
    FaExclamationCircle,
    FaTachometerAlt
} from 'react-icons/fa';

const statIcons = [FaCheckCircle, FaChartBar, FaTachometerAlt, FaExclamationCircle];

function TeacherDashboardStats({ activeClass, currentAccuracy }) {
    const weeklyCorrect = activeClass.activity.reduce((total, day) => total + day.correct, 0);
    const weeklyIncorrect = activeClass.activity.reduce((total, day) => total + day.incorrect, 0);
    const weeklyAttempts = weeklyCorrect + weeklyIncorrect;
    const topicAttempts = activeClass.topics.reduce((total, topic) => total + topic.attempts, 0);
    const questionsAttempted = weeklyAttempts || topicAttempts;
    const mistakesToReview = activeClass.mistakes.filter((mistake) => !mistake.resolved).length;
    const stats = [
        { label: 'Questions Attempted', value: questionsAttempted.toLocaleString() },
        { label: 'Current Accuracy', value: currentAccuracy === null ? '—' : `${currentAccuracy}%` },
        { label: 'Questions Solved', value: weeklyCorrect.toLocaleString() },
        { label: 'Mistakes to Review', value: mistakesToReview.toLocaleString() }
    ];

    return (
        <section
            aria-label="Class performance statistics"
            className="grid grid-cols-2 overflow-hidden rounded-2xl border border-(--french-gray)/45 bg-(--white) lg:grid-cols-4"
        >
            {stats.map((stat, index) => {
                const Icon = statIcons[index];
                return (
                    <article
                        key={stat.label}
                        className="relative flex min-h-[136px] min-w-0 flex-col gap-1 overflow-hidden border-b border-(--french-gray)/40 p-5 [&:nth-child(odd)]:border-r [&:nth-child(even)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:[&:nth-child(even)]:border-r lg:[&:nth-child(4n)]:border-r-0"
                    >
                        <Icon
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-4 -right-3 text-[76px] text-(--secondary-color)/[0.045]"
                        />
                        <span className="relative z-10 text-sm text-(--mid-main-secondary)">{stat.label}</span>
                        <strong className="relative z-10 text-[30px] font-normal leading-tight tracking-tight text-(--secondary-color)">
                            {stat.value}
                        </strong>
                    </article>
                );
            })}
        </section>
    );
}

export default TeacherDashboardStats;
