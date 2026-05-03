import { supabase } from './supabaseClient';
import { buildApiBaseCandidates, getAdminApiHeaders } from './adminAuth';

const toTitleCase = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};

const isJsonContentType = (contentType) => {
    const normalized = String(contentType || '').toLowerCase();
    return normalized.includes('application/json') || normalized.includes('+json');
};

const pickProfileValue = (profile, keys) => {
    for (const key of keys) {
        const value = profile?.[key];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }

    return undefined;
};

const fetchAdminUsersFromBackend = async () => {
    const endpoint = '/api/admin/users';
    const baseCandidates = buildApiBaseCandidates();

    for (const apiBase of baseCandidates) {
        const requestUrl = `${apiBase}${endpoint}`;

        try {
            const adminHeaders = await getAdminApiHeaders();
            if (!adminHeaders) {
                throw new Error('Missing admin session.');
            }

            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    ...adminHeaders
                },
                credentials: 'omit'
            });

            if (!response.ok) {
                continue;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!isJsonContentType(contentType)) {
                continue;
            }

            return await response.json();
        } catch {
            // Try next candidate.
        }
    }

    throw new Error('Admin users endpoint unavailable.');
};

const mapRoleLabel = (rawRole) => {
    const role = String(rawRole || '').toLowerCase();
    if (role === 'admin') return 'Admin';
    if (role === 'teacher' || role === 'mentor') return 'Mentor';
    if (role === 'parent') return 'Parent';
    return 'Student';
};

const inferStatus = (profile) => {
    const accountStatus = String(
        pickProfileValue(profile, ['account_status', 'accountStatus']) || ''
    ).toLowerCase();
    if (accountStatus === 'suspended') return 'Suspended';
    if (accountStatus === 'inactive') return 'Inactive';
    if (accountStatus === 'active') return 'Active';

    if (pickProfileValue(profile, ['is_suspended', 'isSuspended']) === true) return 'Suspended';
    if (pickProfileValue(profile, ['is_active', 'isActive']) === false) return 'Inactive';
    return 'Active';
};

const mapPermissionLabel = (roleLabel) => {
    if (roleLabel === 'Admin') return 'Full Access';
    if (roleLabel === 'Mentor') return 'Mentor Review';
    return 'Standard';
};

const inferVerification = (profile, roleLabel) => {
    const raw = String(
        pickProfileValue(profile, ['mentor_verification', 'mentorVerification', 'mentor_status', 'mentorStatus']) || ''
    ).trim();
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
    return pickProfileValue(profile, ['full_name', 'fullName'])
        || pickProfileValue(profile, ['username'])
        || pickProfileValue(profile, ['display_name', 'displayName'])
        || pickProfileValue(profile, ['email'])?.split('@')?.[0]
        || 'Unknown User';
};

export async function getAdminUsers() {
    const { profiles, progress } = await fetchAdminUsersFromBackend();

    const progressByUserId = (progress || []).reduce((map, row) => {
        map.set(String(row.userId || row.user_id), row);
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

    if (Object.prototype.hasOwnProperty.call(profile, 'account_status') || Object.prototype.hasOwnProperty.call(profile, 'accountStatus')) {
        patch.account_status = nextStatus.toLowerCase();
    }

    if (Object.prototype.hasOwnProperty.call(profile, 'is_suspended') || Object.prototype.hasOwnProperty.call(profile, 'isSuspended')) {
        patch.is_suspended = nextStatus === 'Suspended';
    }

    if (Object.prototype.hasOwnProperty.call(profile, 'is_active') || Object.prototype.hasOwnProperty.call(profile, 'isActive')) {
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
