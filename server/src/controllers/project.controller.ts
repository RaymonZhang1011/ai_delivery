import { Request, Response } from 'express';

// Mock数据
const mockProjects = [
  {
    id: '1',
    name: 'Moma',
    description: '管理后台系统',
    testEnv: 'https://moma-test.example.com',
    domain: 'moma.example.com',
    keyones: '技术中台/基础服务/后台管理/Moma系统',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Codelink',
    description: '代码协作平台',
    testEnv: 'https://codelink-test.example.com',
    domain: 'codelink.example.com',
    keyones: '技术效能中心/效能架构部/CodeLink/IDECodeLink',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'AI需求交付平台',
    description: '端到端AI需求交付',
    testEnv: 'https://ai-delivery-test.example.com',
    domain: 'ai-delivery.example.com',
    keyones: 'AI中台/智能交付/需求管理/AI交付平台',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockGitRepos: Record<string, any[]> = {
  '1': [
    {
      id: 'repo-1',
      projectId: '1',
      name: 'moma-frontend',
      url: 'https://github.com/company/moma-frontend',
      description: '前端仓库',
      owner: '张三',
      reviewer: '李四',
      knowledge: null,
      knowledgeStatus: 'not_generated',
      knowledgeGeneratedAt: null,
    },
    {
      id: 'repo-2',
      projectId: '1',
      name: 'moma-backend',
      url: 'https://github.com/company/moma-backend',
      description: '后端仓库',
      owner: '李四',
      reviewer: '王五',
      knowledge: null,
      knowledgeStatus: 'not_generated',
      knowledgeGeneratedAt: null,
    },
  ],
  '2': [
    {
      id: 'repo-3',
      projectId: '2',
      name: 'codelink-core',
      url: 'https://github.com/company/codelink-core',
      description: '核心服务',
      owner: '王五',
      reviewer: '张三',
      knowledge: null,
      knowledgeStatus: 'not_generated',
      knowledgeGeneratedAt: null,
    },
  ],
  '3': [
    {
      id: 'repo-4',
      projectId: '3',
      name: 'ai-delivery-platform',
      url: 'https://github.com/company/ai-delivery-platform',
      description: '交付平台主仓库',
      owner: '赵六',
      reviewer: '张三',
      knowledge: null,
      knowledgeStatus: 'not_generated',
      knowledgeGeneratedAt: null,
    },
  ],
};

const mockProjectAssignees: Record<string, any[]> = {
  '1': [
    { id: 'assignee-1', projectId: '1', userName: '张三', userEmail: 'zhangsan@example.com', position: '产品经理', createdAt: new Date() },
    { id: 'assignee-2', projectId: '1', userName: '李四', userEmail: 'lisi@example.com', position: '技术负责人', createdAt: new Date() },
  ],
  '2': [
    { id: 'assignee-3', projectId: '2', userName: '王五', userEmail: 'wangwu@example.com', position: '架构师', createdAt: new Date() },
  ],
  '3': [
    { id: 'assignee-4', projectId: '3', userName: '赵六', userEmail: 'zhaoliu@example.com', position: '项目经理', createdAt: new Date() },
  ],
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: mockProjects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = mockProjects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, testEnv, domain, keyones } = req.body;
    const newProject = {
      id: String(mockProjects.length + 1),
      name,
      description,
      testEnv,
      domain,
      keyones,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(newProject);
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, testEnv, domain, keyones } = req.body;
    const projectIndex = mockProjects.findIndex((p) => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      name: name !== undefined ? name : mockProjects[projectIndex].name,
      description: description !== undefined ? description : mockProjects[projectIndex].description,
      testEnv: testEnv !== undefined ? testEnv : mockProjects[projectIndex].testEnv,
      domain: domain !== undefined ? domain : mockProjects[projectIndex].domain,
      keyones: keyones !== undefined ? keyones : mockProjects[projectIndex].keyones,
      updatedAt: new Date(),
    };

    res.json({ success: true, data: mockProjects[projectIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectIndex = mockProjects.findIndex((p) => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    mockProjects.splice(projectIndex, 1);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
};

export const getProjectRepos = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const repos = mockGitRepos[projectId] || [];

    res.json({ success: true, data: repos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch repositories' });
  }
};

export const addGitRepo = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, url, description, owner, reviewer } = req.body;

    if (!mockGitRepos[projectId]) {
      mockGitRepos[projectId] = [];
    }

    const newRepo = {
      id: `repo-${Date.now()}`,
      projectId,
      name,
      url,
      description,
      owner,
      reviewer,
      knowledge: null,
      knowledgeStatus: 'not_generated',
      knowledgeGeneratedAt: null,
    };

    mockGitRepos[projectId].push(newRepo);
    res.status(201).json({ success: true, data: newRepo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add repository' });
  }
};

export const deleteGitRepo = async (req: Request, res: Response) => {
  try {
    const { projectId, repoId } = req.params;

    if (!mockGitRepos[projectId]) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const repoIndex = mockGitRepos[projectId].findIndex((r) => r.id === repoId);

    if (repoIndex === -1) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }

    mockGitRepos[projectId].splice(repoIndex, 1);
    res.json({ success: true, message: 'Repository deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete repository' });
  }
};

// 人员管理API
export const getProjectAssignees = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const assignees = mockProjectAssignees[projectId] || [];
    res.json({ success: true, data: assignees });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch assignees' });
  }
};

export const addProjectAssignee = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { userName, userEmail, position } = req.body;

    if (!mockProjectAssignees[projectId]) {
      mockProjectAssignees[projectId] = [];
    }

    const newAssignee = {
      id: `assignee-${Date.now()}`,
      projectId,
      userName,
      userEmail,
      position,
      createdAt: new Date(),
    };

    mockProjectAssignees[projectId].push(newAssignee);
    res.status(201).json({ success: true, data: newAssignee });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add assignee' });
  }
};

