import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate, requireRole } from '../middleware/auth.js'; // 🏫 TODO W13-AUTH (CP51): import middleware

const router = Router();

// route เจาะจงต้องมาก่อน route ที่มี :id เสมอ
router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);

// 🏫 TODO W13-AUTH (CP51): เปลี่ยนสถานะและลบ ได้เฉพาะเจ้าหน้าที่ที่ผ่านการตรวจสอบแล้วเท่านั้น
router.put('/:id', authenticate, requireRole('staff'), controller.updateRequestStatus);
router.delete('/:id', authenticate, requireRole('staff'), controller.deleteRequest);

export default router;