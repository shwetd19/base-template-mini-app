import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | null = null;

try {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  prismaInstance = null;
}

export const prisma = prismaInstance as PrismaClient;
