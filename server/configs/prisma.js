import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

const globalForPrisma = globalThis;
const connectionString = process.env.DATABASE_URL || '';

let prisma;

if (globalForPrisma.__prisma) {
  prisma = globalForPrisma.__prisma;
} else {
  const isNeon = connectionString.includes('neon.tech') || connectionString.includes('neon.build');
  if (isNeon) {
    neonConfig.webSocketConstructor = ws;
    const adapter = new PrismaNeon({ connectionString });
    prisma = new PrismaClient({ adapter });
  } else {
    prisma = new PrismaClient();
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

export default prisma;
