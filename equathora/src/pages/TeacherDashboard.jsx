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
    const [activeClassId, setActiveClassId] = useState(() => searchParams.get('class') || getStoredClasses()[0]?.id || '');
    const [modal, setModal] = useState(null);
    const [className, setClassName] = useState('');
    const [classPeriod, setClassPeriod] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);
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

    const deleteActiveClass = () => {
        if (!activeClass) return;
        const remainingClasses = classes.filter((item) => item.id !== activeClass.id);
        setClasses(remainingClasses);
        if (remainingClasses.length) {
            updateSelectedClass(remainingClasses[0].id);
        } else {
            setActiveClassId('');
            setSearchParams((currentParams) => {
                const nextParams = new URLSearchParams(currentParams);
                nextParams.delete('class');
                nextParams.delete('section');
                return nextParams;
            }, { replace: true });
        }
        setCopyFeedback('');
        setModal(null);
    };

    const updateStudentName = (studentId, nextName) => {
        const name = nextName.trim();
        if (!name || !activeClass) return;
        const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
        setClasses((current) => current.map((item) => item.id === activeClass.id
            ? {
                ...item,
                students: item.students.map((student) => student.id === studentId
                    ? { ...student, name, initials }
                    : student),
                mistakes: item.mistakes.map((mistake) => {
                    const student = item.students.find((entry) => entry.id === studentId);
                    return mistake.student === student?.name
                        ? { ...mistake, student: name, initials }
                        : mistake;
                })
            }
            : item));
        setModal(null);
        setEditingStudent(null);
    };

    const removeStudent = (studentId) => {
        if (!activeClass) return;
        const student = activeClass.students.find((item) => item.id === studentId);
        setClasses((current) => current.map((item) => item.id === activeClass.id
            ? {
                ...item,
                students: item.students.filter((entry) => entry.id !== studentId),
                assignments: item.assignments.map((assignment) => {
                    const total = Math.max(0, assignment.total - 1);
                    return { ...assignment, total, submitted: Math.min(assignment.submitted, total) };
                }),
                mistakes: item.mistakes.filter((mistake) => mistake.student !== student?.name)
            }
            : item));
        setModal(null);
        setEditingStudent(null);
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

    if (!activeClass) {
        return (
            <div className="flex min-h-screen flex-col bg-(--white) text-(--secondary-color)">
                <Navbar />
                <main className="flex flex-1 items-center justify-center px-5 py-12">
                    <section className="flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border border-(--french-gray)/50 bg-(--white) p-8 text-center shadow-sm">
                        <FaUsers aria-hidden="true" className="text-3xl text-(--mid-main-secondary)" />
                        <h1 className="text-xl font-semibold">No classes yet</h1>
                        <p className="text-sm text-(--mid-main-secondary)">Create a class to start organizing student practice.</p>
                        <PrimaryButton text={<><FaPlus aria-hidden="true" /> Create a class</>} onClick={() => setModal('class')} className="rounded-xl px-4 py-2 text-sm" />
                    </section>
                </main>
                {modal === 'class' && (
                    <TeacherClassDialog
                        className={className}
                        classPeriod={classPeriod}
                        onClassNameChange={setClassName}
                        onClassPeriodChange={setClassPeriod}
                        onClose={() => setModal(null)}
                        onCreateClass={addClass}
                    />
                )}
            </div>
        );
    }

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
                                    onDeleteClass={() => setModal('delete-class')}
                                />

                                <section aria-label={`${activeSection} content`} className="flex min-w-0 flex-col">
                                    {activeSection === 'overview' && (
                                        <Overview
                                            activeClass={activeClass}
                                            averageAccuracy={averageAccuracy}
                                            studentCount={studentCount}
                                            onCopyClassCode={copyClassCode}
                                        />
                                    )}
                                    {activeSection === 'students' && (
                                        <StudentsView
                                            students={filteredStudents}
                                            query={studentSearch}
                                            onQueryChange={setStudentSearch}
                                            onEditStudent={(student) => {
                                                setEditingStudent(student);
                                                setModal('student');
                                            }}
                                        />
                                    )}
                                    {activeSection === 'assignments' && (
                                        <AssignmentsView assignments={activeClass.assignments} onCreate={() => setModal('assignment')} studentCount={studentCount} />
                                    )}
                                    {activeSection === 'mistakes' && (
                                        <MistakesView mistakes={filteredMistakes} filter={mistakeFilter} onFilterChange={setMistakeFilter} onResolve={toggleMistakeResolved} />
                                    )}
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
                ) : modal === 'class' ? (
                    <TeacherClassDialog
                        className={className}
                        classPeriod={classPeriod}
                        onClassNameChange={setClassName}
                        onClassPeriodChange={setClassPeriod}
                        onClose={() => setModal(null)}
                        onCreateClass={addClass}
                    />
                ) : modal === 'delete-class' ? (
                    <DeleteClassDialog
                        className={activeClass.name}
                        onClose={() => setModal(null)}
                        onConfirm={deleteActiveClass}
                    />
                ) : editingStudent ? (
                    <TeacherStudentDialog
                        key={editingStudent.id}
                        student={editingStudent}
                        onClose={() => {
                            setModal(null);
                            setEditingStudent(null);
                        }}
                        onSave={updateStudentName}
                        onRemove={removeStudent}
                    />
                ) : null
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

