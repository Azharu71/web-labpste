// src/lib/profile-cache.ts

interface UserData {
    nim: string | null;
    email: string | null;
    role: string | null;
}

interface CacheEntry {
    data: UserData;
    timestamp: number;
}

// Shared profile cache instance
const profileCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedProfile(userId: string): UserData | null {
    const cached = profileCache.get(userId);
    const now = Date.now();

    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
        return cached.data;
    }

    return null;
}

export function setCachedProfile(userId: string, userData: UserData): void {
    profileCache.set(userId, {
        data: userData,
        timestamp: Date.now()
    });
}

export function clearCachedProfile(userId: string): void {
    profileCache.delete(userId);
}

export function clearAllProfiles(): void {
    profileCache.clear();
}

// Clean up expired cache entries
export function cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of profileCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            profileCache.delete(key);
        }
    }
}

// Auto cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredCache, 10 * 60 * 1000);
}

/**
 * Mendapatkan role pengguna: cek in-memory cache terlebih dahulu,
 * jika cache miss (misal karena serverless cold-start / restart), query database profiles.
 */
export async function getUserRole(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    userId: string
): Promise<string | null> {
    const cached = getCachedProfile(userId);
    if (cached?.role) {
        return cached.role;
    }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('nim, roles ( name )')
            .eq('id', userId)
            .single();

        if (!profile) return null;

        const roleData = profile.roles;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleName = Array.isArray(roleData) ? roleData[0]?.name : (roleData as any)?.name;

        const userData: UserData = {
            nim: profile.nim || null,
            email: null,
            role: roleName || null
        };
        setCachedProfile(userId, userData);

        return roleName || null;
    } catch {
        return null;
    }
}

/**
 * Cek apakah pengguna memiliki hak akses Asisten atau Superuser (SU)
 * Aman untuk lingkungan serverless (Netlify Functions).
 */
export async function isAsistenOrSU(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    userId: string
): Promise<boolean> {
    const role = await getUserRole(supabase, userId);
    return role === 'Asisten' || role === 'SU';
}

export type { UserData };