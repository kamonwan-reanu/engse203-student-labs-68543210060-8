# Week 03 Evidence

ควรมี screenshots desktop/mobile, form valid/invalid และผล manual test

## หน้าเว็บหลัก
![หน้าเว็บ](./screenshots/หน้าเว็บ.png)

## กรอกข้อมูล
![กรอกข้อมูล](./screenshots/กรอกข้อมูล.png)

## แจ้งเตือน (Form Invalid)
![แจ้งเตือน](./screenshots/แจ้งเตือน.png)

## แสดง Request
![แสดง Request](./screenshots/แสดงRequest.png)

## แสดงจำนวน Request
![แสดงจำนวน Request](./screenshots/แสดงจำนวนRequest.png)

## Manual Test Results

| Test Case | Expected | Actual | Result |
|---|---|---|---|
| กรอกข้อมูลครบถ้วน | ส่งฟอร์มสำเร็จ | ส่งสำเร็จ | ✅ Pass |
| กรอกข้อมูลไม่ครบ | แสดงข้อความแจ้งเตือน | แสดงข้อความแจ้งเตือนถูกต้อง | ✅ Pass |
| แสดงจำนวน Request | นับจำนวนถูกต้อง | ถูกต้อง | ✅ Pass |