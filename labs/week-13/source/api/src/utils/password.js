import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');                 // สุ่ม salt ใหม่ทุกครั้ง (16 ไบต์แปลงเป็น hex 32 ตัวอักษร)
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  const [scheme, salt, hashHex] = String(stored ?? '').split('$');
  if (scheme !== 'scrypt' || !salt || !hashHex) return false;   // รูปแบบผิด → คืน false ทันทีโดยไม่พัง
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(String(plain), salt, expected.length);
  
  // timingSafeEqual ป้องกัน Timing Attack โดยใช้เวลาเทียบเท่ากันเสมอ ไม่ว่าจะผิดตรงตำแหน่งไหน
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}