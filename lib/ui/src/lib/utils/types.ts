export type Falsy = 0 | '' | null | undefined | false | 0n;

export type MaybePromise<T> = T | Promise<T>;
