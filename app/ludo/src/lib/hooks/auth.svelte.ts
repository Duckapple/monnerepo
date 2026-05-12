import { useSharedStore } from '@sgk/lib/hooks';

class Auth {}

const key = Symbol();

export function getAuthStore() {
	return useSharedStore<Auth>(key, Auth);
}
