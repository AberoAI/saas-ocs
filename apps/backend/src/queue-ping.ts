// apps/backend/src/queue-ping.ts
import 'dotenv/config';
import { Queue } from 'bullmq';

async function main() {
  const q = new Queue('wa-inbound', {
    connection: { url: process.env.REDIS_URL! },
  });

  // payload contoh sesuai struktur worker kamu
  await q.add('manual-test', {
    tenantId: 'test-tenant',
    from: '628111111111',
    to: '628222222222',
    content: 'Hello from queue-ping.ts',
  });

  console.log('✅ Enqueued test job.');
  await q.close();
}

main().then(() => process.exit(0));
