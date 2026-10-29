import * as service from "../services/requestService.js";
import { AppError } from "../middleware/errorHandler.js";

/** controller รู้จัก req/res และตัดสิน status code — แต่ไม่จัดการข้อมูลเอง */

export function listRequests(req, res) {
  const { status } = req.query;
  res.status(200).json(service.findAll({ status }));
}

export function getRequest(req, res) {
  const found = service.findById(req.params.id);
  if (!found) throw new AppError(`ไม่พบคำร้อง ${req.params.id}`, 404);
  res.status(200).json(found);
}

export function createRequest(req, res) {
  const created = service.create(req.body);
  res.status(201).json(created);
}

export function updateRequestStatus(req, res) {
  const ALLOWED = ["pending", "in-progress", "completed"];
  const { status } = req.body ?? {};
  if (!ALLOWED.includes(status)) {
    // return res.status(400).json({ error: 'สถานะต้องเป็น pending, in-progress หรือ completed' });
    throw new AppError(
      `สถานะต้องเป็น pending, in-progress หรือ completed`,
      400,
    );
  }
  const updated = service.updateStatus(req.params.id, status);
  if (!updated) {
    // return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
    throw new AppError(`ไม่พบคำร้องรหัส ${req.params.id}`, 404);
  }
  res.status(200).json(updated);
}

export function deleteRequest(req, res) {
  const removed = service.remove(req.params.id);
  if (!removed) {
    // return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
    throw new AppError(`ไม่พบคำร้องรหัส ${req.params.id}`, 404);
  }
  res.status(204).end();
}

// เพิ่มฟังก์ชันสำหรับเคลียร์ข้อมูล
export async function resetRequests(req, res) {
  await service.reset();
  // (หรือ await service.loadSeed(); ถ้าไม่ได้สร้างฟังก์ชันใหม่ใน Service)

  res.status(200).json({ message: "รีเซ็ตข้อมูลเรียบร้อยแล้ว" });
}