# ENGSE203 LAB 5 — React Routing Data Fetching Mini App

## ผู้จัดทำ

- ชื่อ–นามสกุล: สุวิมนต์ ไชยเดช
- รหัสนักศึกษา: 68543210046-7
- Section: ENGSE203 Computer Programming for Software Engineer (Sec1)

## URLs

- Repository: https://github.com/Mssuwimon/engse203-suwimon-labs-68543210046-7
- Pull Request: https://github.com/Mssuwimon/engse203-suwimon-labs-68543210046-7/pull/7
- GitHub Pages: https://mssuwimon.github.io/engse203-suwimon-labs-68543210046-7/

## Component Tree

App
├── AppHeader
├── SummaryPanel
├── RequestForm
├── FilterBar
└── RequestList
    └── RequestCard

State Owner

App
- requests
- statusFilter

RequestForm
- formData
- errors
- feedback

## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview