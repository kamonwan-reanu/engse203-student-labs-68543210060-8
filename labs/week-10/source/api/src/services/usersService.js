import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { AppError } from "../middleware/errorHandler.js";

/**
 * Week 10 — เปลี่ยน service จากอ่านไฟล์ JSON เป็นฐานข้อมูล SQLite
 *
 * ตอนนี้ยังเป็นเวอร์ชัน Week 07 (อ่านไฟล์ JSON) อยู่
 * งานของสัปดาห์นี้คือเปลี่ยนให้ใช้ node:sqlite
 *
 * ⚠ กฎเหล็ก: signature ของทุกฟังก์ชันต้องเหมือนเดิมทุกตัว
 *   → controller และ frontend จะได้ไม่ต้องแก้เลย
 */

// ── ของเดิม Week 07 (อ่านไฟล์ JSON) — จะถูกแทนที่ ──
// const HERE = path.dirname(fileURLToPath(import.meta.url));
// const DATA = path.resolve(HERE, '../..', 'data', 'requests.json');
// let requests = [];
const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, "../..");
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, "data", "campus.db");
const SCHEMA_FILE = path.join(API_ROOT, "data", "schema.sql");
let db;

const SELECT_SHAPE = `
  SELECT r.id,
         u.name          AS requesterName,
         r.request_type  AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id`;

const SELECT_USERS = `SELECT id, name, department, email FROM users`;

export async function loadSeed() {
  /**
   * TODO W10-1 (CP26) · เปิดฐานข้อมูลด้วย node:sqlite
   *   import { DatabaseSync } from 'node:sqlite'
   *   - เปิดไฟล์ campus.db (จากสัปดาห์ที่ 9)
   *   - สั่ง PRAGMA foreign_keys = ON  ⚠ สำคัญมาก
   *   - ถ้ายังไม่มีตาราง ให้สร้างจาก schema.sql
   *
   * TODO W10-2 (CP27) · ⚠ path ต้องอ้างจากตำแหน่งไฟล์นี้ ไม่ใช่จากที่รันคำสั่ง
   *   ใช้ fileURLToPath(import.meta.url) — ไม่งั้น dev กับ checker หาไฟล์คนละที่
   */
  db = new DatabaseSync(DB_FILE);
  db.exec("PRAGMA foreign_keys = ON");
  const ready = db
    .prepare(
      "SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='users'",
    )
    .get().c;
  if (!ready) db.exec(readFileSync(SCHEMA_FILE, "utf8"));
  // try {
  //   requests = JSON.parse(await readFile(DATA, 'utf8'));
  // } catch {
  //   requests = [];
  // }
}

export function findAll() {
  /**
   * TODO W10-3 (CP28) · เปลี่ยนเป็น SELECT จากฐานข้อมูล
   *   - ใช้ JOIN กับตาราง users เพื่อคืน requesterName (ไม่ใช่ requester_id)
   *   - ตั้งชื่อคอลัมน์ด้วย AS ให้ตรงกับที่ frontend ใช้
   *   - ถ้ามี status ให้เติม WHERE r.status = ?
   *   คำใบ้: คัดลอก query จาก queries.sql ที่ทำสัปดาห์ที่แล้วมาปรับ
   */

  // return db.prepare('SELECT * FROM requests').all();   // ยังไม่มี JOIN ก็ได้
  return db.prepare('SELECT * FROM users ORDER BY id').all();
}

export function findById(id) {
  /** TODO W10-4 (CP28) · SELECT ... WHERE r.id = ?  · ไม่พบให้คืน null */
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) ?? null;
}

export function create(input) {
  /**
   * TODO W10-5 (CP29) · INSERT ลงฐานข้อมูล
   *   ⚠ frontend ส่ง requesterName (ชื่อ) มา แต่ตารางเก็บ requester_id (ตัวเลข)
   *   → ต้องหา id ของชื่อนั้นก่อน ถ้ายังไม่มีในระบบให้สร้าง user ใหม่
   *   นี่คือ "หน้าที่ของ service" ที่พูดถึงในบทที่ 9 ของสัปดาห์ที่แล้ว
   */
 
  try {
    const result = db.prepare(
     `INSERT INTO users (name, department, email)
     VALUES (?, ?, ?)`
    ).run(
      input.name.trim(),                                                                                        
      input.department || 'ไม่ระบุ',                                                                              
      input.email.trim()
    );
    return findById(result.lastInsertRowid); // คืนรูปแบบที่ frontend ต้องการ
  } catch (err) {
    throw toAppError(err);
  }
  
}



export function remove(id) {
  const target = findById(id);                                                                                  
  if (!target) return null;                                                                                     
  db.prepare("DELETE FROM users WHERE id = ?").run(id);                                                         
  return target;
}


function toAppError(err) {
  const m = err.message ?? "";
  if (m.includes("FOREIGN KEY"))
    return new AppError("อ้างถึงข้อมูลที่ไม่มีอยู่จริง", 400);
  if (m.includes("CHECK"))
    return new AppError("ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด", 400);
  if (m.includes("UNIQUE"))
    return new AppError("ข้อมูลนี้มีอยู่แล้วในระบบ", 409);
  return err; // error อื่นปล่อยผ่าน → errorHandler ตอบ 500
}