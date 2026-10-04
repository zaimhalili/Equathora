import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import GuestAvatar from '../assets/images/guestAvatar.png';

// In-memory module cache across route transitions
let cachedAvatarUrl = null;

const formatLowResUrl = (avatarUrl) => {
    if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim() === '') {
        return GuestAvatar;
    }

    try {
        const parsed = new URL(avatarUrl);
        if (!parsed.searchParams.has('w')) parsed.searchParams.set('w', '48');
        if (!parsed.searchParams.has('h')) parsed.searchParams.set('h', '48');
        if (!parsed.searchParams.has('q')) parsed.searchParams.set('q', '40');
        return parsed.toString();
    } catch {
        return avatarUrl;
    }
};

// Pre-decode standard image into browser memory
const preloadImage = (src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
};

export function useProfileAvatar() {
    // Initialize state synchronously from memory
    const [profileAvatarSrc, setProfileAvatarSrc] = useState(
        cachedAvatarUrl || GuestAvatar
    );

    useEffect(() => {
        // If already cached, don't re-query auth on every page switch
        if (cachedAvatarUrl) return;

        let isMounted = true;

        async function fetchSessionAvatar() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session || !isMounted) return;

                const metadata = session.user?.user_metadata || {};
                const rawUrl = metadata.avatar_url || metadata.picture || metadata.image || metadata.photo_url || '';
                const lowResUrl = formatLowResUrl(rawUrl);

                cachedAvatarUrl = lowResUrl;
                preloadImage(lowResUrl);

                if (isMounted) {
                    setProfileAvatarSrc(lowResUrl);
                }
            } catch (err) {
                console.error('Failed to load profile avatar:', err);
            }
        }

        fetchSessionAvatar();

        return () => {
            isMounted = false;
        };
    }, []);

    return { profileAvatarSrc };
}