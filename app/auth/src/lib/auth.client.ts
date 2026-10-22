import { createAuthClient } from 'better-auth/svelte';
import { usernameClient } from 'better-auth/client/plugins';
import { memeApiClient } from './plugins/meme-api.client.ts';

export const authClient = createAuthClient({
	plugins: [usernameClient(), memeApiClient()],
});
