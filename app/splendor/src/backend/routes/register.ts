import Bun from 'bun';
import type { Static } from 'elysia';
import { db } from '../common/db';
import { loginSchema, authSchema } from '../common/auth';
import { User } from '@sgk/lib/db';

export async function post(
	{ userName, password }: Static<typeof loginSchema>,
	sign: (i: Static<typeof authSchema>) => Promise<string>,
	setCookie: (value: string) => void
) {
	const id = crypto.randomUUID();
	const bcryptPassword = Bun.password.hash(password, { algorithm: 'bcrypt', cost: 12 });
	const [_, jwt] = await Promise.all([
		bcryptPassword.then((bcrypt) => db.insert(User).values({ id, userName, bcrypt })),
		sign({ id, userName })
	]);

	setCookie(jwt);

	return { jwt };
}
