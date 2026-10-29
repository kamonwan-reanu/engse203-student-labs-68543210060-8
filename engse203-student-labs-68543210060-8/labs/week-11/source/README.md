# Campus Service — Full-Stack Web Application (Week 11)

ระบบจัดการคำร้องบริการภายในมหาวิทยาลัย (Campus Service Request Management) พัฒนาแบบ Full-Stack ครบวงจรด้วย React, Express.js และ SQLite พร้อมสำหรับการใช้งานจริงใน Production ทั้งด้านการจัดการ Configuration, Health Monitoring, Centralized Error Handling และการ Build/Deploy

---

## 🏗️ สถาปัตยกรรม 3 ชั้น (3-Tier Architecture)

ระบบถูกออกแบบตามหลักสถาปัตยกรรม 3 ชั้น (Three-Tier Architecture) เพื่อแยกหน้าที่รับผิดชอบ (Separation of Concerns) ให้ชัดเจน:

```text
┌─────────────────┐       HTTP / JSON       ┌──────────────────┐        SQL Queries        ┌─────────────────┐
│  Presentation   │ ──────────────────────> │ Application Tier │ ────────────────────────> │    Data Tier    │
│  Tier (Frontend)│ <────────────────────── │ (Backend / API)  │ <──────────────────────── │   (Database)    │
│  React + Vite   │    RESTful Responses    │ Express.js (ESM) │         Data Rows         │ SQLite / LibSQL │
└─────────────────┘                         └──────────────────┘                           └─────────────────┘
```

| ลำดับชั้น | เทคโนโลยีหลัก | หน้าที่และความรับผิดชอบ | โฟลเดอร์ในโปรเจกต์ |
|---|---|---|---|
| **1. Presentation Tier (Frontend)** | React 19, Vite, React Router, CSS | แสดงผลหน้าจอ UI สำหรับผู้ใช้งาน, รับการโต้ตอบจากผู้ใช้, จัดการ Client-side Routing, เชื่อมต่อ API ด้วย Fetch API เพื่อดึงและส่งข้อมูล | `frontend/` |
| **2. Application Tier (API / Logic)** | Node.js, Express.js 5.x, CORS, Morgan | ให้บริการ RESTful API, ตรวจสอบความถูกต้องของข้อมูล (Validation), ประมวลผล Business Logic, กำหนด Routing, จัดการ Authentication & Authorization และ Error Handling | `api/src/` |
| **3. Data Tier (Database)** | SQLite (`libsql`), SQL DDL/DML, Turso Cloud | จัดเก็บข้อมูลแบบสัมพันธ์ (Relational Data Storage) อย่างถาวรและปลอดภัย ได้แก่ ข้อมูลคำร้อง (`requests`) และผู้ใช้งาน (`users`) | `api/data/` |

### รายละเอียดการแบ่ง Layer ภายใน Backend (`api/src/`)
- **Routes (`src/routes/`)**: กำหนด HTTP Endpoint และจับคู่เข้ากับ Controller ที่เกี่ยวข้อง
- **Controllers (`src/controllers/`)**: จัดการ Request/Response, อ่านพารามิเตอร์ และส่งต่อให้ Service
- **Services (`src/services/`)**: รวมกฎและตรรกะทางธุรกิจ (Business Logic) และการติดต่อกับ Database
- **Middleware (`src/middleware/`)**: ฟังก์ชันประมวลผลกลาง เช่น Logging, CORS, Error Handling, Not Found Handler

---

## 🚀 วิธีการติดตั้งและรันระบบ (How to Run)

### ความต้องการของระบบ (Prerequisites)
- **Node.js**: เวอร์ชัน `>= 22.12.0`
- **npm**: เวอร์ชัน `>= 10.0.0`

---

### 1. โหมดพัฒนา (Development Mode)

ในโหมด Dev จะรันทั้งสองฝั่งแยกพอร์ตกันเพื่อความรวดเร็วในการพัฒนา (Frontend มี Vite HMR, API มี Node watch mode)

#### ขั้นตอนที่ 1: ติดตั้ง Dependencies และตั้งค่าฐานข้อมูล
```bash
# ติดตั้ง Dependencies สำหรับ API และ Frontend
cd api && npm install
cd ../frontend && npm install
cd ..

# สร้างฐานข้อมูลเริ่มต้นและ Seed ข้อมูล
cd api
npm run db:setup
```

#### ขั้นตอนที่ 2: ตั้งค่า Environment Variables
- สร้างไฟล์ `api/.env` (คัดลอกจาก `api/.env.example`)
- สร้างไฟล์ `frontend/.env.local` (คัดลอกจาก `frontend/.env.example`)

#### ขั้นตอนที่ 3: รัน Service
เปิด Terminal 2 หน้าต่าง:

**Terminal 1 (API Server):**
```bash
cd api
npm run dev
# ทำงานที่ http://localhost:3001 พร้อม auto-reload เมื่อแก้ไฟล์
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# ทำงานที่ http://localhost:5173 พร้อม Vite Fast Refresh
```

---

### 2. โหมดใช้งานจริง (Production Mode / Unified Single-Port)

ในโหมด Production ระบบจะรันผ่านพอร์ตเดียว (`Unified Port`) โดย Express API จะทำหน้าที่เสิร์ฟ Static Assets ของ Frontend ที่ Build แล้ว พร้อมรองรับ SPA Routing

#### ขั้นตอนที่ 1: Build และรันจาก Root Directory
```bash
# รันคำสั่งเดียวที่ Root โฟลเดอร์เพื่อติดตั้ง dependencies และ build frontend
npm run build

# เริ่มต้นรันเซิร์ฟเวอร์ Production
npm start
```

