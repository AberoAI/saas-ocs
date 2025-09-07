import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import "dotenv/config"; // Pastikan .env terbaca

// Cek apakah REDIS_URL terbaca
console.log("REDIS_URL:", process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Konfigurasi Redis agar cocok dengan BullMQ v5
const connection = new Redis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null, // <- WAJIB null untuk BullMQ
  },
);

// Event untuk memantau koneksi Redis
connection.on("connect", () => console.log("Redis connected ✅"));
connection.on("error", (err) =>
  console.error("Redis connection error ❌", err),
);

const worker = new Worker(
  "messages",
  async (job: Job) => {
    console.log("Processing job:", job.name, job.data);
    // TODO: Integrasi WhatsApp + AI
  },
  { connection },
);

// Event BullMQ Worker
worker.on("ready", () =>
  console.log("Worker is ready and connected to Redis ✅"),
);
worker.on("completed", (job: Job) => {
  console.log(`Job ${job.id} completed! ✅`);
});
worker.on("failed", (job: Job | undefined, err: Error) => {
  console.error(`Job ${job?.id} failed ❌`, err);
});
worker.on("error", (err: Error) => {
  console.error("Worker error ❌", err);
});
