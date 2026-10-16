import React, { useState } from 'react';
import { FaEnvelope, FaCalendar, FaBook, FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import GuestAvatar from '../../assets/images/guestAvatar.png';
import { useProfileData } from '../../hooks/useProfileData';
import HoverLabel from '../ui/HoverLabel';
import ProfileEditButton from '../ui/ProfileEditButton';
import EditProfileModal from '../EditProfileModal';
import EditProfileNameDialog from './EditProfileNameDialog';

const formatDate = (date) => {
    if (!date) return 'Not available';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'Not available';
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(parsedDate);
};

const ProfileComponent = () => {
    const { userData, loading, error, handleProfileSave } = useProfileData();
    const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
    const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

    if (loading) {
        return (
            <section className="gap-10 flex flex-col bg-(--white)">
                <div className="flex flex-col gap-2 font-medium text-(--secondary-color)">
                    <h2 className="text-2xl">Account</h2>
                    <h3 className="text-sm text-(--secondary-color)/70">Manage your account details, cookie preferences, and account access.</h3>
                </div>
                <article className="rounded-2xl border-(--main-color) flex flex-col gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]" aria-label="Loading profile" aria-busy="true">
                    <div className="bg-(--main-color) w-full h-25 rounded-t-2xl animate-pulse" />
                    <div className="flex flex-col gap-10 px-7 py-5 sm:flex-row">
                        <div className="flex flex-1 flex-col gap-3">
                            <div className="h-7 w-40 animate-pulse rounded bg-(--main-color)" />
                            <div className="h-5 w-52 animate-pulse rounded bg-(--main-color)" />
                            <div className="h-5 w-44 animate-pulse rounded bg-(--main-color)" />
                            <div className="h-5 w-36 animate-pulse rounded bg-(--main-color)" />
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((item) => (
                                <div key={item} className="h-24 animate-pulse rounded-2xl bg-(--main-color)" />
                            ))}
                        </div>
                    </div>
                </article>
            </section>
        );
    }

    if (error || !userData) {
        return (
            <section className="gap-10 flex flex-col bg-(--white)">
                <div className="flex flex-col gap-2 font-medium text-(--secondary-color)">
                    <h2 className="text-2xl">Profile</h2>
                    <h3 className="text-sm text-(--secondary-color)/70">Manage your profile details, cookie preferences, and account access.</h3>
                </div>
                <p role="alert" className="rounded-2xl bg-(--main-color) p-5 text-sm text-(--secondary-color)">
                    {error || 'Profile information is not available.'}
                </p>
            </section>
        );
    }

    const { stats } = userData;

    return (
        <section className='gap-10 flex flex-col bg-(--white)'>
            <div className="flex flex-col gap-2 font-medium text-(--secondary-color)">
                <h2 className='text-2xl'>Profile</h2>
                <h3 className='text-sm text-(--secondary-color)/70'>Manage your profile details, cookie preferences, and account access.</h3>
            </div>

            {/* Profile */}
            <article className='rounded-2xl border-(--main-color) flex flex-col gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'>
                {/* Top Part */}
                <div className="bg-linear-to-tr from-(--accent-color) to-(--dark-accent-color) w-full h-full min-h-25 max-h-25 relative rounded-t-2xl">
                    {/* Profile Image Circle */}
                    <div className="group absolute left-6 -bottom-9 h-20 w-20 rounded-full md:h-23 md:w-23">
                        <img
                            src={userData.avatar_url?.trim() || GuestAvatar}
                            alt="Profile Picture"
                            className='h-full w-full rounded-full border-3 border-(--white) object-cover bg-(--main-color)'
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = GuestAvatar;
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />
                        <ProfileEditButton
                            onClick={() => setIsProfileEditorOpen(true)}
                            label="Change profile picture"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>
                    {/* Achievements Circle */}
                    <Link to="/achievements/recent" className="flex justify-center items-center rounded-full text-(--secondary-color)/70 p-4 text-xl absolute right-6 -bottom-6 bg-(--main-color) hover:text-(--secondary-color) hover:brightness-95 group outline outline-dashed border-(--french-gray)">
                        <FaTrophy />
                        <HoverLabel
                            className={'group-hover:flex hidden'}
                            text={"View achievements"} />
                    </Link>
                </div>
                {/* Bottom */}
                <div className="flex sm:flex-row flex-col gap-10 bg-(--white) w-full px-7 py-5">
                    {/* Left Side Data */}
                    <div className="flex flex-col text-(--secondary-color)/70 flex-1 sm:max-w-2/5 gap-2">
                        <div className="group flex w-fit max-w-full items-center gap-2 pb-2">
                            <h4 className='truncate text-(--secondary-color) text-2xl font-medium'>{userData.name}</h4>
                            <ProfileEditButton
                                onClick={() => setIsNameDialogOpen(true)}
                                label="Edit profile name"
                                className="h-7 w-7 shrink-0"
                            />
                        </div>
                        <div className="flex gap-2 items-center min-w-0">
                            <FaEnvelope className="shrink-0" />
                            <span className="truncate">{userData.email || 'Email not available'}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <FaCalendar className="shrink-0" />
                            Joined {formatDate(userData.createdAt)}
                        </div>
                        <div className="flex gap-2 items-center">
                            <FaBook className="shrink-0" />
                            {userData.role
                                ? `${userData.role.charAt(0).toUpperCase()}${userData.role.slice(1)}`
                                : 'Role not set'}
                        </div>
                    </div>
                    {/* Right Side Boxes */}
                    <div className="flex flex-col flex-1 gap-3 sm:max-w-3/5">
                        <div className="flex gap-3">
                            <div className="flex flex-col bg-(--main-color) rounded-2xl px-5 py-3 flex-1 justify-between gap-2 overflow-hidden">
                                <p className='text-xs text-(--secondary-color)/70'>Current Streak</p>
                                <p className='text-2xl text-(--secondary-color)'>{stats.currentStreak} days</p>
                            </div>
                            <div className="flex flex-col bg-(--main-color) rounded-2xl flex-1 px-5 py-3 justify-between gap-2 overflow-hidden">
                                <p className='text-xs text-(--secondary-color)/70'>Longest Streak</p>
                                <p className='text-2xl text-(--secondary-color)'>{stats.longestStreak} days</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col bg-(--main-color) rounded-2xl flex-1 px-5 py-3 justify-between gap-2 overflow-hidden">
                                <p className='text-xs text-(--secondary-color)/70'>Problems solved</p>
                                <p className='text-2xl text-(--secondary-color)'>{stats.problemsSolved}</p>
                            </div>
                            <div className="flex flex-col bg-(--main-color) rounded-2xl flex-1 px-5 py-3 justify-between gap-2 overflow-hidden">
                                <p className='text-xs text-(--secondary-color)/70'>Accuracy</p>
                                <p className='text-2xl text-(--secondary-color)'>{stats.accuracy === null ? 'N/A' : `${stats.accuracy}%`}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </article>
            <EditProfileModal
                isOpen={isProfileEditorOpen}
                onClose={() => setIsProfileEditorOpen(false)}
                userData={userData}
                onSave={handleProfileSave}
            />
            <EditProfileNameDialog
                isOpen={isNameDialogOpen}
                currentName={userData.name}
                onClose={() => setIsNameDialogOpen(false)}
                onSave={handleProfileSave}
            />
        </section>
    );
};

export default ProfileComponent;
