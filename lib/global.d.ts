import '@total-typescript/ts-reset';

declare interface String {
	startsWith<T extends string>(searchString: T): this is `${T}${string}`;
	includes<T extends string>(searchString: T): this is `${string}${T}${string}`;
}
