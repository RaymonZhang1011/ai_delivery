import { Router } from 'express';
import * as taskController from '../controllers/task.controller';

const router = Router();

// 任务相关路由
router.get('/', taskController.getAllTasks);
router.get('/pending-requirements/list', taskController.getPendingRequirements); // 获取待下发任务
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// 会话相关路由
router.get('/:taskId/conversations', taskController.getTaskConversations);
router.post('/:taskId/conversations', taskController.addConversation);

// 交付报告相关路由
router.get('/:taskId/report', taskController.getTaskReport);

export default router;
