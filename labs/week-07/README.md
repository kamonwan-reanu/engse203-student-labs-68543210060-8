# ENGSE203 LAB 07 — RESTful API, Validation & Error Handling (Full-Stack Integration)

## Submission Contract

- **Repository:** `https://github.com/BELLprime/engse203-student-labs-68543210007`
- **Branch:** `unit3/week-07`
- **Source path:** `labs/week-07/source/`
- **Pages Hub URL:** `https://BELLprime.github.io/engse203-student-labs-68543210007/`
- **Weekly Result URL:** `https://BELLprime.github.io/engse203-student-labs-68543210007/labs/week-07/`
- **Pull Request URL:** `https://github.com/BELLprime/engse203-student-labs-68543210007/pull/8`
- **Submission tag:** `lab-07-submission-v1`

---

## ผู้จัดทำ

- **ชื่อ-นามสกุล:** นายณัฏฐกิตติ์ รอดเรือน
- **รหัสนักศึกษา:** 68543210007-9 (Sec 1)
- **ระบบปฏิบัติการที่ใช้:** Windows 11 / WSL2 (Ubuntu 24.04 LTS)
- **Node version:** v22.23.1
- **วันที่ทดสอบ:** 15 กันยายน 2026

---

## วัตถุประสงค์ของงาน

1. เชื่อมต่อระบบส่วนหน้า (Frontend: React + Vite) กับระบบส่วนหลัง (Backend: Express RESTful API) ให้ทำงานร่วมกันจริงผ่านเครือข่าย HTTP
2. จัดการและแก้ปัญหา Cross-Origin Resource Sharing (CORS) ตามมาตรฐาน Same-Origin Policy ของเบราว์เซอร์ด้วย Express CORS Middleware
3. ปรับปรุง Service Layer (`requestService.js` และ `apiClient.js`) ให้ยิงคำขอผ่าน Fetch API แทนการอ่านเขียน `localStorage` โดยไม่กระทบต่อ React UI Components
4. จัดการสถานะการโหลดข้อมูล (Loading State) และข้อผิดพลาดจากเครือข่าย (Error State) บนหน้าจอ React Dashboard
5. พัฒนาระบบเปลี่ยนสถานะคำร้องด้วยเมธอด `PUT /api/requests/:id` (CP13) ทั้งฝั่ง API Controller และปุ่มบนหน้าจอ React
6. จัดทำเอกสารสัญญาการเชื่อมต่อ `API_CONTRACT.md` (CP15) ครบทั้ง 6 endpoints พร้อมตัวอย่าง Payload จริง
7. เขียนชุดทดสอบอัตโนมัติ (Automated Integration Tests - CP16) จำนวน 6 เคส ด้วย `node:test` และ `supertest`
8. พัฒนาส่วนขยายพิเศษ (⭐ Challenge): `AppError` สำหรับกำหนด Status Code ได้เอง, `asyncHandler` ห่อหุ้ม Async Controller และการซ่อน Stack Trace ใน Production

---

## เครื่องมือที่ใช้

- **Backend Development:** Node.js (v22.23.1), Express.js, `cors`, `morgan`, `dotenv`
- **Frontend Development:** React 19, Vite, React Router DOM
- **Testing & Verification:** `node:test`, `node:assert/strict`, `supertest`
- **API & Network Testing:** Postman, Chrome / Edge DevTools (Network & Console)
- **Version Control & Environment:** Git, GitHub, WSL2 (Ubuntu 24.04 LTS)

---

## วิธีติดตั้งและรัน

สัปดาห์นี้ต้องรัน **2 Terminal** ควบคู่กัน (API Backend และ Frontend):

```bash
# Terminal 1 — API Backend (รันที่พอร์ต 3001)
cd labs/week-07/source/api
npm install
cp .env.example .env
npm run dev

# Terminal 2 — Frontend Application (รันที่พอร์ต 5173)
cd labs/week-07/source/frontend
npm install
cp .env.example .env.local
npm run dev
```

### คำสั่งทดสอบระบบ (Testing Commands)

