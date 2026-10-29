import * as service from '../services/usersService.js';

/** controller รู้จัก req/res และตัดสิน status code — แต่ไม่จัดการข้อมูลเอง */

export function listUsers(req, res) {
  res.status(200).json(service.findAll());
}

export function getUsers(req, res) {
  const found = service.findById(req.params.id);
  if (!found) {
    return res.status(404).json({ error: `ไม่พบคำร้อง ${req.params.id}` });
  }
  res.status(200).json(found);
}

export function createUsers(req, res) {
  const created = service.create(req.body);
  res.status(201).json(created);
}



export function deleteUsers(req, res) {
  const removed = service.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  res.status(204).end();
}