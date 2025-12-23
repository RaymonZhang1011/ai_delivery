import axios from 'axios';
import type { Project, GitRepo, Task, Conversation, DeliveryReport, ProjectAssignee, PendingRequirement } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 项目相关API
export const projectApi = {
  getAll: () => api.get<{ success: boolean; data: Project[] }>('/projects'),
  getById: (id: string) => api.get<{ success: boolean; data: Project }>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<{ success: boolean; data: Project }>('/projects', data),
  update: (id: string, data: Partial<Project>) =>
    api.put<{ success: boolean; data: Project }>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),

  // Git仓库管理
  getRepos: (projectId: string) =>
    api.get<{ success: boolean; data: GitRepo[] }>(`/projects/${projectId}/repos`),
  addRepo: (projectId: string, data: Partial<GitRepo>) =>
    api.post<{ success: boolean; data: GitRepo }>(`/projects/${projectId}/repos`, data),
  deleteRepo: (projectId: string, repoId: string) =>
    api.delete(`/projects/${projectId}/repos/${repoId}`),

  // Git仓库知识管理
  generateRepoKnowledge: (projectId: string, repoId: string) =>
    api.post<{ success: boolean; message: string }>(`/projects/${projectId}/repos/${repoId}/knowledge/generate`),
  getRepoKnowledge: (projectId: string, repoId: string) =>
    api.get<{ success: boolean; data: { knowledge: string | null; knowledgeStatus: string; knowledgeGeneratedAt: Date | string | null } }>(`/projects/${projectId}/repos/${repoId}/knowledge`),

  // 人员管理
  getAssignees: (projectId: string) =>
    api.get<{ success: boolean; data: ProjectAssignee[] }>(`/projects/${projectId}/assignees`),
  addAssignee: (projectId: string, data: Partial<ProjectAssignee>) =>
    api.post<{ success: boolean; data: ProjectAssignee }>(`/projects/${projectId}/assignees`, data),
  deleteAssignee: (projectId: string, assigneeId: string) =>
    api.delete(`/projects/${projectId}/assignees/${assigneeId}`),
};

// 任务相关API
export const taskApi = {
  getAll: (params?: { projectId?: string; status?: string }) =>
    api.get<{ success: boolean; data: Task[] }>('/tasks', { params }),
  getById: (id: string) => api.get<{ success: boolean; data: Task }>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<{ success: boolean; data: Task }>('/tasks', data),
  update: (id: string, data: Partial<Task>) =>
    api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  getConversations: (taskId: string) =>
    api.get<{ success: boolean; data: Conversation[] }>(`/tasks/${taskId}/conversations`),
  addConversation: (taskId: string, data: { role: string; content: string }) =>
    api.post<{ success: boolean; data: Conversation }>(`/tasks/${taskId}/conversations`, data),
  getReport: (taskId: string) =>
    api.get<{ success: boolean; data: DeliveryReport }>(`/tasks/${taskId}/report`),
  // 获取待下发任务
  getPendingRequirements: (params?: { projectId?: string }) =>
    api.get<{ success: boolean; data: PendingRequirement[] }>('/tasks/pending-requirements/list', { params }),
};

export default api;
