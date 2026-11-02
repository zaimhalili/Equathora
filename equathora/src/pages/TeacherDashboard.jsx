import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    FaClipboardList,
    FaPlus,
    FaTimes,
    FaUsers
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PrimaryButton from '../components/ui/Buttons/PrimaryButton';
import SecondaryButton from '../components/ui/Buttons/SecondaryButton';
import TeacherDashboardSkeleton from '../components/TeacherDashboard/TeacherDashboardSkeleton';
import AssignExercisesDialog from '../components/TeacherDashboard/AssignExercisesDialog';
import {
    AnalyticsView,
    AssignmentsView,
    ClassHeading,
    MistakesView,
    Overview,
    StudentsView,
    TeacherNavigation
} from '../components/TeacherDashboard/TeacherDashboardSections';
import { dashboardSections, initialClasses } from '../components/TeacherDashboard/teacherDashboardData';

const CLASS_STORAGE_KEY = 'equathora.teacher.classes.v1';

function getStoredClasses() {
    try {
        const storedClasses = window.localStorage.getItem(CLASS_STORAGE_KEY);
        if (!storedClasses) return initialClasses;
        const parsedClasses = JSON.parse(storedClasses);
        if (!Array.isArray(parsedClasses) || parsedClasses.some((item) => !item?.id || !Array.isArray(item.assignments))) {
            throw new Error('Stored classroom data has an invalid format.');
        }
        return parsedClasses;
    } catch (error) {
        console.error('Unable to restore teacher classes from this browser:', error);
        return initialClasses;
    }
}

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

function TeacherDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [classes, setClasses] = useState(getStoredClasses);
    const [activeClassId, setActiveClassId] = useState(() => searchParams.get('class') || getStoredClasses()[0].id);
    const [modal, setModal] = useState(null);
    const [className, setClassName] = useState('');
    const [classPeriod, setClassPeriod] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [mistakeFilter, setMistakeFilter] = useState('All');
    const [copyFeedback, setCopyFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const requestedSection = searchParams.get('section');
    const activeSection = dashboardSections.some((section) => section.id === requestedSection)
        ? requestedSection
        : 'overview';

    const changeSection = (sectionId) => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            if (sectionId === 'overview') nextParams.delete('section');
            else nextParams.set('section', sectionId);
            return nextParams;
        }, { replace: true });
    };

    const updateSelectedClass = (classId, sectionId = null) => {
        setActiveClassId(classId);
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            nextParams.set('class', classId);
            if (sectionId === 'overview') nextParams.delete('section');
            else if (sectionId) nextParams.set('section', sectionId);
            return nextParams;
        }, { replace: true });
    };

    useEffect(() => {
        const timer = window.setTimeout(() => setIsLoading(false), 350);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classes));
        } catch (error) {
            console.error('Unable to save teacher classes in this browser:', error);
        }
    }, [classes]);

    const activeClass = classes.find((item) => item.id === activeClassId) || classes[0];
    const studentCount = activeClass?.students.length ?? 0;
    const activeMistakes = activeClass?.mistakes.filter((mistake) => !mistake.resolved).length ?? 0;
    const alreadyAssignedIds = useMemo(() => new Set(
        (activeClass?.assignments ?? []).flatMap((assignment) => (
            assignment.problems ?? []
        )).map((problem) => String(problem.id))
    ), [activeClass]);
    const averageAccuracy = studentCount
        ? Math.round(activeClass.students.reduce((total, student) => total + student.accuracy, 0) / studentCount)
        : 0;
    const filteredStudents = useMemo(() => {
        const query = studentSearch.trim().toLowerCase();
        return (activeClass?.students ?? []).filter((student) => student.name.toLowerCase().includes(query));
    }, [activeClass, studentSearch]);
    const filteredMistakes = (activeClass?.mistakes ?? []).filter((mistake) => {
        if (mistakeFilter === 'Needs review') return !mistake.resolved;
        if (mistakeFilter === 'Resolved') return mistake.resolved;
        return true;
    });

    const addClass = (event) => {
        event.preventDefault();
        const name = className.trim();
        if (!name) return;
        const newClass = {
            id: `class-${Date.now()}`,
            name,
            period: classPeriod.trim() || 'New class',
            code: `EQ-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
            isSample: false,
            students: [],
            assignments: [],
            mistakes: [],
            topics: [],
            activity: []
        };
        setClasses((current) => [...current, newClass]);
        updateSelectedClass(newClass.id, 'overview');
        setClassName('');
        setClassPeriod('');
        setCopyFeedback('');
        setModal(null);
    };

    const addAssignment = (selectedProblems, dueDate) => {
        if (!selectedProblems.length || !activeClass) return;
        const due = dueDate
            ? new Date(`${dueDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'No due date';
        const assignedAt = new Date().toISOString();
        const problems = selectedProblems.map(({ id, title, topic, difficulty, slug }) => ({ id, title, topic, difficulty, slug }));
        setClasses((current) => current.map((item) => item.id === activeClass.id
            ? {
                ...item,
                assignments: [
                    {
                        id: `assignment-${Date.now()}`,
                        title: `${problems.length} exercise${problems.length === 1 ? '' : 's'}`,
                        topic: [...new Set(problems.map((problem) => problem.topic).filter(Boolean))].join(', ') || 'Practice',
                        problems,
                        assignedAt,
                        due,
                        submitted: 0,
                        total: item.students.length,
                        status: 'Active'
                    },
                    ...item.assignments
                ]
            }
            : item));
        setModal(null);
        changeSection('assignments');
    };

    const toggleMistakeResolved = (mistakeId) => {
        setClasses((current) => current.map((item) => item.id === activeClass.id
            ? {
                ...item,
                mistakes: item.mistakes.map((mistake) => mistake.id === mistakeId
                    ? { ...mistake, resolved: !mistake.resolved }
                    : mistake)
            }
            : item));
    };

    const archiveClass = () => {
        if (classes.length < 2) return;
        const nextClasses = classes.filter((item) => item.id !== activeClass.id);
        setClasses(nextClasses);
        updateSelectedClass(nextClasses[0].id);
        setCopyFeedback('');
    };

    const copyClassCode = async () => {
        if (!navigator.clipboard?.writeText) {
            setCopyFeedback('Clipboard unavailable');
            return;
        }
        try {
            await navigator.clipboard.writeText(activeClass.code);
            setCopyFeedback('Copied');
        } catch (error) {
            console.error('Unable to copy the class code:', error);
            setCopyFeedback('Copy failed');
        }
    };

    const selectClass = (classId) => {
        updateSelectedClass(classId);
        setCopyFeedback('');
    };

    if (!activeClass) return null;

    return (
        <div className="flex min-h-screen flex-col bg-(--white) text-(--secondary-color)">
            <Navbar />
            <main aria-busy={isLoading} className="flex flex-1 justify-center bg-(--white)">
                <div className="flex w-full max-w-[1500px] flex-col gap-6 px-[4vw] pb-12 pt-6 xl:px-[6vw] lg:flex-row lg:gap-8">
                    <TeacherNavigation
                        sections={dashboardSections}
                        activeSection={activeSection}
                        onSectionChange={changeSection}
                        activeMistakes={activeMistakes}
                        classes={classes}
                        activeClassId={activeClassId}
                        onClassChange={selectClass}
                        onCreateClass={() => setModal('class')}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-5">
                        {isLoading ? (
                            <TeacherDashboardSkeleton />
                        ) : (
                            <>
                                <header className="flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs text-(--mid-main-secondary)">{getGreeting()}</span>
                                        <h1 className="text-2xl font-medium tracking-tight text-(--secondary-color) sm:text-3xl">Your classroom, at a glance.</h1>
                                        <p className="text-sm text-(--mid-main-secondary)">See how your students are learning and where they need a hand.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <SecondaryButton
                                            text={<><FaPlus aria-hidden="true" /> New class</>}
                                            onClick={() => setModal('class')}
                                            className="flex-1 rounded-xl border border-(--french-gray)/50 px-3 py-2 text-xs sm:flex-none"
                                        />
                                        <PrimaryButton
                                            text={<><FaPlus aria-hidden="true" /> Assign exercise</>}
                                            onClick={() => setModal('assignment')}
                                            disabled={studentCount === 0}
                                            className="flex-1 rounded-xl px-3 py-2 text-xs sm:flex-none"
                                        />
                                    </div>
                                </header>

                                <ClassHeading
                                    activeClass={activeClass}
                                    studentCount={studentCount}
                                    classes={classes}
                                    onClassChange={selectClass}
                                    copyFeedback={copyFeedback}
                                    onCopyClassCode={copyClassCode}
                                    onArchive={archiveClass}
                                />

                                <section aria-label={`${activeSection} content`} className="flex min-w-0 flex-col">
                                    {activeSection === 'overview' && (
                                        <Overview
                                            activeClass={activeClass}
                                            averageAccuracy={averageAccuracy}
                                            studentCount={studentCount}
                                            activeMistakes={activeMistakes}
                                            onSectionChange={changeSection}
                                            onResolveMistake={toggleMistakeResolved}
                                            onCopyClassCode={copyClassCode}
                                        />
                                    )}
                                    {activeSection === 'students' && (
                                        <StudentsView students={filteredStudents} query={studentSearch} onQueryChange={setStudentSearch} />
                                    )}
                                    {activeSection === 'assignments' && (
                                        <AssignmentsView assignments={activeClass.assignments} onCreate={() => setModal('assignment')} studentCount={studentCount} />
                                    )}
                                    {activeSection === 'mistakes' && (
                                        <MistakesView mistakes={filteredMistakes} filter={mistakeFilter} onFilterChange={setMistakeFilter} onResolve={toggleMistakeResolved} />
                                    )}
                                    {activeSection === 'analytics' && <AnalyticsView activeClass={activeClass} />}
                                </section>
                                <footer className="flex items-center justify-center px-2 pt-2 text-center text-[10px] text-(--mid-main-secondary)">
                                    Preview workspace · Classroom changes are session-only until classroom data services are connected.
                                </footer>
                            </>
                        )}
                    </div>
                </div>
            </main>
            {modal && (
                modal === 'assignment' ? (
                    <AssignExercisesDialog
                        className={activeClass.name}
                        alreadyAssignedIds={alreadyAssignedIds}
                        onClose={() => setModal(null)}
                        onAssign={addAssignment}
                    />
                ) : (
                    <TeacherClassDialog
                        className={className}
                        classPeriod={classPeriod}
                        onClassNameChange={setClassName}
                        onClassPeriodChange={setClassPeriod}
                        onClose={() => setModal(null)}
                        onCreateClass={addClass}
                    />
                )
            )}
        </div>
    );
}

function TeacherClassDialog({
    className,
    classPeriod,
    onClassNameChange,
    onClassPeriodChange,
    onClose,
    onCreateClass
}) {
    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section className="relative flex w-full max-w-md flex-col gap-4 rounded-2xl border border-(--french-gray)/50 bg-(--white) p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="teacher-modal-title">
                <button type="button" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-(--mid-main-secondary) hover:bg-(--main-color)" onClick={onClose} aria-label="Close dialog"><FaTimes /></button>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--main-color) text-sm text-(--secondary-color)"><FaUsers /></span>
                <div className="flex flex-col gap-1">
                    <h2 id="teacher-modal-title" className="text-lg font-medium text-(--secondary-color)">Create a class</h2>
                    <p className="text-xs text-(--mid-main-secondary)">Set up a space for your students and their practice.</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={onCreateClass}>
                    <ModalField label="Class name" value={className} onChange={(event) => onClassNameChange(event.target.value)} placeholder="e.g. Geometry" required maxLength={50} />
                    <ModalField label="Period or group (optional)" value={classPeriod} onChange={(event) => onClassPeriodChange(event.target.value)} placeholder="e.g. Period 3" maxLength={40} />
                    <div className="flex justify-end gap-2 pt-2">
                        <SecondaryButton text="Cancel" onClick={onClose} className="rounded-xl px-4 py-2 text-xs" />
                        <PrimaryButton text={<><FaPlus /> Create class</>} type="submit" className="rounded-xl px-4 py-2 text-xs" />
                    </div>
                </form>
            </section>
        </div>
    );
}

function ModalField({ label, value, onChange, ...inputProps }) {
    return (
        <label className="flex flex-col gap-2 text-xs font-medium text-(--secondary-color)">
            {label}
            <input {...inputProps} value={value} onChange={onChange} className="rounded-xl border border-(--french-gray)/60 bg-(--white) px-3 py-2.5 text-xs text-(--secondary-color) outline-none focus:ring-2 focus:ring-(--secondary-color)/20" />
        </label>
    );
}

export default TeacherDashboard;
