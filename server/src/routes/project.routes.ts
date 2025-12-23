import { Router } from 'express';
import * as projectController from '../controllers/project.controller';

const router = Router();

// 项目相关路由
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Git仓库相关路由
router.get('/:projectId/repos', projectController.getProjectRepos);
router.post('/:projectId/repos', projectController.addGitRepo);
router.delete('/:projectId/repos/:repoId', projectController.deleteGitRepo);

// Git仓库知识管理路由
router.post('/:projectId/repos/:repoId/knowledge/generate', projectController.generateRepoKnowledge);
router.get('/:projectId/repos/:repoId/knowledge', projectController.getRepoKnowledge);

// 人员管理路由
router.get('/:projectId/assignees', projectController.getProjectAssignees);
router.post('/:projectId/assignees', projectController.addProjectAssignee);
router.delete('/:projectId/assignees/:assigneeId', projectController.deleteProjectAssignee);

export default router;
