import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

/**
 * Integration test — ยิง HTTP จริงผ่านทุกชั้น: route → controller → service → SQLite
 *
 * ย้ายมาจาก tests/api.test.js ของสัปดาห์ 10 (node:test → Vitest)
 *   assert.equal(a, b)  →  expect(a).toBe(b)
 *   assert.ok(x)        →  expect(x).toBe(true)
 *   before(...)         →  beforeEach(...)   ← ฐานข้อมูลใหม่ทุกข้อ
 *
 * vitest.config.js ตั้ง DB_FILE=':memory:' ไว้แล้ว
 * → loadSeed() ทุกครั้งได้ฐานข้อมูลใหม่ในหน่วยความจำ (5 รายการ) ไม่แตะ campus.db
 */

const app = createApp();
beforeEach(async () => { await loadSeed(); });

const valid = {
  requesterName: 'ทดสอบ อัตโนมัติ', requestType: 'แจ้งซ่อม',
  location: 'C3-401', details: 'รายละเอียดยาวพอสมควรจริง', priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืน array 5 รายการจากข้อมูลตั้งต้น พร้อม 200', async () => {
    const r = await request(app).get('/api/requests');
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(5);
  });
  test('คืน requesterName ไม่ใช่ requester_id', async () => {
    const r = await request(app).get('/api/requests');
    expect(r.body[0]).toHaveProperty('requesterName');
    expect(r.body[0]).not.toHaveProperty('requester_id');
  });
  test('กรอง ?status= ทำงาน', async () => {
    const r = await request(app).get('/api/requests?status=pending');
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body.every((x) => x.status === 'pending')).toBe(true);
  });
  test('SQL injection ผ่าน ?status= ไม่หลุด', async () => {
    const r = await request(app).get("/api/requests?status=' OR '1'='1");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(0);
  });
});

describe('GET /api/requests/:id', () => {
  test('พบ → 200', async () => {
    const r = await request(app).get('/api/requests/REQ-001');
    expect(r.status).toBe(200);
    expect(r.body.id).toBe('REQ-001');
  });
  test('ไม่พบ → 404', async () => {
    const r = await request(app).get('/api/requests/REQ-999');
    expect(r.status).toBe(404);
  });
});

describe('POST /api/requests', () => {
  test('ข้อมูลถูกต้อง → 201 · ได้รหัสถัดไป', async () => {
    const r = await request(app).post('/api/requests').send(valid);
    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
  });
  test('ข้อมูลไม่ครบ → 400 พร้อมรายการ error', async () => {
    const r = await request(app).post('/api/requests').send({ requesterName: 'x' });
    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.details)).toBe(true);
  });
});

describe('PUT /api/requests/:id', () => {
  test('เปลี่ยนสถานะถูกต้อง → 200 และสถานะเปลี่ยนไป', async () => {
    // ยิงคำสั่งเปลี่ยนสถานะเป็น completed
    const r1 = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r1.status).toBe(200);
    
    // ต้องดึงข้อมูล (GET) มาเช็คซ้ำว่าในระบบถูกอัปเดตเป็นค่าใหม่แล้วจริงๆ
    const r2 = await request(app).get('/api/requests/REQ-001');
    expect(r2.body.status).toBe('completed');
  });

  test('สถานะนอกรายการ → 400', async () => {
    // ลองส่งสถานะแปลกๆ ที่ไม่มีในระบบ
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'reject' });
    expect(r.status).toBe(400);
  });
});

describe('DELETE /api/requests/:id', () => {
  test('ลบสำเร็จ → 204 และดึงข้อมูลซ้ำต้องได้ 404', async () => {
    // ยิงคำสั่งลบ
    const r1 = await request(app).delete('/api/requests/REQ-001');
    expect(r1.status).toBe(204);
    
    // GET ซ้ำ ต้องไม่เจอแล้ว (ต้องได้ 404 Not Found)
    const r2 = await request(app).get('/api/requests/REQ-001');
    expect(r2.status).toBe(404);
  });
});

// 📝 CP47: Regression Test สำหรับดักจับบั๊กเก่าไม่ให้กลับมาเป็นซ้ำ
describe('Regression Tests (BUG_REPORTS)', () => {
  test('BUG #3: PUT สถานะคำร้องที่ไม่มีอยู่ ต้องได้ 404 (ไม่พัง 500)', async () => {
    // จำลองการเปลี่ยนสถานะของ REQ-999 ซึ่งไม่มีอยู่ในระบบ (ตามคำใบ้ใน BUG_REPORTS.md)
    const r = await request(app).put('/api/requests/REQ-999').send({ status: 'completed' });
    
    // คาดหวังว่าระบบต้องไม่แครช (500) แต่ต้องฟ้องว่าไม่พบข้อมูล (404)
    expect(r.status).toBe(404);
  });
  test('BUG #1: ลบคำร้องแล้วเพิ่มใหม่ ต้องไม่พัง 500', async () => {
    // 1. เจ้าหน้าที่ลบคำร้องทิ้งไป 1 รายการ
    await request(app).delete('/api/requests/REQ-001');
    
    // 2. นักศึกษาส่งคำร้องใหม่เข้ามา
    const r = await request(app).post('/api/requests').send(valid);
    
    // 3. ระบบต้องสร้างคำร้องได้สำเร็จ (201) โดยไม่เกิด Error 500
    expect(r.status).toBe(201);
  });
});