import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { supabase } from '../../lib/supabaseClient';

const EditProfileNameDialog = ({ isOpen, currentName, onClose, onSave }) => {
    const [name, setName] = useState(currentName || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useBodyScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) return;
        setName(currentName || '');
        setError('');
        inputRef.current?.focus();
    }, [currentName, isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !saving) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, saving]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fullName = name.trim();
        if (!fullName) {
            setError('Please enter your name.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('Please sign in to edit your profile.');

            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });
            if (authError) throw authError;

            const { data: updatedProfile, error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: fullName, updated_at: new Date().toISOString() })
                .eq('id', user.id)
                .select('id')
                .maybeSingle();
            if (profileError) throw profileError;
            if (!updatedProfile) throw new Error('Profile record was not found.');

            onSave({ full_name: fullName });
            onClose();
        } catch (saveError) {
            console.error('Failed to update profile name:', saveError);
            setError(saveError.message || 'Could not save your name. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close edit name dialog"
                disabled={saving}
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/50"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-profile-name-title"
                className="relative w-full max-w-md rounded-xl bg-(--white) p-6 shadow-2xl"
            >
                <div className="pb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="edit-profile-name-title" className="text-xl font-medium text-(--secondary-color)">
                            Edit name
                        </h2>
                        <p className="pt-1 text-sm text-(--secondary-color)/70">
                            This is the name shown on your profile.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                        className="rounded-full p-2 text-(--secondary-color)/70 transition hover:bg-(--main-color) hover:text-(--secondary-color) disabled:opacity-50"
                    >
                        <FaTimes aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="profile-full-name" className="pb-2 block text-sm font-medium text-(--secondary-color)">
                        Full name
                    </label>
                    <input
                        ref={inputRef}
                        id="profile-full-name"
                        type="text"
                        autoComplete="name"
                        maxLength={80}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full outline-transparent rounded-xl bg-(--main-color) px-3 py-2 text-(--secondary-color) focus:outline-(--black)! outline-2"
                    />
                    {error && <p role="alert" className="pt-2 text-sm text-(--dark-accent-color)">{error}</p>}

                    <div className="pt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="bg-(--main-color) rounded-xl py-1 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium px-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !name.trim()}
                            className="bg-(--secondary-color) rounded-xl py-1 text-center text-(--white) hover:brightness-95 hover:text-(--main-color) transition-all text-md font-medium px-4"
                        >
                            {saving ? 'Saving…' : 'Save name'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EditProfileNameDialog;
