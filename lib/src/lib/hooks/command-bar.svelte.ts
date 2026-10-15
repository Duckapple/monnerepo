import { useSharedStore } from './use-shared-store.svelte.ts';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

type RegType = 'run';

type ArgList<T extends unknown[]> = T extends [infer Arg, ...infer Rest]
	? [
			(
				| {
						prompt: string;
						parse: (input: string) => Arg | null;
				  }
				| {
						prompt: string;
						options: () => { label?: string; value: Arg }[];
				  }
			),
			...ArgList<Rest>,
		]
	: [];

type BaseReg = {
	id: string;
	type: RegType;
	label: string | ((input: string) => string);
};

type Registration<T extends unknown[]> = BaseReg &
	(
		| {
				actionArgs: NoInfer<ArgList<T>>;
				action: (...args: T) => void;
		  }
		| { action: () => void }
	);

interface CommandChoice {
	id: string;
	label: string;
}

class CommandBarStore {
	#registrations = new SvelteMap<string, Registration<any>>();

	on<T extends unknown[]>(reg: Registration<T>) {
		this.#registrations.set(reg.id, reg);
		return reg;
	}
	off<T extends unknown[]>(reg: Registration<T>) {
		this.#registrations.delete(reg.id);
	}

	open = $state(false);

	inputText = $state('');

	findOptions(input: string) {
		const lowerInput = input.toLowerCase();
		const items: CommandChoice[] = [];
		for (const [id, item] of this.#registrations) {
			const label = typeof item.label === 'string' ? item.label : item.label(input);
			if (label.toLowerCase().includes(lowerInput)) items.push({ id, label });
		}
		return items;
	}

	choose(item: CommandChoice) {
		const reg = this.#registrations.get(item.id);
		if (!reg) return;
		if ('actionArgs' in reg) throw Error('Not implemented');
		reg?.action();
		this.open = false;
	}
}

const key = Symbol();
export const useCommandBar = () => useSharedStore(key, CommandBarStore);

const _test1 = () => {
	const x = new CommandBarStore();

	x.on({
		id: 'change-funny',
		type: 'run',
		label: 'change the funny',
		action: (a: 'funny' | 'not funny') => console.log(a),
		actionArgs: [
			{
				prompt: 'is it funny?',
				options: () => [{ value: 'funny' }, { value: 'not funny' }] as const,
			},
		],
	});
};
