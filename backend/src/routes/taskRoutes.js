import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createTask, getTasks, getTask, updateTask, deleteTask, updateTaskStatus } from '../controllers/taskController.js';

const router = express.Router();

router.use(auth);

// Base routes
router.get('/', getTasks);
router.post('/', createTask);

// Task specific routes
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Status update route
router.put('/:id/status', updateTaskStatus);

export default router;
