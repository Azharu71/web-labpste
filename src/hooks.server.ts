// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';

// Cache untuk menyimpan data user sementara (mengurangi request ke Supabase)
// Key: Access Token, Value: { user: User, expires: number }
const userCache = new Map<string, { user: User; expires: number }>();
const CACHE_TTL = 60 * 1000; // 60 detik
const USER_CACHE_MAX_SIZE = 500; // Batas maksimal entri cache

// Evict entri expired; jika masih penuh, hapus entri terlama
function evictCache() {
	const now = Date.now();
	for (const [key, val] of userCache) {
		if (val.expires <= now) userCache.delete(key);
	}
	if (userCache.size >= USER_CACHE_MAX_SIZE) {
		// Hapus entri pertama (FIFO — Map mempertahankan insertion order)
		userCache.delete(userCache.keys().next().value!);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					// Strip both `expires` and `maxAge` dari Supabase agar tidak ada
					// nilai pendek (misal code verifier PKCE) yang lolos dan menyebabkan
					// link reset password expire terlalu cepat.
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { expires, maxAge, ...restOptions } = options;
					event.cookies.set(name, value, { ...restOptions, maxAge: 3600, path: '/' });
				});
			}
		}
	});

	// Memoization untuk mencegah request ganda ke Supabase dalam satu siklus request
	let sessionPromise: Promise<{ session: Session | null; user: User | null }> | null = null;

	event.locals.safeGetSession = async () => {
		if (sessionPromise) {
			return sessionPromise;
		}

		sessionPromise = (async () => {
			try {
				// 1. Cek session lokal (Cookie) untuk mendapatkan token
				const {
					data: { session }
				} = await event.locals.supabase.auth.getSession();

				if (!session) {
					return { session: null, user: null };
				}

				// 2. Cek Cache Server
				const token = session.access_token;
				const cached = userCache.get(token);

				if (cached && cached.expires > Date.now()) {
					// Hit Cache: Gunakan data user dari cache
					return { session, user: cached.user };
				}

				// 3. Validasi ke Supabase menggunakan getUser (Aman & Official Pattern)
				const {
					data: { user },
					error
				} = await event.locals.supabase.auth.getUser();

				if (error || !user) {
					// Token tidak valid/expired di server
					userCache.delete(token); // Bersihkan cache jika ada
					return { session: null, user: null };
				}

				// 4. Simpan ke Cache (evict jika perlu sebelum insert)
				if (!userCache.has(token)) evictCache();
				userCache.set(token, { user, expires: Date.now() + CACHE_TTL });

				return { session, user };
			} catch {
				return { session: null, user: null };
			}
		})();

		return sessionPromise;
	};

	// Validasi session di awal request (sudah dimatikan untuk performa)
	// await event.locals.safeGetSession();

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name: string) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});

	return response;
};
