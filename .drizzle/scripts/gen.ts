import * as Bun from 'bun';

const file = Bun.file('./.drizzle/scripts/app-schemas.ts');
file.write(
	[...new Bun.Glob('./app/*/src/lib/db/schema.ts').scanSync()]
		.map((path) => `export * from '../.${path}';`)
		.join('\n')
);
