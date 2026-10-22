import type { BetterAuthPlugin } from 'better-auth';
import { APIError, createAuthEndpoint, sessionMiddleware } from 'better-auth/api';
import * as v from 'valibot';

export const MEME_API_PROVIDER_ID = 'meme-api';

// MemeApi issues 14 day refresh tokens but only reports the access token lifetime.
const REFRESH_TOKEN_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000;

const TokenResponse = v.object({
	access_token: v.string(),
	refresh_token: v.string(),
	expires_in: v.number(),
});

const UserInfo = v.object({
	Id: v.string(),
	UserName: v.string(),
	ProfilePicURl: v.optional(v.string()),
});

export interface MemeApiTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	refreshTokenExpiresAt: Date;
	scope: string | undefined;
}

/**
 * Unverified read of the `scope` claim: MemeApi signs HS256 and keeps the secret. Bookkeeping
 * only — the API enforces what a token may actually do.
 */
function readScope(accessToken: string): string | undefined {
	const payload = accessToken.split('.')[1];
	if (!payload) return undefined;
	try {
		const claims: unknown = JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')));
		return v.parse(v.object({ scope: v.optional(v.string()) }), claims).scope;
	} catch {
		return undefined;
	}
}

async function postForm(baseURL: string, path: string, form: Record<string, string>) {
	const response = await fetch(new URL(path, baseURL), {
		method: 'POST',
		body: new URLSearchParams(form),
	});
	if (!response.ok) throw new Error(`MemeApi ${path} responded ${response.status}`);
	return response.json() as Promise<unknown>;
}

export function toTokens(response: unknown, now = Date.now()): MemeApiTokens {
	const { access_token, refresh_token, expires_in } = v.parse(TokenResponse, response);
	return {
		accessToken: access_token,
		refreshToken: refresh_token,
		accessTokenExpiresAt: new Date(now + expires_in * 1000),
		refreshTokenExpiresAt: new Date(now + REFRESH_TOKEN_LIFETIME_MS),
		scope: readScope(access_token),
	};
}

/** Rotating: the old token dies the moment this resolves, so callers must persist the result. */
export async function refreshMemeApiTokens(baseURL: string, refreshToken: string) {
	return toTokens(await postForm(baseURL, '/auth/refresh', { refresh_token: refreshToken }));
}

export function needsRefresh(account: { accessTokenExpiresAt: Date | null }, now = Date.now()) {
	return !account.accessTokenExpiresAt || account.accessTokenExpiresAt.getTime() - now < 60_000;
}

/**
 * MemeApi has no /authorize to redirect to, so neither `socialProviders` nor `genericOAuth`
 * fits: the Discord bot calls POST /auth/initiate and shows the user a single-use password
 * (60s), which this endpoint trades for an access/refresh pair.
 */
export const memeApi = ({ baseURL }: { baseURL: string | undefined }) =>
	({
		id: MEME_API_PROVIDER_ID,
		endpoints: {
			linkMemeApi: createAuthEndpoint(
				'/meme-api/link',
				{
					method: 'POST',
					use: [sessionMiddleware],
					body: v.object({ temporaryPassword: v.pipe(v.string(), v.trim(), v.nonEmpty()) }),
				},
				async (ctx) => {
					if (!baseURL) {
						throw new APIError('SERVICE_UNAVAILABLE', {
							code: 'MEME_API_NOT_CONFIGURED',
							message: 'MEME_API_URL is not set on this deployment.',
						});
					}

					let tokens: MemeApiTokens;
					try {
						tokens = toTokens(
							await postForm(baseURL, '/auth/login', {
								temporary_password: ctx.body.temporaryPassword,
							})
						);
					} catch {
						throw new APIError('UNAUTHORIZED', {
							code: 'INVALID_TEMPORARY_PASSWORD',
							message: 'That code is expired or already used. Ask the bot for a new one.',
						});
					}

					const response = await fetch(new URL('/auth/userinfo', baseURL), {
						headers: { authorization: `Bearer ${tokens.accessToken}` },
					});
					if (!response.ok) {
						throw new APIError('BAD_GATEWAY', {
							code: 'MEME_API_UNAVAILABLE',
							message: 'MemeApi rejected the token it just issued.',
						});
					}
					const userInfo = v.parse(UserInfo, await response.json());

					const userId = ctx.context.session.user.id;
					const existing = await ctx.context.internalAdapter.findAccountByProviderId(
						userInfo.Id,
						MEME_API_PROVIDER_ID
					);
					if (existing && existing.userId !== userId) {
						throw new APIError('CONFLICT', {
							code: 'ACCOUNT_ALREADY_LINKED',
							message: 'That MemeApi account is linked to another user.',
						});
					}

					if (existing) {
						await ctx.context.internalAdapter.updateAccount(existing.id, tokens);
					} else {
						await ctx.context.internalAdapter.linkAccount({
							userId,
							providerId: MEME_API_PROVIDER_ID,
							accountId: userInfo.Id,
							...tokens,
						});
					}

					return ctx.json({ username: userInfo.UserName, scope: tokens.scope });
				}
			),
		},
		rateLimit: [{ pathMatcher: (path) => path === '/meme-api/link', window: 60, max: 10 }],
	}) satisfies BetterAuthPlugin;
