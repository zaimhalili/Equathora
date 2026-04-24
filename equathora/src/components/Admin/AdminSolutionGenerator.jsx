import React, { useMemo, useState } from 'react';
import { FiCheck, FiClipboard, FiFileText, FiPlay, FiSkipForward, FiUpload } from 'react-icons/fi';

const OPENSTAX_BOOKS = [
    'AlgebraTrigonometry2.pdf',
    'Calculus1.pdf',
    'Calculus2.pdf',
    'Calculus3.pdf',
    'CollegeAlgebra2.pdf',
    'IntermediateAlgebra2.pdf',
    'IntroductoryStatistics2.pdf',
    'Precalculus2.pdf'
];

const DEFAULTS = {
    book: OPENSTAX_BOOKS[0],
    startPage: 1,
    endPage: 20,
    pagesPerBatch: 2,
    maxChars: 12000,
    answerMode: 'exclude',
    answerPagesStart: '',
    pythonCmd: 'python'
};

const PROGRESS_STORAGE_KEY = 'equathora_admin_solution_generator_progress_v1';

const normalizePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const escapeForPowerShell = (value) => String(value).replaceAll("'", "''");

const buildRunCommand = ({
    pythonCmd,
    book,
    startPage,
    endPage,
    pagesPerBatch,
    maxChars,
    answerMode,
    answerPagesStart
}) => {
    const commandParts = [
        pythonCmd,
        'extract_openstax_batches.py',
        '--book',
        `'${escapeForPowerShell(book)}'`,
        '--start-page',
        String(startPage),
        '--end-page',
        String(endPage),
        '--pages-per-batch',
        String(pagesPerBatch),
        '--max-chars',
        String(maxChars),
        '--answer-mode',
        answerMode,
        '--strict-math-guard',
        '--content-mode',
        'raw',
        '--output-mode',
        'stdout'
    ];

    if (answerPagesStart) {
        commandParts.push('--answer-pages-start', String(answerPagesStart));
    }

    return [
        'cd backend/EquathoraBackend/books/BookExtract',
        commandParts.join(' ')
    ].join('; ');
};

const formatBatchLabel = (batch, idx) => {
    if (!batch) return '';
    return `Batch ${idx + 1} | pages ${batch.page_start}-${batch.page_end} | ${batch.char_count} chars`;
};

const readJsonFile = async (file) => {
    const text = await file.text();
    return JSON.parse(text);
};

const extractFirstJsonObject = (raw) => {
    const text = String(raw || '').trim();
    if (!text) {
        throw new Error('No JSON text provided.');
    }

    try {
        return JSON.parse(text);
    } catch {
        // Continue and attempt to parse a JSON block from mixed terminal output.
    }

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
        throw new Error('Could not find a JSON object in the pasted text.');
    }

    return JSON.parse(text.slice(start, end + 1));
};

const loadProgressStore = () => {
    try {
        const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (!raw) return { runs: {} };

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || typeof parsed.runs !== 'object') {
            return { runs: {} };
        }

        return parsed;
    } catch {
        return { runs: {} };
    }
};

const persistProgressStore = (store) => {
    try {
        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(store));
    } catch {
        // Ignore storage write failures (private mode/quota), keep in-memory state.
    }
};

const buildRunKey = (payload, fallbackFileName) => {
    const metadata = payload?.metadata || {};
    const source = metadata.source_pdf || fallbackFileName || 'unknown-source';
    const start = metadata.requested_page_start || payload?.batches?.[0]?.page_start || 'x';
    const end = metadata.requested_page_end || payload?.batches?.[payload?.batches?.length - 1]?.page_end || 'y';
    return `${source}::${start}-${end}`;
};

const enumerateBatchPages = (batch) => {
    if (!batch) return [];
    const start = normalizePositiveInt(batch.page_start, 0);
    const end = normalizePositiveInt(batch.page_end, 0);
    if (!start || !end || end < start) return [];
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
};

