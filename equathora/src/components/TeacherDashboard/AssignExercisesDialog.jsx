import { useEffect, useMemo, useState } from 'react';
import { FaBookOpen, FaCheck, FaSearch, FaTimes } from 'react-icons/fa';
import PrimaryButton from '../ui/Buttons/PrimaryButton';
import SecondaryButton from '../ui/Buttons/SecondaryButton';
import { getAssignableProblems } from './teacherProblemService';

function AssignExercisesDialog({ className, alreadyAssignedIds, onClose, onAssign }) {
    const [problems, setProblems] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isCurrent = true;
        setIsLoading(true);
        setError('');
        getAssignableProblems()
            .then((result) => { if (isCurrent) setProblems(result); })
            .catch((fetchError) => { if (isCurrent) setError(fetchError.message || 'Exercises could not be loaded. Please try again.'); })
            .finally(() => { if (isCurrent) setIsLoading(false); });

        return () => {
            isCurrent = false;
        };
    }, [retryCount]);

    const filteredProblems = useMemo(() => {
        const query = search.trim().toLowerCase();
        return problems.filter((problem) => (
            !query ||
            problem.title?.toLowerCase().includes(query) ||
            problem.topic?.toLowerCase().includes(query) ||
            problem.difficulty?.toLowerCase().includes(query)
        ));
    }, [problems, search]);

    const toggleProblem = (problemId) => {
        setSelectedIds((current) => current.includes(problemId)
            ? current.filter((id) => id !== problemId)
            : [...current, problemId]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedProblems = problems.filter((problem) => selectedIds.includes(problem.id));
        if (selectedProblems.length) onAssign(selectedProblems, dueDate);
    };

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section className="relative flex max-h-[92vh] w-full max-w-2xl flex-col gap-4 overflow-hidden rounded-2xl border border-(--french-gray)/50 bg-(--white) p-4 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="assign-exercises-title">
                <button type="button" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-(--mid-main-secondary) hover:bg-(--main-color)" onClick={onClose} aria-label="Close dialog">
                    <FaTimes />
                </button>
                <div className="flex flex-col gap-1 pr-9">
                    <span className="flex items-center gap-2 text-xs text-(--mid-main-secondary)"><FaBookOpen /> {className}</span>
                    <h2 id="assign-exercises-title" className="text-lg font-medium text-(--secondary-color)">Assign exercises</h2>
                    <p className="text-xs text-(--mid-main-secondary)">Choose one or more exercises from the active problem library.</p>
                </div>

                <label className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-(--main-color) px-3 text-xs text-(--secondary-color)/70 focus-within:ring-2 focus-within:ring-(--secondary-color)/30">
                    <FaSearch aria-hidden="true" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, topic, or difficulty" aria-label="Search exercises" className="min-w-0 flex-1 bg-transparent text-xs text-(--secondary-color) outline-none placeholder:text-(--secondary-color)/50 focus:outline-none" />
                </label>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-xl border border-(--french-gray)/50" aria-busy={isLoading}>
                    {isLoading ? (
                        <div className="flex flex-col gap-3 p-4" role="status">
                            <span className="sr-only">Loading exercises</span>
                            {[1, 2, 3, 4].map((item) => <span key={item} className="h-12 animate-pulse rounded-lg bg-(--main-color)" />)}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-3 p-6 text-center">
                            <p role="alert" className="text-xs text-(--secondary-color)">{error}</p>
                            <SecondaryButton text="Try again" onClick={() => setRetryCount((count) => count + 1)} className="rounded-xl px-3 py-2 text-xs" />
                        </div>
                    ) : filteredProblems.length ? (
                        <div className="flex flex-col">
                            {filteredProblems.map((problem) => {
                                const isSelected = selectedIds.includes(problem.id);
                                const wasAssigned = alreadyAssignedIds.has(String(problem.id));
                                return (
                                    <label key={problem.id} className={`flex cursor-pointer items-center gap-3 border-b border-(--french-gray)/30 px-3 py-3 last:border-0 sm:px-4 ${isSelected ? 'bg-(--main-color)' : 'hover:bg-(--main-color)/50'}`}>
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleProblem(problem.id)} className="h-4 w-4 shrink-0 accent-(--secondary-color)" />
                                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className="truncate text-xs font-medium text-(--secondary-color)">{problem.title}</span>
                                            <span className="flex flex-wrap items-center gap-1.5 text-[10px] text-(--mid-main-secondary)">
                                                <span>{problem.topic || 'General'}</span>
                                                {problem.difficulty && <><span aria-hidden="true">·</span><span>{problem.difficulty}</span></>}
                                            </span>
                                        </span>
                                        {wasAssigned && <span className="flex shrink-0 items-center gap-1 rounded-full bg-(--white) px-2 py-1 text-[9px] text-(--mid-main-secondary)"><FaCheck /> Previously assigned</span>}
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="flex items-center justify-center p-8 text-center text-xs text-(--mid-main-secondary)">
                            {problems.length ? 'No exercises match your search.' : 'There are no active exercises available to assign.'}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex shrink-0 flex-col gap-3 border-t border-(--french-gray)/40 pt-3 sm:flex-row sm:items-end sm:justify-between">
                    <label className="flex flex-col gap-1.5 text-[10px] font-medium text-(--secondary-color)">
                        Due date <span className="font-normal text-(--mid-main-secondary)">(optional)</span>
                        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} min={getLocalDate()} className="rounded-xl border border-(--french-gray)/60 bg-(--white) px-3 py-2 text-xs text-(--secondary-color) outline-none focus:ring-2 focus:ring-(--secondary-color)/20" />
                    </label>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className="text-[10px] text-(--mid-main-secondary)" aria-live="polite">{selectedIds.length} selected</span>
                        <SecondaryButton text="Cancel" onClick={onClose} className="rounded-xl px-3 py-2 text-xs" />
                        <PrimaryButton text="Assign selected" type="submit" disabled={!selectedIds.length || isLoading || Boolean(error)} className="rounded-xl px-3 py-2 text-xs" />
                    </div>
                </form>
            </section>
        </div>
    );
}

function getLocalDate() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default AssignExercisesDialog;