export const deleteProjectAssignee = async (req: Request, res: Response) => {
  try {
    const { projectId, assigneeId } = req.params;

    if (!mockProjectAssignees[projectId]) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const assigneeIndex = mockProjectAssignees[projectId].findIndex((a) => a.id === assigneeId);

    if (assigneeIndex === -1) {
      return res.status(404).json({ success: false, error: 'Assignee not found' });
    }

    mockProjectAssignees[projectId].splice(assigneeIndex, 1);
    res.json({ success: true, message: 'Assignee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete assignee' });
  }
};

// Git仓库知识生成API
export const generateRepoKnowledge = async (req: Request, res: Response) => {
  try {
    const { projectId, repoId } = req.params;

    if (!mockGitRepos[projectId]) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const repoIndex = mockGitRepos[projectId].findIndex((r) => r.id === repoId);

    if (repoIndex === -1) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }

    // 更新状态为generating
    mockGitRepos[projectId][repoIndex].knowledgeStatus = 'generating';

    // 模拟异步生成过程
    setTimeout(() => {
      const mockKnowledge = `# ${mockGitRepos[projectId][repoIndex].name} 仓库知识库

## 项目概述
这是一个${mockGitRepos[projectId][repoIndex].description}的Git仓库。

## 技术栈
- 前端框架：React 18
- 构建工具：Vite
- UI组件库：Ant Design

## 目录结构
\`\`\`
src/
  ├── components/    # 公共组件
  ├── pages/         # 页面组件
  ├── services/      # API服务
  └── types/         # 类型定义
\`\`\`

## 开发规范
1. 使用TypeScript进行类型检查
2. 遵循ESLint代码规范
3. 组件命名采用PascalCase
4. 函数命名采用camelCase

## API调用规范
所有API调用统一通过 \`services/api.ts\` 中的封装方法进行。

## 部署流程
1. 执行 \`npm run build\` 构建生产版本
2. 将 \`dist/\` 目录部署到服务器
3. 配置Nginx反向代理

---
生成时间：${new Date().toLocaleString()}
负责人：${mockGitRepos[projectId][repoIndex].owner}
CR人：${mockGitRepos[projectId][repoIndex].reviewer}
`;

      mockGitRepos[projectId][repoIndex].knowledge = mockKnowledge;
      mockGitRepos[projectId][repoIndex].knowledgeStatus = 'generated';
      mockGitRepos[projectId][repoIndex].knowledgeGeneratedAt = new Date();
    }, 3000); // 模拟3秒生成时间

    res.json({ success: true, message: 'Knowledge generation started' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate knowledge' });
  }
};

export const getRepoKnowledge = async (req: Request, res: Response) => {
  try {
    const { projectId, repoId } = req.params;

    if (!mockGitRepos[projectId]) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const repo = mockGitRepos[projectId].find((r) => r.id === repoId);

    if (!repo) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }

    res.json({
      success: true,
      data: {
        knowledge: repo.knowledge,
        knowledgeStatus: repo.knowledgeStatus,
        knowledgeGeneratedAt: repo.knowledgeGeneratedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch knowledge' });
  }
};
