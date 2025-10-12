// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'
import type { Session, User } from '@supabase/supabase-js'

export const handle: Handle = async ({ event, resolve }) => {
    // Flag to track if we're in a cookie-safe context
    let cookiesCanBeSet = true;

    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            /**
             * Note: You have to add the `path` variable to the
             * set and remove method due to sveltekit's cookie API
             * requiring this to be set, setting the path to `/`
             * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
             */
            setAll: (cookiesToSet) => {
                // Only set cookies if we're still in a safe context
                if (cookiesCanBeSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        try {
                            event.cookies.set(name, value, { ...options, path: '/' })
                        } catch (error) {
                            // Silently ignore cookie setting errors after response generation
                            console.warn(`Failed to set cookie ${name}:`, error);
                        }
                    })
                }
            },
        },
    })

    /**
     * Optimized session validation - memoized per request to prevent duplicate calls
     */
    let sessionPromise: Promise<{ session: Session | null; user: User | null }> | null = null;

    event.locals.safeGetSession = async () => {
        // Return memoized result if already called in this request
        if (sessionPromise) {
            return sessionPromise;
        }

        // Create and cache the promise
        sessionPromise = (async () => {
            try {
                const { data: { user }, error } = await event.locals.supabase.auth.getUser()
                if (error || !user) {
                    return { session: null, user: null }
                }

                const { data: { session } } = await event.locals.supabase.auth.getSession()
                return { session, user }
            } catch {
                return { session: null, user: null }
            }
        })();

        return sessionPromise;
    }

    // Eagerly get session to trigger any necessary cookie operations before response
    await event.locals.safeGetSession();

    const response = await resolve(event, {
        filterSerializedResponseHeaders(name: string) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    });

    // Mark that cookies can no longer be safely set
    cookiesCanBeSet = false;

    return response;
}