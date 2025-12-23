export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface CreateGitRepoDto {
  projectId: string;
  name: string;
  url: string;
  description?: string;
  owner?: string;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description: string;
  createdBy: string;
}

export interface UpdateTaskDto {
  status?: string;
  title?: string;
  description?: string;
}

export interface CreateConversationDto {
  taskId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
