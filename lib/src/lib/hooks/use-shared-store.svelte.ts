import { getContext, hasContext, setContext } from 'svelte';

export function useSharedStore<T>(key: symbol, constr: new () => T): T;
export function useSharedStore<T, I extends unknown[]>(
	key: symbol,
	constr: new (...args: I) => T,
	...initial: I | []
): T;
export function useSharedStore<T, I extends unknown[]>(
	key: symbol,
	constr: new (...args: I) => T,
	initial?: I
): T {
	if (hasContext(key)) return getContext(key);
	let res;
	if (!constr.length) {
		res = new (constr as new () => T)();
	} else if (!initial) {
		throw Error(`${constr.name} was not initialized before use`);
	} else {
		res = new constr(...initial);
	}

	return setContext(key, res);
}
