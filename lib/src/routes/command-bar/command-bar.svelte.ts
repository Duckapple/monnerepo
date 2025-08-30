import { useSharedStore } from '$lib/hooks/use-shared-store.svelte.ts';

class CommandBarStore {}

const key = Symbol();
export const useCommandBar = () => useSharedStore(key, CommandBarStore);
