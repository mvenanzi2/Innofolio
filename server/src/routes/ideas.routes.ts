import { Router } from 'express';
import {
  getIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  sidelineIdea,
  addCollaborator,
  removeCollaborator
} from '../controllers/ideas.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getIdeas);
router.get('/:id', getIdeaById);
router.post('/', createIdea);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);
router.patch('/:id/sideline', sidelineIdea);
router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators/:userId', removeCollaborator);

export default router;
