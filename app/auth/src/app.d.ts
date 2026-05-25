// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: import('better-auth').Session;
			user?: import('better-auth').User & { username?: string };
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

import '@sgk/lib/global.d.ts';

export {};
