import '@total-typescript/ts-reset';

declare interface String {
	startsWith<T extends string>(searchString: T): this is `${T}${string}`;
	includes<T extends string>(searchString: T): this is `${string}${T}${string}`;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: import('better-auth').Session;
			user?: import('better-auth').User & { username?: string | null };
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
