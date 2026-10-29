# DATA_MODEL.md — การออกแบบฐานข้อมูล Campus Service Request

> 🏠 **TODO W09-DOC (CP24)** — เขียนเอกสารอธิบายการออกแบบของคุณ
> ลบบรรทัดที่ขึ้นต้นด้วย `>` ออกทั้งหมดเมื่อเขียนเสร็จ

---

## 1. ภาพรวม

> วาดแผนภาพความสัมพันธ์ของ 2 ตาราง (ใช้ตัวอักษรวาดก็ได้)
> แล้วอธิบายว่าเป็นความสัมพันธ์แบบใด (หนึ่งต่อหนึ่ง / หนึ่งต่อหลาย / หลายต่อหลาย)

---

## 2. ทำไมต้องแยกเป็น 2 ตาราง

> **ข้อนี้สำคัญที่สุด** — ผู้สอนจะอ่านข้อนี้เป็นหลัก
>
> ตอน Week 06–07 เราเก็บ `requesterName` เป็นข้อความในทุกคำร้อง
> อธิบายว่าวิธีนั้นมีปัญหาอะไรบ้าง และการแยกตารางแก้ปัญหาเหล่านั้นอย่างไร
>
> คำใบ้ — ลองตอบคำถามนี้: **"ถ้าสมชายเปลี่ยนชื่อ ต้องแก้กี่ที่"**

---

## 3. รายละเอียดตาราง

> ทำเป็นตาราง — คอลัมน์ · ชนิด · ข้อกำหนด · **เหตุผลที่เลือกแบบนั้น**
> เหตุผลสำคัญกว่ารายการ เพราะแสดงว่าคุณคิดมาแล้ว ไม่ได้ลอกมา

---

## 4. เหตุผลของการเลือกชนิดและข้อกำหนด

> ตอบอย่างน้อย 2 ข้อนี้
> - ทำไม `users.id` กับ `requests.id` ใช้ชนิดต่างกัน
> - ทำไมต้องมี CHECK constraint ทั้งที่ API ก็ตรวจข้อมูลอยู่แล้ว

---

## 5. ตัวอย่างการใช้ JOIN

> ใส่คำสั่ง SQL จริงและตารางผลลัพธ์ที่ได้

---

## 6. ข้อสังเกตสำหรับสัปดาห์ที่ 10

> เปรียบเทียบผลของ JOIN กับข้อมูลที่ API ส่งให้ React ตอน Week 07
> คุณสังเกตเห็นอะไร

## ผลการทดสอบ Constraint

### ① Foreign Key

**คำสั่งที่ลอง**

​```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-TEST', 99999, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
​```

**ผลที่ได้** `FOREIGN KEY constraint failed` ✓ ถูกปฏิเสธตามที่ควร

### ② Not Null (ข้อมูลรายละเอียดต้องไม่เว้นว่าง)

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-TEST2', 1, 'แจ้งซ่อม', 'ห้องเรียน', NULL);
```

**ผลที่ได้** `NOT NULL constraint failed: requests.details` ✓ ถูกปฏิเสธตามที่ควร

### ③ Check (ประเภทคำร้องไม่ถูกต้อง)

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-TEST3', 1, 'สั่งอาหาร', 'ตึกคณะ', 'แอร์ไม่เย็น');
```

**ผลที่ได้** `CHECK constraint failed: requests` ✓ ถูกปฏิเสธตามที่ควร (ประเภท 'สั่งอาหาร' ไม่ได้อยู่ในเงื่อนไข)

### ④ Primary Key (รหัสคำร้องซ้ำกัน)

**คำสั่งที่ลอง**

```sql
-- สมมติว่า REQ-001 มีอยู่ในตาราง requests แล้ว
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-001', 1, 'แจ้งทำความสะอาด', 'ห้องสมุด', 'น้ำหก');
```

**ผลที่ได้** `UNIQUE constraint failed: requests.id` ✓ ถูกปฏิเสธตามที่ควร

### ⑤ Unique (อีเมลผู้ใช้งานซ้ำ)

**คำสั่งที่ลอง**

```sql
-- สมมติว่าอีเมล student@example.com มีคนใช้ลงทะเบียนไปแล้ว
INSERT INTO users (name, email)
VALUES ('สมชาย', 'student@example.com');
```

**ผลที่ได้** `UNIQUE constraint failed: users.email` ✓ ถูกปฏิเสธตามที่ควร

### ⑥ Check (สถานะคำร้องไม่ถูกต้อง)

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details, status)
VALUES ('REQ-TEST6', 1, 'แจ้งซ่อม', 'ห้องเซิร์ฟเวอร์', 'ไฟดับ', 'พักเบรก');
```

**ผลที่ได้** `CHECK constraint failed: requests` ✓ ถูกปฏิเสธตามที่ควร (สถานะ 'พักเบรก' ไม่อยู่ในเงื่อนไข)