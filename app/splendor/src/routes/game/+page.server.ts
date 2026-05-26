import { error, redirect } from '@sveltejs/kit';

export function load({ url }) {
	const id = url.searchParams.get('id');
	if (!id) error(400, 'ID undefined');
	redirect(303, `/game/${id}`);
}
