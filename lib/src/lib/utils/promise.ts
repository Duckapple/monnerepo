export async function sleep(ms: number) {
	let res: (arg: unknown) => void;
	const promise = new Promise((r) => (res = r));
	setTimeout(() => res(null), ms);
	return promise;
}