```bash
# 1. รันชุดทดสอบ Automated Integration Test ของ API (6 เคส)
cd labs/week-07/source/api
npm test

# 2. รันตัวตรวจเช็คอัตโนมัติประจำสัปดาห์ (Checker ผ่าน 36/36)
cd labs/week-07/source
node check-week07.mjs

# 3. รันตัวตรวจสอบมาตรฐานและความพร้อมของ Repository
npm run verify:lab -- week-07
npm run build:pages
```

---

## โครงสร้างโฟลเดอร์

```text
labs/week-07/
├── README.md
├── lab-metadata.json
├── publish/
│   ├── index.html
│   └── assets/
├── evidence/
│   ├── API_TEST.md
│   └── images/
│       ├── network-cors-ok.png
│       ├── app-with-api.png
│       └── error-state.png
└── source/
    ├── README.md
    ├── API_CONTRACT.md
    ├── AI_USAGE.md
    ├── check-week07.mjs
    ├── api/
    │   ├── src/
    │   │   ├── app.js
    │   │   ├── server.js
    │   │   ├── config.js
    │   │   ├── routes/requestRoutes.js
    │   │   ├── controllers/requestController.js
    │   │   ├── services/requestService.js
    │   │   └── middleware/ (errorHandler.js, validateRequest.js)
    │   ├── tests/api.test.js
    │   ├── .env.example
    │   └── package.json
    └── frontend/
        ├── src/
        │   ├── services/ (apiClient.js, requestService.js)
        │   ├── pages/ (DashboardPage.jsx, RequestDetailPage.jsx)
        │   └── components/
        ├── .env.example
        └── package.json
```

---

## หลักฐานผลลัพธ์

### 1. ผลการตรวจเช็คอัตโนมัติ (`check-week07.mjs`): ผ่าน 36 / 36 รายการ (100% เต็ม)
```text
✅ STRUCT มีไฟล์โครงสร้างครบถ้วน
✅ CP10 config + CORS + env ทำงานถูกต้อง
✅ CP11 GET /api/requests และการเชื่อมต่อ frontend ด้วย apiClient ผ่านครบถ้วน
✅ CP12 Dashboard มีสถานะ loading และ error state
✅ CP13 PUT /api/requests/:id เปลี่ยนสถานะได้ทั้ง API และ UI
✅ CP14 ใช้ morgan เป็น logger และจัดการ error ระดับ production
✅ CP15 มีไฟล์ API_CONTRACT.md ครอบคลุมครบทุก endpoint
✅ CP16 เขียน test ครบ 6 เคส ยิงด้วย supertest
✅ CHAL ⭐ มี AppError สำหรับกำหนด status เอง
✅ CHAL ⭐ มี asyncHandler ห่อ handler ที่เป็น async
✅ CHAL ⭐ ไม่ส่ง stack trace ตอน production
──────────────────────────────────────────────────────────
🏫 ในห้อง (CP09–CP12)   ผ่าน 25/25 รายการ (100%)
🏠 ที่บ้าน (CP13–CP16)   ผ่าน 8/8 รายการ (100%)
⭐ Challenge            ผ่าน 3/3 รายการ (100%)
──────────────────────────────────────────────────────────
ผ่าน 36/36 รายการ (100%)
```

### 2. ผลการรัน Automated Test (`api/tests/api.test.js` ผ่าน `npm test`): ผ่าน 6 / 6 เคส

| # | Method | Path / หัวข้อการทดสอบ | สิ่งที่ส่ง (Payload / Header) | Status คาดหวัง | Status จริง | ผลการทดสอบ |
|:---:|---|---|---|:---:|:---:|:---:|
| 1 | `GET` | `/api/requests` | — | 200 | 200 | คืน Array รายการคำร้องทั้งหมด |
| 2 | `GET` | `/api/requests/REQ-001` (พบ) | — | 200 | 200 | คืน Object คำร้อง `REQ-001` ครบถ้วน |
| 3 | `GET` | `/api/requests/REQ-999` (ไม่พบ) | — | 404 | 404 | คืน `error: "ไม่พบคำร้องรหัส REQ-999"` |
| 4 | `POST` | `/api/requests` | ข้อมูลคำร้องครบถ้วน | 201 | 201 | คืนคำร้องใหม่พร้อม `id: REQ-...` และ `status: pending` โดย `requesterName` ตรงตามที่ส่ง |
| 5 | `POST` | `/api/requests` (ไม่ครบ) | `{ requesterName: "-", details: "-" }` | 400 | 400 | คืน Error 400 พร้อม array details แจ้งจุดผิดพลาด |
| 6 | `GET` | `/api/requests` (CORS) | `Origin: http://localhost:5173` | 200 | 200 | คืน Header `Access-Control-Allow-Origin: http://localhost:5173` |

