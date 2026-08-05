import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
	const id = url.searchParams.get('id');
	return redirect(302, `/new/${id}`);
}
