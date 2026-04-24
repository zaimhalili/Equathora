import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaUser, FaEnvelope, FaGlobeAmericas } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    useBodyScrollLock(isOpen);

    const [formData, setFormData] = useState({
        full_name: userData?.name || '',
        username: userData?.username || '',
        bio: userData?.bio || '',
        location: userData?.location || '',
        website: userData?.website || '',
        avatar_url: userData?.avatar_url || ''
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(userData?.avatar_url || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        setFormData({
            full_name: userData?.name || '',
            username: userData?.username || '',
            bio: userData?.bio || '',
            location: userData?.location || '',
            website: userData?.website || '',
            avatar_url: userData?.avatar_url || ''
        });
        setAvatarPreview(userData?.avatar_url || '');
        setAvatarFile(null);
        setError('');
    }, [isOpen, userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }

            try {
                // Compress image to reduce bandwidth usage
                const options = {
                    maxSizeMB: 0.1,        // 100KB max
                    maxWidthOrHeight: 300,  // 300x300px
                    useWebWorker: true,
                    fileType: 'image/jpeg'  // Convert to JPEG for better compression
                };

                setError('Compressing image...');
                const compressedFile = await imageCompression(file, options);
                setAvatarFile(compressedFile);

                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                    setError(''); // Clear message
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
                setError('Failed to process image. Please try another one.');
            }
        }
    };

    const uploadAvatar = async (userId) => {
        if (!avatarFile) return formData.avatar_url;

        try {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${userId}_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('user-avatars')
                .upload(filePath, avatarFile, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('user-avatars')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw new Error('Failed to upload avatar');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('Please log in to edit your profile');
                return;
            }

            const userId = session.user.id;

            // Upload avatar if changed
            let avatarUrl = formData.avatar_url;
            if (avatarFile) {
                avatarUrl = await uploadAvatar(userId);
            }

            // Update auth metadata so session reflects new profile fields
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.full_name,
                    preferred_username: formData.username,
                    bio: formData.bio,
                    location: formData.location,
                    website: formData.website,
                    avatar_url: avatarUrl
                }
            });

            if (updateError) throw updateError;

            // Persist profile data in profiles table so leaderboards and public views have latest info
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: formData.full_name,
                    username: formData.username,
                    avatar_url: avatarUrl,
                    bio: formData.bio,
                    location: formData.location,
                    website: formData.website,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

            if (profileError) throw profileError;

            // Call onSave callback with updated data
            onSave({
                ...formData,
                avatar_url: avatarUrl
            });

            // Refresh the auth session so new metadata (name/avatar) is immediately available elsewhere
            await supabase.auth.refreshSession();

            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[var(--raisin-black)]/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[var(--white)] rounded-md shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[var(--white)] border-b border-[var(--mid-main-secondary)] px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-2xl font-bold text-[var(--secondary-color)] font-[Sansation]">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--mid-main-secondary)] hover:text-[var(--secondary-color)] transition-colors p-2 hover:bg-[var(--main-color)] rounded-md cursor-pointer active:scale-95"
                            aria-label="Close modal"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 text-[var(--dark-accent-color)] px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <img
                                    src={avatarPreview || '/src/assets/images/guestAvatar.png'}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[var(--mid-main-secondary)]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 bg-[var(--raisin-black)]/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer active:scale-95"
                                >
                                    <FaCamera className="text-[var(--white)] text-2xl" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-[var(--mid-main-secondary)]">Click to change your profile picture <strong>(Max 5 MB)</strong></p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="flex text-sm font-semibold text-[var(--secondary-color)] pb-2 items-end">
                                    <FaUser className="h-5 w-5 pr-2" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    required
                                    className="text-[var(--secondary-color)] w-full px-4 py-3 border border-[var(--mid-main-secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="flex text-sm font-semibold text-[var(--secondary-color)] py-2 items-end">
                                    <FaUser className="h-5 w-5 pr-2" />
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    pattern="^[a-zA-Z0-9_]{3,20}$"
                                    className="text-[var(--secondary-color)] w-full px-4 py-3 border border-[var(--mid-main-secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                                    placeholder="username_123"
                                />
                                <p className="text-xs text-[var(--mid-main-secondary)] pt-2">3-20 characters, letters, numbers, and underscores only</p>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-semibold text-[var(--secondary-color)] py-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows={4}
                                    maxLength={200}
                                    className="text-[var(--secondary-color)] w-full px-4 py-3 border border-[var(--mid-main-secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us about yourself... (max 200 characters)"
                                />
                                <p className="text-xs text-[var(--mid-main-secondary)] pt-1 text-right">{formData.bio.length}/200</p>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="flex text-sm font-semibold text-[var(--secondary-color)] pb-2">
                                    <FaGlobeAmericas className="h-5 w-5 pr-2" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="text-[var(--secondary-color)] w-full px-4 py-3 border border-[var(--mid-main-secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all"
                                    placeholder="City, Country"
                                />
                            </div>

                            {/* Website */}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 border border-[var(--mid-main-secondary)] text-[var(--secondary-color)] font-semibold rounded-md hover:bg-[rgba(0,0,0,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-[var(--white)] font-semibold rounded-md hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditProfileModal;
