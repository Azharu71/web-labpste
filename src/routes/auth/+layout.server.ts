// src/routes/auth/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, url }) => {
    const { session } = await safeGetSession();

    // Define routes that should be accessible even when authenticated
    const allowedAuthenticatedRoutes = [
        '/auth/logout',
        '/auth/resetpassword'
    ];

    // If user is authenticated and trying to access restricted auth pages
    if (session && !allowedAuthenticatedRoutes.some(route => url.pathname.startsWith(route))) {
        throw redirect(303, '/dashboard');
    }
};
