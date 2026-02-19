// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';

// Cache untuk menyimpan data user sementara (mengurangi request ke Supabase)
// Key: Access Token, Value: { user: User, expires: number }
const userCache = new Map<string, { user: User; expires: number }>();
const CACHE_TTL = 60 * 1000; // 60 detik

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					// Enforce 1 hour expiration (3600 seconds)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { expires, ...restOptions } = options;
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

				// 4. Simpan ke Cache
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
