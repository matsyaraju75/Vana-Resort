import { Router } from 'express';
import { getRooms, getRoomBySlug } from '../controllers/roomController.js';

const router = Router();

router.get('/', getRooms);
router.get('/:slug', getRoomBySlug);

export default router;
