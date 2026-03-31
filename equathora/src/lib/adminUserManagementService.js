import { supabase } from './supabaseClient';

const toTitleCase = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};

const mapRoleLabel = (rawRole) => {
    const role = String(rawRole || '').toLowerCase();
    if (role === 'admin') return 'Admin';
    if (role === 'teacher' || role === 'mentor') return 'Mentor';
    if (role === 'parent') return 'Parent';
    return 'Student';
};

const inferStatus = (profile) => {
    const accountStatus = String(profile?.account_status || '').toLowerCase();
    if (accountStatus === 'suspended') return 'Suspended';
    if (accountStatus === 'inactive') return 'Inactive';
    if (accountStatus === 'active') return 'Active';

    if (profile?.is_suspended === true) return 'Suspended';
    if (profile?.is_active === false) return 'Inactive';
    return 'Active';
};

const mapPermissionLabel = (roleLabel) => {
    if (roleLabel === 'Admin') return 'Full Access';
    if (roleLabel === 'Mentor') return 'Mentor Review';
    return 'Standard';
};

const inferVerification = (profile, roleLabel) => {
    const raw = String(profile?.mentor_verification || profile?.mentor_status || '').trim();
    if (raw) {
        const normalized = raw.toLowerCase();
        if (normalized === 'verified') return 'Verified';
        if (normalized === 'pending') return 'Pending';
        if (normalized === 'rejected') return 'Rejected';
    }

    if (roleLabel === 'Mentor') return 'Pending';
    return 'Not Required';
};

const toDateKey = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
    const key = toDateKey(value);
    if (!key) return '-';
    return new Date(value).toLocaleDateString();
};

const pickProfileTimestamp = (profile, candidates) => {
    for (const key of candidates) {
        const value = profile?.[key];
        if (value) return value;
    }
    return null;
};

const getDisplayName = (profile) => {
    return profile?.full_name
        || profile?.username
        || profile?.display_name
        || profile?.email?.split('@')?.[0]
        || 'Unknown User';
};

export async function getAdminUsers() {
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

    if (profileError) {
        throw new Error(profileError.message || 'Failed to fetch users.');
    }

    const { data: progressRows, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id,total_attempts,wrong_submissions');

    if (progressError) {
        throw new Error(progressError.message || 'Failed to fetch user progress.');
    }

    const progressByUserId = (progressRows || []).reduce((map, row) => {
        map.set(String(row.user_id), row);
        return map;
    }, new Map());

    const normalized = (profiles || []).map((profile) => {
        const userId = String(profile.id);
        const role = mapRoleLabel(profile.role);
        const stats = progressByUserId.get(userId) || { total_attempts: 0, wrong_submissions: 0 };
        const joinedSource = pickProfileTimestamp(profile, ['created_at', 'createdAt', 'joined_at', 'inserted_at']);
        const lastSeenSource = pickProfileTimestamp(profile, ['last_seen_at', 'lastSeenAt', 'updated_at', 'updatedAt', 'created_at', 'createdAt']);

        return {
            id: userId,
            name: getDisplayName(profile),
            email: profile.email || '-',
            role,
            permission: mapPermissionLabel(role),
            status: inferStatus(profile),
            mentorVerification: inferVerification(profile, role),
            joinedAt: formatDate(joinedSource),
            joinedAtKey: toDateKey(joinedSource),
            lastSeen: formatDate(lastSeenSource),
            lastSeenKey: toDateKey(lastSeenSource),
            reports: Number(stats.wrong_submissions || 0),
            sessions: Number(stats.total_attempts || 0),
            rawProfile: profile
        };
    });

    return normalized.sort((a, b) => {
        const aTime = a.joinedAtKey ? new Date(a.joinedAtKey).getTime() : 0;
        const bTime = b.joinedAtKey ? new Date(b.joinedAtKey).getTime() : 0;
        if (aTime !== bTime) return bTime - aTime;
        return a.name.localeCompare(b.name);
    });
}

export async function updateAdminUserRole(userId, roleLabel) {
    const roleMap = {
        Student: 'student',
        Mentor: 'teacher',
        Admin: 'admin',
        Parent: 'parent'
    };

    const nextRole = roleMap[roleLabel] || 'student';

    const { error } = await supabase
        .from('profiles')
        .update({ role: nextRole })
        .eq('id', userId);

    if (error) {
        throw new Error(error.message || 'Failed to update role.');
    }
}

export async function updateAdminUserStatus(user) {
    const nextStatus = String(user?.status || 'Active');
    const patch = {};
    const profile = user?.rawProfile || {};

    if (Object.prototype.hasOwnProperty.call(profile, 'account_status')) {
        patch.account_status = nextStatus.toLowerCase();
    }

    if (Object.prototype.hasOwnProperty.call(profile, 'is_suspended')) {
        patch.is_suspended = nextStatus === 'Suspended';
    }

    if (Object.prototype.hasOwnProperty.call(profile, 'is_active')) {
        patch.is_active = nextStatus === 'Active';
    }

    if (!Object.keys(patch).length) {
        throw new Error('No writable status field found on profile schema.');
    }

    const { error } = await supabase
        .from('profiles')
        .update(patch)
        .eq('id', user.id);

    if (error) {
        throw new Error(error.message || 'Failed to update status.');
    }
}

export async function updateAdminMentorVerification(userId, verificationLabel) {
    const { error } = await supabase
        .from('profiles')
        .update({ mentor_verification: verificationLabel.toLowerCase() })
        .eq('id', userId);

    if (error) {
        throw new Error(error.message || 'Failed to update mentor verification.');
    }
}

export async function resetAdminUserSessions(userId) {
    const { error } = await supabase
        .from('user_progress')
        .update({
            total_attempts: 0,
            wrong_submissions: 0,
            correct_answers: 0
        })
        .eq('user_id', userId);

    if (error) {
        throw new Error(error.message || 'Failed to reset sessions.');
    }
}

export const adminUserEnums = {
    roleOptions: ['Student', 'Mentor', 'Admin', 'Parent'],
    statusOptions: ['Active', 'Inactive', 'Suspended'],
    verificationOptions: ['Not Required', 'Pending', 'Verified', 'Rejected']
};
