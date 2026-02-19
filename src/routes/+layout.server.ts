// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession } }) => {
	const sessionPromise = safeGetSession();

	return {
		session: sessionPromise.then((data) => {
			const session = data.session;
			// Sanitize session to prevent access to "user" property which logs warnings
			if (session) {
				// Manually construct session object to avoid accessing the 'user' getter
				// which triggers the warning.
				return {
					access_token: session.access_token,
					refresh_token: session.refresh_token,
					expires_in: session.expires_in,
					expires_at: session.expires_at,
					token_type: session.token_type,
					provider_token: session.provider_token,
					provider_refresh_token: session.provider_refresh_token
				} as any;
			}
			return session;
		}),
		user: sessionPromise.then((data) => data.user)
	};
};