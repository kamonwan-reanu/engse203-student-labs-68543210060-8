# AI_USAGE — LAB 06

บันทึกการใช้ AI ระหว่างทำงาน · **ใช้ AI ได้ แต่ต้องเป็นเจ้าของโค้ดที่ส่ง**

> ผู้สอนจะสุ่มถามจากโค้ดที่ส่ง — ถ้าอธิบายไม่ได้ คะแนนส่วนนั้นจะถูกทบทวน

---

## ครั้งที่ 1

**ถามอะไร**
- ขอคำแนะนำการตรวจเช็คการแยกชั้นความรับผิดชอบ (Clean Architecture) ระหว่าง `routes`, `controllers`, และ `services` (CP06) และทำไม Express Error Handling Middleware ต้องมี 4 พารามิเตอร์ `(err, req, res, next)` เสมอ

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- Service Layer ต้องจัดการเฉพาะ Business Logic และข้อมูลเท่านั้น ห้ามรู้จักหรือผูกติดกับ HTTP (`req`, `res`) เพื่อให้พร้อมต่อการเปลี่ยนแหล่งเก็บข้อมูล (เช่น SQLite ในอนาคต) ส่วน Controller ทำหน้าที่รับ request, ตัดสินใจ status code และส่ง response
- สำหรับ Error Handler ใน Express จำเป็นต้องประกาศพารามิเตอร์ครบ 4 ตัว `(err, req, res, next)` เสมอ เพราะ Express ใช้ `fn.length === 4` เพื่อแยกว่าฟังก์ชันใดเป็น Error Middleware หากมีแค่ 3 ตัวจะถูกมองว่าเป็น Request Handler ปกติ และไม่ควรส่ง stack trace ออกไปเพื่อความปลอดภัย

**ใช้ส่วนไหน / แก้เองตรงไหน**
- ตรวจสอบโค้ดใน `requestService.js` ให้มั่นใจว่าไม่มี `req` และ `res` ค้างอยู่
- นำหลักการ 4 พารามิเตอร์ไปปรับใช้ใน `src/middleware/errorHandler.js` เพื่อให้ตอบ HTTP 500 พร้อมข้อความ JSON กลาง ๆ

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2

**ถามอะไร**
- วิธีการทำ File Persistence สำหรับจัดเก็บข้อมูลลงไฟล์ JSON ด้วย `node:fs/promises` (CP08) และการตรวจเช็คระบบกรอง query status รวมถึงการปรับปรุงสถานะ (Challenge)

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- ให้ใช้ `readFile` และ `writeFile` จาก `node:fs/promises` โดยกำหนด `DATA_PATH` ชี้ไปยัง `data/requests.json` ในฟังก์ชัน `loadSeed()` ให้ลองอ่านจาก `requests.json` ก่อน หากยังไม่มีไฟล์ให้ fallback ไปอ่าน `initialRequests.json` แล้วเรียก `persist()`
- ทุกครั้งที่มีการเปลี่ยนแปลงข้อมูล (เช่น `create`, `remove` และ `updateStatus`) ต้องเรียก `persist()` เพื่อบันทึกสถานะล่าสุดกลับลงไฟล์ และต้องระบุ `data/requests.json` ลงใน `.gitignore` เพื่อป้องกันการ commit ข้อมูล runtime

**ใช้ส่วนไหน / แก้เองตรงไหน**
- เขียนฟังก์ชัน `persist()` และอัปเดต `loadSeed()` ใน `src/services/requestService.js`
- เพิ่มการเรียก `persist()` ในฟังก์ชัน `updateStatus()` ของ Challenge เพื่อให้ข้อมูลสถานะที่อัปเดตผ่าน `PUT` ถูกบันทึกลงดิสก์อย่างถาวร
- ตรวจสอบและทดสอบการทำงานด้วย `npm run check` จนผ่านครบ 28/28

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุป

- ส่วนที่เขียนเองทั้งหมด: ทำตาม CP0-1 ถึง CP0-8 เช่น routing logic ใน `requestRoutes.js`, การจัดการ status code ใน `requestController.js`, validation middleware ใน `validateRequest.js`, การเขียน logger middleware, การทดสอบผ่าน Postman และการบันทึกภาพผลการทดสอบลงใน `evidence/API_TEST.md`
- ส่วนที่ AI ช่วย: ให้คำแนะนำและตรวจสอบความถูกต้องตามหลักการ Clean Architecture, แนะนำโครงสร้าง Error Handling และการจัดทำเอกสาร Submission README
- ส่วนที่ยังไม่มั่นใจ: ไม่มี 