function DeleteClassDialog({ className, onClose, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section className="flex w-full max-w-md flex-col gap-5 rounded-2xl border-2 border-(--french-gray)/60 bg-(--white) p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="delete-class-title" aria-describedby="delete-class-description">
                <div className="flex flex-col gap-2">
                    <h2 id="delete-class-title" className="text-lg font-semibold text-(--secondary-color)">Delete this class?</h2>
                    <p id="delete-class-description" className="text-sm leading-5 text-(--mid-main-secondary)">
                        <strong className="text-(--secondary-color)">{className}</strong> and its local student, exercise, and practice data will be removed from this browser. This can’t be undone.
                    </p>
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="rounded-xl bg-(--main-color) px-4 py-2 text-sm font-medium text-(--secondary-color) transition hover:brightness-95">Keep class</button>
                    <button type="button" onClick={onConfirm} className="rounded-xl bg-(--accent-color) px-4 py-2 text-sm font-medium text-white transition hover:brightness-95">Delete class</button>
                </div>
            </section>
        </div>
    );
}

function TeacherStudentDialog({ student, onClose, onSave, onRemove }) {
    const [name, setName] = useState(student.name);
    const [confirmRemoval, setConfirmRemoval] = useState(false);

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section className="relative flex w-full max-w-md flex-col gap-5 rounded-2xl border border-(--french-gray)/50 bg-(--white) p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="edit-student-title">
                <button type="button" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-(--mid-main-secondary) hover:bg-(--main-color)" onClick={onClose} aria-label="Close dialog"><FaTimes /></button>
                <div className="flex flex-col gap-1">
                    <h2 id="edit-student-title" className="text-lg font-semibold text-(--secondary-color)">Edit student</h2>
                    <p className="text-xs text-(--mid-main-secondary)">Update this student’s name or remove them from this class.</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={(event) => {
                    event.preventDefault();
                    onSave(student.id, name);
                }}>
                    <ModalField label="Student name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={60} />
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--french-gray)/40 pt-4">
                        <button type="button" onClick={() => setConfirmRemoval(true)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-(--accent-color) hover:bg-(--main-color)">
                            <FaTrash aria-hidden="true" /> Remove from class
                        </button>
                        <div className="flex gap-2">
                            <SecondaryButton text="Cancel" onClick={onClose} className="rounded-xl px-4 py-2 text-xs" />
                            <PrimaryButton text="Save changes" type="submit" disabled={!name.trim()} className="rounded-xl px-4 py-2 text-xs" />
                        </div>
                    </div>
                </form>
                {confirmRemoval && (
                    <div className="flex flex-col gap-3 rounded-xl border border-(--accent-color)/30 bg-(--accent-color)/5 p-4">
                        <p className="text-xs leading-5 text-(--secondary-color)">Remove <strong>{student.name}</strong> from this class? Their class mistakes and assignment counts will also be updated.</p>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setConfirmRemoval(false)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-(--secondary-color) hover:bg-(--main-color)">Cancel</button>
                            <button type="button" onClick={() => onRemove(student.id)} className="rounded-lg bg-(--accent-color) px-3 py-1.5 text-xs font-medium text-white hover:brightness-95">Remove student</button>
                        </div>
                    </div>
                )}
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
