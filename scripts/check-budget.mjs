// Dry-run of the team quota: sums resource requests across deploy/*.yaml.
import { readdirSync, readFileSync } from 'node:fs';
const LIMIT = { cpu: 2000, memMi: 4096 }; // 2 CPU / 4 GiB
const toMilli = (v) => (v.endsWith('m') ? Number(v.slice(0, -1)) : Number(v) * 1000);
const toMi = (v) => (v.endsWith('Gi') ? Number(v.slice(0, -2)) * 1024 : v.endsWith('Mi') ? Number(v.slice(0, -2)) : NaN);
let cpu = 0, mem = 0;
for (const f of readdirSync('deploy').filter((n) => n.endsWith('.yaml'))) {
  for (const doc of readFileSync(`deploy/${f}`, 'utf8').split(/^---$/m)) {
    if (!/kind:\s*Deployment/.test(doc)) continue;
    const replicas = Number(/replicas:\s*(\d+)/.exec(doc)?.[1] ?? 1);
    const req = /requests:\s*\n\s+cpu:\s*(\S+)\s*\n\s+memory:\s*(\S+)/.exec(doc);
    if (!req) continue;
    cpu += replicas * toMilli(req[1]);
    mem += replicas * toMi(req[2]);
  }
}
console.log(`requests.cpu=${cpu}m requests.memory=${mem}Mi (limit ${LIMIT.cpu}m / ${LIMIT.memMi}Mi)`);
if (mem > LIMIT.memMi || cpu > LIMIT.cpu) {
  const gi = (m) => `${+(m / 1024).toFixed(2)}Gi`;
  console.error(`Error from server (Forbidden): exceeded quota: team-quota, requested: requests.memory=${gi(mem)}, used: 0, limited: requests.memory=4Gi (cpu ${cpu}m of ${LIMIT.cpu}m)`);
  process.exit(1);
}
