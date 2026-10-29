import { Router } from 'express';
import * as controller from '../controllers/usersController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

// route เจาะจงต้องมาก่อน route ที่มี :id เสมอ
router.get('/', controller.listUsers);
router.post('/', validateRequest, controller.createUsers);
router.get('/:id', controller.getUsers);
router.delete('/:id', controller.deleteUsers);

export default router;