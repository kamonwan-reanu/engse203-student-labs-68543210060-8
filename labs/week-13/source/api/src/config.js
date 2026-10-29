/**
 * config.js — รวมการอ่าน environment variable ไว้ที่เดียว
 *
 * ทำไมต้องมีไฟล์นี้ (CP36)
 *   - ไม่ให้ค่า config กระจายอยู่ทั่วโค้ด (hardcode)
 *   - แยก dev / production ด้วยค่าเดียว: NODE_ENV
 *   - อ่านค่าจาก process.env ที่เดียว ที่อื่น import จากนี่
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');

const DEV_JWT_SECRET = 'dev-only-secret-do-not-use-in-production';

function readJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  
  // 🏫 TODO W13-SECRET (CP52): production ต้อง Fail Fast ถ้าไม่มี secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ต้องตั้งค่า JWT_SECRET ก่อนรันแบบ production (ดู api/.env.example)');
  }
  
  return DEV_JWT_SECRET; // dev / test ใช้ค่าสำหรับพัฒนาได้
}

export const config = {
  // สภาพแวดล้อม — 'development' หรือ 'production'
  env: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',

  // พอร์ตของ API
  port: Number(process.env.PORT ?? 3001),

  // ที่อยู่ frontend ที่อนุญาตให้เรียก (CORS)
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  // ไฟล์ฐานข้อมูล
  dbFile: process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db'),
  schemaFile: path.join(API_ROOT, 'data', 'schema.sql'),

  // production เสิร์ฟไฟล์ frontend ที่ build แล้วจากที่ไหน
  staticDir: process.env.STATIC_DIR ?? path.join(API_ROOT, '..', 'frontend', 'dist'),

  /**
   * 🏫 TODO W13-SECRET (CP52) — Fail Fast
   */
  jwtSecret: readJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
};