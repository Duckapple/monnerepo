import { $ } from 'bun';
import tunnel from './tunnel.in.yaml';

const ingress = Object.keys(process.env)
	.filter((k) => k.endsWith('_ORIGIN'))
	.filter((k) => process.env[k.replace('_ORIGIN', '_PORT')])
	.map((k) => ({
		hostname: process.env[k]?.replace('https://', ''),
		service: `http://localhost:${process.env[k.replace('_ORIGIN', '_PORT')]}`,
	}))
	.sort((a, b) => a.service.localeCompare(b.service));
ingress.push({ service: 'http_status:404', hostname: undefined });

Bun.file('./tunnel.yaml').write(Bun.YAML.stringify({ ...tunnel, ingress }, null, 2));

await $`bun apps build`;

const serviceTemplate = await Bun.file('./services/service.in.service').text();
const apps: string[] = [];
for (const filepath of new Bun.Glob('../app/*/package.json').scanSync()) {
	const { version } = await Bun.file(filepath).json();
	if (!version.startsWith('0.')) {
		const appName = filepath.split('/')[2];
		apps.push(appName);
		const service = serviceTemplate.replaceAll('<NAME>', appName);
		Bun.file(`./services/${appName}.service`).write(service);
	}
}
console.log('Deploying these apps:', apps);

await $`ssh pi@pi.local "mkdir -p ~/deployment"`;
await $`scp ../.env pi@pi.local:~/deployment/.env`;

await $`scp -r ./tunnel.yaml pi@pi.local:~/.cloudflared/config.yaml`;
await $`ssh pi@pi.local "sudo systemctl restart cloudflared"`;

for (const appName of apps) {
	await $`scp -r ../app/${appName}/build pi@pi.local:~/deployment/${appName}-copy`;
	await $`scp ./services/${appName}.service pi@pi.local:~/deployment/${appName}.service`;
	await $`ssh pi@pi.local "rm -r ~/deployment/${appName} && mv ~/deployment/${appName}-copy ~/deployment/${appName}"`;
	await $`ssh pi@pi.local "sudo mv ~/deployment/${appName}.service /etc/systemd/system/${appName}.service"`;
	await $`ssh pi@pi.local "cd ~/deployment/${appName} && ~/.bun/bin/bun i -p && sudo systemctl restart ${appName}"`;
}

console.log('Done!');
