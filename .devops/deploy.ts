import { $ } from 'bun';

await $`bun apps build`;

console.log('Build complete, transferring files...');

await $`scp -r ./app/splendor/build pi@pi.local:~/splendor/frontend-copy`;
await $`scp ./.env pi@pi.local:~/splendor/frontend-copy/.env`;

await $`ssh pi@pi.local "rm -r ~/splendor/frontend && mv ~/splendor/frontend-copy ~/splendor/frontend"`;

await $`ssh pi@pi.local "cd ~/splendor/frontend && ~/.bun/bin/bun i -p && sudo systemctl restart splendor-frontend"`;

console.log('Done!');
