# API Contract — Campus Service Request API

Base URL: `http://localhost:3001`

| Method | Endpoint | Description | Request body | Success response | Error response |
|---|---|---|---|---|---|
| GET | `/` | ตรวจสอบสถานะการทำงานของ API (Health Check) | — | `200 OK`<br>`{"message": "Campus Service API is running", "version": "1.0.0"}` | — |
| GET | `/api/requests` | ดึงรายการคำร้องทั้งหมด | — | `200 OK`<br>`Array<Request>` | `500 Internal Server Error`<br>`{"error": "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"}` |
| GET | `/api/requests?status=:status` | ⭐ กรองคำร้องตามสถานะ (`pending`, `in-progress`, `completed`) | — | `200 OK`<br>`Array<Request>` (กรองแล้ว) | `500 Internal Server Error`<br>`{"error": "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"}` |
| GET | `/api/requests/:id` | ดึงรายละเอียดคำร้องตาม ID | — | `200 OK`<br>`Request` | `404 Not Found`<br>`{"error": "ไม่พบคำร้องรหัส :id"}` |
| POST | `/api/requests` | สร้างคำร้องใหม่ (ผ่าน validation) | `{"requesterName": string, "requestType": string, "location": string, "details": string, "priority": "normal" \| "urgent"}` | `201 Created`<br>`Request` (มี `id` และ `status: "pending"`) | `400 Bad Request`<br>`{"error": "...", "details": [...]}` |
| PUT | `/api/requests/:id` | ⭐ ปรับปรุงสถานะคำร้อง | `{"status": "pending" \| "in-progress" \| "completed"}` | `200 OK`<br>`Request` (สถานะใหม่) | `400 Bad Request`<br>`{"error": "สถานะไม่ถูกต้อง: :status"}`<br>หรือ `404 Not Found` |
| DELETE | `/api/requests/:id` | ลบคำร้องตาม ID ออกจากระบบ | — | `204 No Content`<br>*(ไม่มี body)* | `404 Not Found`<br>`{"error": "ไม่พบคำร้องรหัส :id"}` |
| ANY | `/api/*` (เส้นทางที่ไม่มี) | ดักจับ Request ที่ไม่มี route ตรงกับระบบ | — | — | `404 Not Found`<br>`{"error": "ไม่พบเส้นทาง METHOD URL"}` |

---

## ข้อกำหนดของข้อมูล (Schema & Validation Rules)

- **`requesterName`**: string (ความยาวอย่างน้อย 2 ตัวอักษร)
- **`requestType`**: string ต้องเป็นค่าใดค่าหนึ่งใน: `แจ้งซ่อม`, `บริการบัญชีผู้ใช้`, `ขอใช้อุปกรณ์`, `อื่น ๆ`
- **`location`**: string (ต้องไม่เป็นค่าว่าง)
- **`details`**: string (ความยาวอย่างน้อย 10 ตัวอักษร)
- **`priority`**: string ต้องเป็น `normal` หรือ `urgent`
- **`status`**: string ระบบตั้งต้นเป็น `pending` รองรับค่า: `pending`, `in-progress`, `completed`

---

## ตัวอย่าง JSON

### 1. โครงสร้างข้อมูลคำร้อง (Request Object)

```json
{
  "id": "REQ-MTR3SSZ3-79LJ",
  "requesterName": "สมชาย ใจดี",
  "requestType": "แจ้งซ่อม",
  "location": "อาคารเรียนรวม 3 ห้อง 302",
  "details": "โปรเจกเตอร์เปิดไม่ติด มีไฟสีส้มกระพริบ",
  "priority": "urgent",
  "status": "pending"
}
```

### 2. ตัวอย่าง Request Body สำหรับสร้างคำร้อง (POST `/api/requests`)

```json
{
  "requesterName": "สมหญิง รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องแล็บคอมพิวเตอร์ 4",
  "details": "ขอเบิกสายแปลงสัญญาณ HDMI เพิ่มเติม 2 เส้น",
  "priority": "normal"
}
```

### 3. ตัวอย่าง Request Body สำหรับอัปเดตสถานะ (PUT `/api/requests/:id`)

```json
{
  "status": "in-progress"
}
```

### 4. ตัวอย่าง Validation Error Response (`400 Bad Request`)

```json
{
  "error": "ข้อมูลคำร้องไม่ถูกต้อง",
  "details": [
    "ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร",
    "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร"
  ]
}
```

### 5. ตัวอย่าง Not Found Response (`404 Not Found`)

```json
{
  "error": "ไม่พบคำร้องรหัส REQ-999"
}
```