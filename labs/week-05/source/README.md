# ENGSE203 LAB 5 — React Routing Data Fetching Mini App

## ผู้จัดทำ

- ชื่อ–นามสกุล: กมลวรรณ เรณู
- รหัสนักศึกษา: 68543210060-8
- Section: ENGSE203 Computer Programming for Software Engineer (Sec1)

## URLs

- Repository: https://github.com/kamonwan-reanu/kamonwan-reanu/engse203-student-labs-68543210060-8
- Pull Request: https://github.com/kamonwan-reanu/kamonwan-reanu/engse203-student-labs-68543210060-8/pull/7
- GitHub Pages: https://kamonwan-reanu.github.io/kamonwan-reanu/engse203-student-labs-68543210060-8/

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