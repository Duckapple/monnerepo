import { browser } from '$app/environment';
import { SPLENDOR_WS_PORT } from '$env/static/public';
import { app as wsApp } from '$backend/wss';
import { auth } from '$backend/auth.server';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

if (!browser) wsApp.listen(SPLENDOR_WS_PORT);

export async function handle({ event, resolve }) {
	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	// Make session and user available on server
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}
	return svelteKitHandler({ event, resolve, auth, building });
}
