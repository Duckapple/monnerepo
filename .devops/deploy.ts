import { $, YAML } from 'bun';
import tunnel from './tunnel.in.yaml';

const ingress = Object.keys(process.env)
	.filter((k) => k.endsWith('_ORIGIN'))
	.filter((k) => process.env[k.replace('_ORIGIN', '_PORT')])
	.map((k) => ({
		hostname: process.env[k]?.replace('https://', ''),
		service: `http://localhost:${process.env[k.replace('_ORIGIN', '_PORT')]}`,
	}));
ingress.push({ service: 'http_status:404' });

Bun.file('./tunnel.yaml').write(YAML.stringify({ ...tunnel, ingress }, null, 2));

await $`bun apps build`;

console.log('Build complete, transferring files...');

await $`scp -r ./app/splendor/build pi@pi.local:~/splendor/frontend-copy`;
await $`scp ./.env pi@pi.local:~/splendor/frontend-copy/.env`;

await $`ssh pi@pi.local "rm -r ~/splendor/frontend && mv ~/splendor/frontend-copy ~/splendor/frontend"`;

await $`ssh pi@pi.local "cd ~/splendor/frontend && ~/.bun/bin/bun i -p && sudo systemctl restart splendor-frontend"`;

console.log('Done!');