### 3. ภาพหน้าจอหลักฐาน (Evidence Screenshots ใน `evidence/images/`)
- **`network-cors-ok.png`:** หน้าจอ DevTools Network แสดง Header `Access-Control-Allow-Origin: http://localhost:5173`
- **`app-with-api.png`:** หน้าจอ Dashboard แสดงรายการคำร้องจาก API ควบคู่กับ Network tab ที่แสดงผล 200 OK
- **`error-state.png`:** หน้าจอ Dashboard แสดงกล่อง Error State สีแดงเมื่อปิด API เซิร์ฟเวอร์

---

## ปัญหาที่พบและวิธีแก้ไข

- **ปัญหาที่ 1: การนำเข้า `asyncHandler` ผิดพาธใน `requestRoutes.js`**
  - *อาการ:* ระบบแจ้ง `The requested module '../middleware/validateRequest.js' does not provide an export named 'asyncHandler'` ทำให้สตาร์ท API ไม่ติด
  - *วิธีแก้:* ตรวจสอบจุดประกาศพบว่าเขียนไว้ใน `errorHandler.js` จึงแก้ไขบรรทัด import ใน `requestRoutes.js` ให้ดึงมาจาก `../middleware/errorHandler.js` ให้ถูกต้อง
- **ปัญหาที่ 2: การจัดการข้อผิดพลาดใน Asynchronous Controller**
  - *อาการ:* หาก Controller ที่เป็น `async` โยน Error ออกมา ตัว Express ดั้งเดิมจะไม่ส่งต่อ Error ไปยัง Error Handler
  - *วิธีแก้:* นำฟังก์ชัน `asyncHandler` มาครอบ Controller ในไฟล์ Routes เพื่อห่อหุ้ม Promise และส่งต่อ `.catch(next)` เข้าสู่ `errorHandler` โดยอัตโนมัติ

---

## References & AI Assistance

- **Source / Documentation:**
  - Express.js Routing & Error Handling Guide: [https://expressjs.com/](https://expressjs.com/)
  - Node.js Built-in Test Runner Documentation: [https://nodejs.org/api/test.html](https://nodejs.org/api/test.html)
  - MDN Web Docs (CORS & Fetch API): [https://developer.mozilla.org/](https://developer.mozilla.org/)
  - เอกสารประกอบการสอนวิชา ENGSE203 สัปดาห์ที่ 7 (Full-Stack Integration)
- **AI tool used:** Google Antigravity
- **Used for:**
  - ปรึกษาและทำความเข้าใจเรื่อง Path Parameters (`getRequestById`) เทียบกับ `useParams` ใน React
  - อธิบายการทำงานของโอเปอเรเตอร์ `instanceof ApiError` สำหรับแยกแยะชนิดข้อผิดพลาด
  - ขอคำแนะนำเรื่องข้อแตกต่างระหว่าง `assert.equal` และ `assert.ok` ในชุดทดสอบ Node.js
  - อธิบายการทำงานของคำสั่ง `.post().send()` ในไลบรารี `supertest`
  - วิเคราะห์และให้คำแนะนำเรื่องการทดสอบ CORS Header และความแตกต่างระหว่าง Simple Request กับ Preflight Request (`OPTIONS`)
- **My adaptation:**
  - นำความรู้เรื่อง `assert.equal` และ `supertest` มาเขียนชุดทดสอบจริง 6 เคสใน `api/tests/api.test.js`
  - นำแนวคิด `AppError` และ `asyncHandler` มาปรับใช้ใน Controller และ Routes ของ API
  - จัดทำรายงานสรุปการใช้งานและตรวจสอบความเข้าใจอย่างละเอียดลงในเอกสาร [`AI_USAGE.md`](AI_USAGE.md)