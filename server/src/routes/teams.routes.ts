import { Router } from 'express';
import { getTeam, getTeamMembers } from '../controllers/teams.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/:id', getTeam);
router.get('/:id/members', getTeamMembers);

export default router;
