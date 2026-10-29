import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => { await loadSeed(); app = createApp(); });

const validRequest = {
  requesterName: "ทดสอบ ระบบ",
  requestType: "แจ้งซ่อม",
  location: "C3-401",
  details: "รายละเอียดยาวพอสมควรจริง",
  priority: "normal",
};

const incompleteData = {
      requesterName: "ทดสอบ ระบบ"
    };
/**
 * TODO W10-TEST (🏠 CP33) · เขียน test อย่างน้อย 6 เคส ที่ยิงเข้าฐานข้อมูลจริง
 *   1. GET /api/requests → 200 และได้ array
 *   2. คืน requesterName ไม่ใช่ requester_id
 *   3. GET /:id พบ → 200 · ไม่พบ → 404
 *   4. POST ถูกต้อง → 201
 *   5. POST ไม่ครบ → 400
 *   6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
 */
describe("GET /api/requests", () => {
  test("คืนรายการทั้งหมด พร้อม status 200", async () => {
    const res = await request(app).get("/api/requests");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
});

test('คืน requesterName ไม่ใช่ requester_id', async () => {
  const r = await request(app).get('/api/requests');
  assert.ok('requesterName' in r.body[0]);
  assert.ok(!('requester_id' in r.body[0]));
});

describe("GET /api/requests/:id", () => {
  test("พบคำร้อง พร้อม status 200", async () => {
    const res = await request(app).get("/api/requests/REQ-001");
    assert.equal(res.status, 200);
    assert.equal(res.body.id, `REQ-001`);
  });
});

describe("GET /api/requests/:id ไม่ถูก", () => {
  test("ไม่พบคำร้อง พร้อม status 404", async () => {
    const res = await request(app).get("/api/requests/REQ-999");
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
});

describe("POST /api/requests/", () => {
  test("POST ข้อมูลถูกต้อง", async () => {
    const res = await request(app).post("/api/requests/").send(validRequest);
    assert.equal(res.status, 201);
    assert.ok(res.body.id);
    assert.equal(res.body.status, `pending`);
    
  });
});

describe("POST /api/requests/", () => {
  test("POST ข้อมูลไม่ครบ", async () => {
    const res = await request(app).post("/api/requests/").send(incompleteData);
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
});



describe('CORS', () => {
  test('ตอบกลับ header ตาม origin ที่อนุญาต', async () => {
    const allowedOrigin = 'http://localhost:5173';

    const res = await request(app)
      .get('/api/requests')
      .set('Origin', allowedOrigin);

    assert.equal(res.status, 200);
    assert.equal(res.headers['access-control-allow-origin'], allowedOrigin);
  });
});

test('SQL injection ผ่าน ?status= ไม่หลุด', async () => {
  const evil = encodeURIComponent("x' OR '1'='1");
  const r = await request(app).get(`/api/requests?status=${evil}`);
  assert.equal(r.status, 200);
  assert.equal(r.body.length, 0);
});