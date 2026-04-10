import { prisma } from '@repo/database';

type DbClient = typeof prisma;

export const ACCESS_SECRET = process.env.ACCESS_SECRET
export const REFRESH_SECRET = process.env.REFRESH_SECRET
export const FRONTEND_URL = process.env.FRONTEND_URL
export const BACKEND_URL = process.env.BACKEND_URL
export const FORGET_PASSWORD_SECRET = process.env.FORGET_PASSWORD_SECRET

export const db: DbClient = prisma;