const AdminSolutionGenerator = () => {
    const [config, setConfig] = useState(DEFAULTS);
    const [loadedFileName, setLoadedFileName] = useState('');
    const [loadedPayload, setLoadedPayload] = useState(null);
    const [batchIndex, setBatchIndex] = useState(0);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');
    const [progressStore, setProgressStore] = useState(loadProgressStore);
    const [rawOutputInput, setRawOutputInput] = useState('');

    const batches = useMemo(() => loadedPayload?.batches || [], [loadedPayload]);
    const currentBatch = batches[batchIndex] || null;
    const canMoveNext = batchIndex < batches.length - 1;
    const canMovePrev = batchIndex > 0;
    const currentRunKey = useMemo(() => buildRunKey(loadedPayload, loadedFileName), [loadedPayload, loadedFileName]);
    const currentRunProgress = progressStore?.runs?.[currentRunKey] || { doneBatchIndexes: [], note: '', lastBatchIndex: 0 };
    const doneBatchSet = useMemo(() => new Set(currentRunProgress.doneBatchIndexes || []), [currentRunProgress.doneBatchIndexes]);

    const totalPagesInQueue = useMemo(() => {
        const pageSet = new Set();
        batches.forEach((batch) => {
            enumerateBatchPages(batch).forEach((page) => pageSet.add(page));
        });
        return pageSet.size;
    }, [batches]);

    const donePagesInQueue = useMemo(() => {
        const pageSet = new Set();
        batches.forEach((batch, idx) => {
            if (!doneBatchSet.has(idx)) return;
            enumerateBatchPages(batch).forEach((page) => pageSet.add(page));
        });
        return pageSet.size;
    }, [batches, doneBatchSet]);

    const lifetimePagesCovered = useMemo(() => {
        const runs = progressStore?.runs || {};
        let total = 0;

        Object.values(runs).forEach((runEntry) => {
            const runBatches = Array.isArray(runEntry?.batchesSnapshot) ? runEntry.batchesSnapshot : [];
            const doneIndexes = new Set(runEntry?.doneBatchIndexes || []);
            const pageSet = new Set();

            runBatches.forEach((batch, idx) => {
                if (!doneIndexes.has(idx)) return;
                enumerateBatchPages(batch).forEach((page) => pageSet.add(page));
            });

            total += pageSet.size;
        });

        return total;
    }, [progressStore]);

    const runCommand = useMemo(() => {
        return buildRunCommand({
            pythonCmd: config.pythonCmd || 'python',
            book: config.book,
            startPage: normalizePositiveInt(config.startPage, DEFAULTS.startPage),
            endPage: normalizePositiveInt(config.endPage, DEFAULTS.endPage),
            pagesPerBatch: normalizePositiveInt(config.pagesPerBatch, DEFAULTS.pagesPerBatch),
            maxChars: normalizePositiveInt(config.maxChars, DEFAULTS.maxChars),
            answerMode: config.answerMode,
            answerPagesStart: normalizePositiveInt(config.answerPagesStart, 0)
        });
    }, [config]);

    const setField = (key, value) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const updateRunProgress = (updater) => {
        if (!currentRunKey) return;

        setProgressStore((prev) => {
            const safeStore = prev && typeof prev === 'object' ? prev : { runs: {} };
            const current = safeStore.runs?.[currentRunKey] || { doneBatchIndexes: [], note: '', lastBatchIndex: 0, batchesSnapshot: [] };
            const nextEntry = updater(current);
            const nextStore = {
                ...safeStore,
                runs: {
                    ...(safeStore.runs || {}),
                    [currentRunKey]: nextEntry
                }
            };
            persistProgressStore(nextStore);
            return nextStore;
        });
    };

    const markBatchDone = (index, done) => {
        updateRunProgress((entry) => {
            const set = new Set(entry.doneBatchIndexes || []);
            if (done) set.add(index);
            else set.delete(index);
            return {
                ...entry,
                doneBatchIndexes: [...set].sort((a, b) => a - b),
                lastBatchIndex: index,
                batchesSnapshot: batches
            };
        });
    };

    const setRunNote = (note) => {
        updateRunProgress((entry) => ({
            ...entry,
            note,
            batchesSnapshot: batches
        }));
    };

    const copyText = async (value, successMessage) => {
        try {
            await navigator.clipboard.writeText(value);
            setError('');
            setNotice(successMessage);
        } catch {
            setNotice('');
            setError('Clipboard copy failed. Copy manually from the text area.');
        }
    };

    const copyRunCommand = async () => {
        await copyText(runCommand, 'Run command copied. Paste in terminal and press Enter.');
    };

    const copyRunCommandToClipboard = async () => {
        await copyText(`${runCommand} | Set-Clipboard`, 'Command copied. It will place extraction JSON directly in your clipboard.');
    };

    const loadPayloadToQueue = (parsed, sourceLabel) => {
        if (!Array.isArray(parsed?.batches)) {
            throw new Error('Invalid JSON. Expected an object with a batches array.');
        }

        const incomingRunKey = buildRunKey(parsed, sourceLabel);
        const incomingProgress = progressStore?.runs?.[incomingRunKey];

        setLoadedPayload(parsed);
        setLoadedFileName(sourceLabel);
        setBatchIndex(normalizePositiveInt(incomingProgress?.lastBatchIndex, 0));
        setNotice(`Loaded ${parsed.batches.length} batch(es) from ${sourceLabel}.`);
        setError('');

        if (!incomingProgress) {
            setProgressStore((prev) => {
                const safeStore = prev && typeof prev === 'object' ? prev : { runs: {} };
                const nextStore = {
                    ...safeStore,
                    runs: {
                        ...(safeStore.runs || {}),
                        [incomingRunKey]: {
                            doneBatchIndexes: [],
                            note: '',
                            lastBatchIndex: 0,
                            batchesSnapshot: parsed.batches
                        }
                    }
                };
                persistProgressStore(nextStore);
                return nextStore;
            });
        }
    };

    const onLoadOutputFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const parsed = await readJsonFile(file);
            loadPayloadToQueue(parsed, file.name);
        } catch (fileError) {
            setLoadedPayload(null);
            setLoadedFileName('');
            setBatchIndex(0);
            setNotice('');
            setError(fileError?.message || 'Failed to read JSON output file.');
        }
    };

    const onLoadFromPastedOutput = () => {
        try {
            const parsed = extractFirstJsonObject(rawOutputInput);
            loadPayloadToQueue(parsed, 'terminal-output');
        } catch (parseError) {
            setNotice('');
            setError(parseError?.message || 'Failed to parse pasted JSON output.');
        }
    };

    const onLoadFromClipboard = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const parsed = extractFirstJsonObject(clipboardText);
            setRawOutputInput(clipboardText);
            loadPayloadToQueue(parsed, 'clipboard-output');
        } catch (clipboardError) {
            setNotice('');
            setError(clipboardError?.message || 'Failed to read/parse clipboard text.');
        }
    };

    const copyCurrentBatch = async () => {
        if (!currentBatch?.prompt_text) return;
        await copyText(currentBatch.prompt_text, `${formatBatchLabel(currentBatch, batchIndex)} copied.`);
    };

    const copyAndNext = async () => {
        if (!currentBatch?.prompt_text) return;

        try {
            await navigator.clipboard.writeText(currentBatch.prompt_text);
            markBatchDone(batchIndex, true);
            if (canMoveNext) {
                setBatchIndex((prev) => prev + 1);
                setNotice(`${formatBatchLabel(currentBatch, batchIndex)} copied. Moved to next batch.`);
            } else {
                setNotice(`${formatBatchLabel(currentBatch, batchIndex)} copied. No more batches.`);
            }
            setError('');
        } catch {
            setNotice('');
            setError('Clipboard copy failed. Copy manually from the text area.');
        }
    };

    const clampedStart = normalizePositiveInt(config.startPage, DEFAULTS.startPage);
    const clampedEnd = normalizePositiveInt(config.endPage, DEFAULTS.endPage);
    const hasInvalidRange = clampedEnd < clampedStart;
    const charLimit = normalizePositiveInt(config.maxChars, DEFAULTS.maxChars);
    const isCharLimitTooLow = charLimit < 2000;

    return (
        <section className='flex flex-col gap-5 px-3 py-3 text-[var(--secondary-color)] md:px-5'>
            <header className='rounded-xl border p-5' style={{ borderColor: 'var(--mid-main-secondary)', background: 'linear-gradient(135deg, var(--main-color), var(--french-gray))' }}>
                <h1 className='text-2xl font-black md:text-3xl'>OpenStax Problem Extraction Workflow</h1>
                <p className='pt-2 text-sm md:text-base'>Pick a book and page range, run the generated Python command, then copy each batch with one click and move to the next instantly.</p>
            </header>

            <div className='grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Book (OpenStax)
                    <select
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.book}
                        onChange={(event) => setField('book', event.target.value)}
                    >
                        {OPENSTAX_BOOKS.map((book) => <option key={book} value={book}>{book}</option>)}
                    </select>
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Python Command
                    <input
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.pythonCmd}
                        onChange={(event) => setField('pythonCmd', event.target.value)}
                        placeholder='python'
                    />
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Start Page
                    <input
                        type='number'
                        min='1'
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.startPage}
                        onChange={(event) => setField('startPage', event.target.value)}
                    />
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    End Page
                    <input
                        type='number'
                        min='1'
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.endPage}
                        onChange={(event) => setField('endPage', event.target.value)}
                    />
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Pages Per Batch
                    <input
                        type='number'
                        min='1'
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.pagesPerBatch}
                        onChange={(event) => setField('pagesPerBatch', event.target.value)}
                    />
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Max Characters Per Batch
                    <input
                        type='number'
                        min='2000'
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.maxChars}
                        onChange={(event) => setField('maxChars', event.target.value)}
                    />
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Answer Handling
                    <select
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.answerMode}
                        onChange={(event) => setField('answerMode', event.target.value)}
                    >
                        <option value='exclude'>Exclude answer pages</option>
                        <option value='separate'>Generate separate answer batches</option>
                        <option value='include'>Include answer pages in questions</option>
                    </select>
                </label>

                <label className='flex flex-col gap-1 text-sm font-semibold'>
                    Answer Pages Start (optional)
                    <input
                        type='number'
                        min='1'
                        className='rounded-md border bg-[var(--french-gray)] px-3 py-2 text-sm'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                        value={config.answerPagesStart}
                        onChange={(event) => setField('answerPagesStart', event.target.value)}
                        placeholder='e.g. 901'
                    />
                </label>
            </div>

            <div className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <div className='flex flex-wrap items-center gap-2'>
                    <button
                        type='button'
                        onClick={copyRunCommand}
                        disabled={hasInvalidRange || isCharLimitTooLow}
                        className='inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[var(--main-color)] disabled:opacity-70'
                        style={{ background: 'linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))' }}
                    >
                        <FiPlay />
                        Copy Run Command
                    </button>
                    <button
                        type='button'
                        onClick={copyRunCommandToClipboard}
                        disabled={hasInvalidRange || isCharLimitTooLow}
                        className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-70'
                        style={{ borderColor: 'var(--mid-main-secondary)' }}
                    >
                        <FiClipboard />
                        Copy Command (Output -&gt; Clipboard)
                    </button>
                    <label className='inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold' style={{ borderColor: 'var(--mid-main-secondary)' }}>
                        <FiUpload />
                        Load JSON File (Optional)
                        <input type='file' accept='.json,application/json' onChange={onLoadOutputFile} className='hidden' />
                    </label>
                </div>

                <textarea
                    readOnly
                    value={runCommand}
                    className='pt-3 min-h-24 w-full rounded-md border bg-[var(--french-gray)] p-3 text-xs md:text-sm'
                    style={{ borderColor: 'var(--mid-main-secondary)' }}
                />

                {hasInvalidRange && <p className='pt-2 text-sm font-semibold text-[var(--accent-color)]'>End page must be greater than or equal to start page.</p>}
                {isCharLimitTooLow && <p className='pt-2 text-sm font-semibold text-[var(--accent-color)]'>Character limit should be at least 2000.</p>}
                {!hasInvalidRange && !isCharLimitTooLow && <p className='pt-2 text-xs text-[var(--mid-main-secondary)]'>This command uses raw mode + stdout mode, so no output files are created. Use the clipboard command for a faster flow.</p>}
            </div>

            <div className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h2 className='text-lg font-bold'>Load From Terminal Output</h2>
                    <div className='flex flex-wrap items-center gap-2'>
                        <button
                            type='button'
                            onClick={onLoadFromClipboard}
                            className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold'
                            style={{ borderColor: 'var(--mid-main-secondary)' }}
                        >
                            <FiClipboard />
                            Load From Clipboard
                        </button>
                        <button
                            type='button'
                            onClick={onLoadFromPastedOutput}
                            className='inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[var(--main-color)]'
                            style={{ background: 'linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))' }}
                        >
                            <FiUpload />
                            Parse Pasted Output
                        </button>
                    </div>
                </div>
                <textarea
                    value={rawOutputInput}
                    onChange={(event) => setRawOutputInput(event.target.value)}
                    placeholder='Paste terminal JSON output here (or use Load From Clipboard).'
                    className='pt-3 min-h-32 w-full rounded-md border bg-[var(--french-gray)] p-3 text-xs md:text-sm'
                    style={{ borderColor: 'var(--mid-main-secondary)' }}
                />
            </div>

            <div className='rounded-xl border p-4' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--main-color)' }}>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h2 className='text-lg font-bold'>Copy Queue</h2>
                    <p className='text-xs text-[var(--mid-main-secondary)]'>
                        {loadedFileName ? `${loadedFileName} | ${batches.length} batch(es)` : 'Load a generated JSON file to start'}
                    </p>
                </div>

                {!!batches.length && (
                    <div className='pt-3 grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3' style={{ borderColor: 'var(--mid-main-secondary)', backgroundColor: 'var(--french-gray)' }}>
                        <div>
                            <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Batches Completed</p>
                            <p className='text-lg font-black'>{doneBatchSet.size} / {batches.length}</p>
                        </div>
                        <div>
                            <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Pages Covered (Current Queue)</p>
                            <p className='text-lg font-black'>{donePagesInQueue} / {totalPagesInQueue}</p>
                        </div>
                        <div>
                            <p className='text-xs uppercase tracking-wide text-[var(--mid-main-secondary)]'>Pages Covered (Lifetime)</p>
                            <p className='text-lg font-black'>{lifetimePagesCovered}</p>
                        </div>
                    </div>
                )}

                {currentBatch ? (
                    <>
                        <div className='pt-3 flex flex-wrap items-center gap-2'>
                            <button
                                type='button'
                                onClick={copyCurrentBatch}
                                className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                <FiClipboard />
                                Copy Current
                            </button>

                            <button
                                type='button'
                                onClick={copyAndNext}
                                className='inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[var(--main-color)]'
                                style={{ background: 'linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))' }}
                            >
                                <FiSkipForward />
                                Copy + Next
                            </button>

                            <button
                                type='button'
                                onClick={() => canMovePrev && setBatchIndex((prev) => prev - 1)}
                                disabled={!canMovePrev}
                                className='rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-60'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                Prev
                            </button>

                            <button
                                type='button'
                                onClick={() => canMoveNext && setBatchIndex((prev) => prev + 1)}
                                disabled={!canMoveNext}
                                className='rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-60'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            >
                                Next
                            </button>

                            <button
                                type='button'
                                onClick={() => markBatchDone(batchIndex, !doneBatchSet.has(batchIndex))}
                                className='rounded-md border px-3 py-2 text-sm font-semibold'
                                style={{ borderColor: doneBatchSet.has(batchIndex) ? 'var(--secondary-color)' : 'var(--mid-main-secondary)' }}
                            >
                                {doneBatchSet.has(batchIndex) ? 'Marked Done' : 'Mark Done'}
                            </button>
                        </div>

                        <p className='pt-3 text-sm font-semibold'>
                            <FiFileText className='pr-1 inline-block align-[-2px]' />
                            {formatBatchLabel(currentBatch, batchIndex)}
                        </p>

                        <textarea
                            readOnly
                            value={currentBatch.prompt_text}
                            className='pt-3 min-h-72 w-full rounded-md border bg-[var(--french-gray)] p-3 text-xs md:text-sm'
                            style={{ borderColor: 'var(--mid-main-secondary)' }}
                        />

                        <div className='pt-3'>
                            <p className='pb-1 text-xs font-semibold uppercase tracking-wide text-[var(--mid-main-secondary)]'>Run Notes</p>
                            <textarea
                                value={currentRunProgress.note || ''}
                                onChange={(event) => setRunNote(event.target.value)}
                                placeholder='Example: Completed page 1-16 today, continue from batch 9 tomorrow.'
                                className='min-h-24 w-full rounded-md border bg-[var(--french-gray)] p-3 text-xs md:text-sm'
                                style={{ borderColor: 'var(--mid-main-secondary)' }}
                            />
                        </div>
                    </>
                ) : (
                    <p className='pt-3 text-sm text-[var(--mid-main-secondary)]'>No queue loaded yet.</p>
                )}

                {!!notice && (
                    <p className='pt-3 text-sm font-semibold text-[var(--secondary-color)]'>
                        <FiCheck className='pr-1 inline-block align-[-2px]' />
                        {notice}
                    </p>
                )}

                {!!error && <p className='pt-3 text-sm font-semibold text-[var(--accent-color)]'>{error}</p>}
            </div>
        </section>
    );
};

export default AdminSolutionGenerator;