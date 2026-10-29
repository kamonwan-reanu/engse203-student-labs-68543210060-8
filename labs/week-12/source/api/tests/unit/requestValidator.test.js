import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

/**
 * Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล
 * กรณีทดสอบมาจากตาราง TEST_CASES.md (CP44)
 *
 * รัน:  npm test            (ครั้งเดียว)
 *       npm run test:watch  (รันใหม่ทุกครั้งที่บันทึกไฟล์)
 */

// ข้อมูลที่ถูกต้องทุกช่อง — แต่ละ test เปลี่ยนทีละช่องเพื่อให้รู้ว่าพังเพราะอะไร
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error (ต่ำกว่าขอบ 1)', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });

  // 📝 เพิ่ม TC-03: 10 ตัวอักษรพอดี (ค่าขอบ) -> ต้องผ่าน (ได้ array ว่าง)
  test('10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });

  // 📝 เพิ่ม TC-04: 11 ตัวอักษร -> ต้องผ่าน
  test('11 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ details: '12345678901' }))).toEqual([]);
  });

  // 📝 เพิ่ม TC-05: ช่องว่างล้วน -> ต้อง error เพราะระบบตัดช่องว่างทิ้งก่อนนับ
  test('ช่องว่างล้วน → error', () => {
    expect(validateRequestInput(withField({ details: '          ' }))).toHaveLength(1);
  });
});

// 📝 เพิ่มกลุ่ม: ชื่อผู้แจ้ง (ค่าขอบ 2 ตัวอักษร)
describe('validateRequestInput — ชื่อผู้แจ้ง (ค่าขอบ 2 ตัวอักษร)', () => {
  test('1 ตัวอักษร → error', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก' }))).toHaveLength(1);
  });
  
  test('2 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ requesterName: 'กข' }))).toEqual([]);
  });
});

// 📝 เพิ่มกลุ่ม: ข้อมูลนอกรายการ
describe('validateRequestInput — ข้อมูลนอกรายการ', () => {
  test('ประเภทคำร้องนอกรายการ ("แจ้งเหตุ") → error', () => {
    expect(validateRequestInput(withField({ requestType: 'แจ้งเหตุ' }))).toHaveLength(1);
  });

  test('ความเร่งด่วนนอกรายการ ("high") → error', () => {
    expect(validateRequestInput(withField({ priority: 'high' }))).toHaveLength(1);
  });
});

// 📝 เพิ่มกลุ่ม: ข้อมูลผิดรูปแบบ (ใช้ test.each ทดสอบรวดเดียวหลายค่า)
describe('validateRequestInput — ข้อมูลผิดรูปแบบ', () => {
  test.each([null, undefined, 'text', 42, []])(
    'input = %j → error ต้องส่งข้อมูลคำร้อง',
    (input) => {
      expect(validateRequestInput(input)).toEqual(['ต้องส่งข้อมูลคำร้องมาด้วย']);
    }
  );
});

describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });
  
  // 📝 เพิ่มทดสอบสถานะที่ผิด
  test('"done" → false', () => {
    expect(isValidStatus('done')).toBe(false);
  });
});