#### ขั้นตอนที่ 2: ทดสอบการทำงาน
- เปิดบราวเซอร์ไปที่: `http://localhost:3001`
- ระบบจะแสดงหน้าเว็บ Frontend และสามารถเรียกใช้ API ภายใต้ `/api/*` ได้ใน Origin เดียวกัน

---

## ⚙️ ตาราง Environment Variables

### 1. ฝั่ง Backend API (`api/.env`)

| ชื่อตัวแปร | ชนิดข้อมูล | ค่าเริ่มต้น (Default) | คำอธิบายการใช้งาน |
|---|---|---|---|
| `NODE_ENV` | `string` | `development` | สภาพแวดล้อมการทำงาน (`development` / `production`) |
| `PORT` | `number` | `3001` | พอร์ตที่ API Server เปิดให้บริการ |
| `CORS_ORIGIN` | `string` | `http://localhost:5173` | Allowed Origin สำหรับ CORS (ใช้ในโหมด Dev) |
| `DB_FILE` | `string` | `api/data/campus.db` | พาธที่อยู่ของไฟล์ฐานข้อมูล SQLite บนเครื่อง |
| `STATIC_DIR` | `string` | `../frontend/dist` | พาธโฟลเดอร์ static build ของ frontend ที่ Express จะนำไปเสิร์ฟใน Production |
| `TURSO_DATABASE_URL` | `string` | `(ว่าง)` | URL สำหรับเชื่อมต่อฐานข้อมูล Turso Cloud Database (ตัวเลือกเสริม) |
| `TURSO_AUTH_TOKEN` | `string` | `(ว่าง)` | Authentication Token สำหรับ Turso Cloud (ตัวเลือกเสริม) |

### 2. ฝั่ง Frontend (`frontend/.env.local` / `frontend/.env.production`)

| ชื่อตัวแปร | ค่าที่ใช้ใน Development | ค่าที่ใช้ใน Production | คำอธิบายการใช้งาน |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | `""` (เว้นว่าง) | Base URL สำหรับยิง HTTP request ไปยัง API ในโหมด Production จะเว้นว่างเพื่อให้เรียก Relative Path (`/api/...`) บนโดเมนเดียวกัน |

---

## 💡 การตัดสินใจออกแบบ (Design Decisions & Architecture Rationale)

1. **การแบ่งสถาปัตยกรรมแบบ Route-Controller-Service:**
   - **เหตุผล:** ลดความซับซ้อนและการผูกมัดโค้ด (Decoupling) การแยก Business Logic ออกจาก Express Request/Response ทำให้อ่านง่าย ตรวจสอบง่าย และสามารถเขียน Unit Test / Integration Test ได้อย่างเป็นอิสระ

2. **การรวมการ Deploy เป็น Single-Port ใน Production:**
   - **เหตุผล:** การให้ Express.js ทำหน้าที่เสิร์ฟไฟล์ Static Assets (`frontend/dist`) ควบคู่กับ API Endpoints (`/api/*`) ช่วยกำจัดปัญหา Cross-Origin Resource Sharing (CORS) บน Production ทั้งหมด และลดค่าใช้จ่าย/ความซับซ้อนในการตั้งค่า Server บน Cloud Platform (เช่น Render, Railway, Fly.io) โดยใช้ Instance เดียว

3. **Client-Side Routing Fallback (SPA Friendly):**
   - **เหตุผล:** กำหนด Wildcard Route (`/^(?!api).*/`) ใน Express ให้ส่งกลับไฟล์ `index.html` เสมอ เพื่อให้ React Router บนเบราว์เซอร์สามารถจัดการ URL และ Navigation ได้อย่างถูกต้อง ไม่เกิดปัญหา HTTP 404 เมื่อ Refresh หน้าเว็บ

4. **การจัดการ Configuration แบบรวมศูนย์ (Centralized Config & 12-Factor App):**
   - **เหตุผล:** กำหนดให้ทุกโมดูลอ่านค่า Environment Variables ผ่านโมดูล [`api/src/config.js`](file:///C:/Users/Beemmlg/Desktop/js/engse203-student-labs-68543210035/labs/week-11/source/api/src/config.js) เพียงจุดเดียว พร้อม Fallback values ป้องกันการกระจาย `process.env` ในหลายจุดและป้องกันข้อผิดพลาดจากค่าที่ไม่ได้ระบุ

5. **ระบบฐานข้อมูลแบบยืดหยุ่น (Local SQLite & Turso Cloud):**
   - **เหตุผล:** ใช้ `libsql` เป็น Database Driver ซึ่งทำงานได้ทั้งในรูปแบบ Local File-based SQLite สำหรับการพัฒนาที่รวดเร็วและออฟไลน์ และสามารถสลับไปใช้ Cloud SQLite (Turso) ได้ทันทีผ่านการตั้งค่า Environment Variables โดยไม่ต้องแก้โค้ด Query

6. **ระบบตรวจสุขภาพและการจัดการ Error แบบรวมศูนย์ (Health Check & Error Middleware):**
   - **เหตุผล:** เพิ่ม Endpoint [`/api/health`](file:///C:/Users/Beemmlg/Desktop/js/engse203-student-labs-68543210035/labs/week-11/source/api/src/routes/healthRoutes.js) เพื่อให้ระบบ Monitoring หรือ Cloud Platform สามารถทำ Liveness/Readiness Probe ได้ รวมถึงใช้ Centralized Error Middleware เพื่อให้ Response ที่มี Error มีรูปแบบโครงสร้างที่สม่ำเสมอและไม่ทำข้อมูลภายในรั่วไหลสู่ภายนอก