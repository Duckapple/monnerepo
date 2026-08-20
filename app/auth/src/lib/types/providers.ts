import type { Component } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import IconDiscord from '~icons/ic/baseline-discord';
import IconPassword from '~icons/ic/baseline-password';
import IconCrab from '~icons/lucide-lab/crab';

export const PROVIDERS = ['credential', 'discord', 'meme-api'] as const;

export type Provider = (typeof PROVIDERS)[number];

type IconComponent = Component<SvelteHTMLElements['svg']>;

interface ProviderDetails {
	label: string;
	icon: IconComponent;
	hidden?: boolean;
}

export const PROVIDER_DETAILS: Record<Provider | (string & {}), ProviderDetails | undefined> = {
	credential: { label: 'Username & Password', icon: IconPassword },
	discord: { label: 'Discord', icon: IconDiscord },
	'meme-api': { label: 'Meme API', icon: IconCrab },
};

export const VISIBLE_PROVIDERS = PROVIDERS.filter(
	(provider) => !PROVIDER_DETAILS[provider]?.hidden
);
