const glob = new Bun.Glob('./app/*/src/lib/db/schema.ts');

const file = Bun.file('./.drizzle/scripts/app-schemas.ts');
file.write([...glob.scanSync()].map((path) => `export * from '../.${path}';`).join('\n'));
