import { describe, expect, it } from 'vitest';
import { needsRefresh, toTokens } from './meme-api.ts';

// scope: "transfer_dubloons", unsigned payload — readScope must not care about the signature
const accessToken = `header.${btoa(JSON.stringify({ sub: 'x', scope: 'transfer_dubloons' }))}.sig`;

describe('toTokens', () => {
	it('maps expiry off the response, not a fixed guess', () => {
		const now = Date.UTC(2026, 0, 1);
		const tokens = toTokens(
			{ access_token: accessToken, refresh_token: 'r', expires_in: 600, token_type: 'Bearer' },
			now
		);

		expect(tokens.accessTokenExpiresAt.getTime()).toBe(now + 600_000);
		expect(tokens.refreshTokenExpiresAt.getTime()).toBe(now + 14 * 864e5);
		expect(tokens.scope).toBe('transfer_dubloons');
	});

	it('rejects a response missing the refresh token instead of storing undefined', () => {
		expect(() => toTokens({ access_token: accessToken, expires_in: 600 })).toThrow();
	});

	it('survives a token whose payload is not a JWT', () => {
		expect(toTokens({ access_token: 'nope', refresh_token: 'r', expires_in: 600 }).scope).toBe(
			undefined
		);
	});
});

describe('needsRefresh', () => {
	const now = Date.UTC(2026, 0, 1);

	it('refreshes inside the skew window, not only after expiry', () => {
		expect(needsRefresh({ accessTokenExpiresAt: new Date(now + 30_000) }, now)).toBe(true);
		expect(needsRefresh({ accessTokenExpiresAt: new Date(now + 600_000) }, now)).toBe(false);
		expect(needsRefresh({ accessTokenExpiresAt: null }, now)).toBe(true);
	});
});
