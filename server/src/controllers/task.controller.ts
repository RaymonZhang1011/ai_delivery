import { Request, Response } from 'express';

// Mock数据
const mockTasks: any[] = [
  {
    id: 'task-1',
    projectId: '1',
    title: '实现用户登录功能',
    description: '需要实现用户登录功能，包括用户名密码登录和第三方登录',
    status: 'completed', // 已完成：MR已合并
    createdBy: 'user-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    completedAt: new Date('2024-01-16'),
  },
  {
    id: 'task-2',
    projectId: '2',
    title: '优化代码编辑器性能',
    description: '优化大文件编辑时的性能，减少卡顿',
    status: 'pending_confirm', // 待确认：AI已完成，MR待CR
    createdBy: 'user-2',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    completedAt: null,
  },
  {
    id: 'task-3',
    projectId: '3',
    title: '添加AI需求分析功能',
    description: '基于用户输入的需求描述，自动分析需求并生成任务列表',
    status: 'in_progress', // 进行中：还没有生成报告
    createdBy: 'user-1',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    completedAt: null,
  },
];

const mockConversations: Record<string, any[]> = {
  'task-1': [
    {
      id: 'conv-1',
      taskId: 'task-1',
      role: 'user',
      content: '请实现用户登录功能，包括用户名密码登录和第三方登录（GitHub、Google）',
      createdAt: new Date('2024-01-15T10:00:00'),
      step: '需求提交',
    },
    {
      id: 'conv-2',
      taskId: 'task-1',
      role: 'assistant',
      content: '收到需求，开始分析项目结构和技术方案...',
      structuredContent: {
        type: 'analysis',
        analysis: [
          { label: '项目', value: 'Moma管理后台系统', type: 'info' },
          { label: '涉及仓库', value: 'moma-frontend, moma-backend', type: 'info' },
          { label: '预计工作量', value: '4-6小时', type: 'warning' },
          { label: '风险评估', value: '中等', type: 'warning' },
        ],
      },
      createdAt: new Date('2024-01-15T10:01:00'),
      step: '需求分析',
    },
    {
      id: 'conv-3',
      taskId: 'task-1',
      role: 'assistant',
      content: '基于项目知识库分析，需要修改以下Git仓库：',
      structuredContent: {
        type: 'tree',
        tree: [
          {
            key: 'moma-frontend',
            title: 'moma-frontend',
            icon: 'github',
            children: [
              { key: 'login-page', title: '创建登录页面组件', status: 'pending' },
              { key: 'auth-service', title: '添加认证服务API调用', status: 'pending' },
              { key: 'oauth-components', title: '实现第三方登录组件', status: 'pending' },
              { key: 'route-guard', title: '配置路由守卫', status: 'pending' },
            ],
          },
          {
            key: 'moma-backend',
            title: 'moma-backend',
            icon: 'github',
            children: [
              { key: 'auth-controller', title: '实现登录控制器', status: 'pending' },
              { key: 'jwt-middleware', title: '添加JWT中间件', status: 'pending' },
              { key: 'oauth-integration', title: '集成GitHub/Google OAuth', status: 'pending' },
              { key: 'user-model', title: '扩展用户模型', status: 'pending' },
            ],
          },
        ],
      },
      createdAt: new Date('2024-01-15T10:02:00'),
      step: 'Git仓库分析',
    },
    {
      id: 'conv-4',
      taskId: 'task-1',
      role: 'assistant',
      content: '制定实施计划，以下是详细的任务清单（点击展开查看具体文件和代码）：',
      structuredContent: {
        type: 'todo',
        todos: [
          {
            id: 'todo-1',
            content: '前端：创建登录页面UI',
            status: 'completed',
            type: 'task',
            children: [
              {
                id: 'todo-1-repo',
                content: 'moma-frontend',
                status: 'completed',
                type: 'repo',
                children: [
                  {
                    id: 'todo-1-file-1',
                    content: 'src/pages/LoginPage.tsx',
                    status: 'completed',
                    type: 'file',
                    children: [
                      {
                        id: 'todo-1-code-1',
                        content: '登录页面组件代码',
                        status: 'completed',
                        type: 'code',
                        code: {
                          language: 'typescript',
                          content: `import React, { useState } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setLoading(true);
    // 登录逻辑
  };

  return (
    <div className="login-container">
      <Form onFinish={handleLogin}>
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          登录
        </Button>
        <Divider>或</Divider>
        <Button icon={<GithubOutlined />} block>GitHub登录</Button>
        <Button icon={<GoogleOutlined />} block>Google登录</Button>
      </Form>
    </div>
  );
};

export default LoginPage;`
                        }
                      }
                    ]
                  },
                  {
                    id: 'todo-1-file-2',
                    content: 'src/services/auth.ts',
                    status: 'completed',
                    type: 'file',
                    children: [
                      {
                        id: 'todo-1-code-2',
                        content: '认证API调用',
                        status: 'completed',
                        type: 'code',
                        code: {
                          language: 'typescript',
                          content: `export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  loginWithGithub: (code: string) =>
    api.post('/auth/github', { code }),
  loginWithGoogle: (token: string) =>
    api.post('/auth/google', { token }),
};`
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'todo-2',
            content: '后端：实现登录API接口',
            status: 'completed',
            type: 'task',
            children: [
              {
                id: 'todo-2-repo',
                content: 'moma-backend',
                status: 'completed',
                type: 'repo',
                children: [
                  {
                    id: 'todo-2-file-1',
                    content: 'src/controllers/auth.controller.ts',
                    status: 'completed',
                    type: 'file',
                    children: [
                      {
                        id: 'todo-2-code-1',
                        content: '登录控制器',
                        status: 'completed',
                        type: 'code',
                        code: {
                          language: 'typescript',
                          content: `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token, user: { id: user.id, username: user.username } });
};`
                        }
                      }
                    ]
                  },
                  {
                    id: 'todo-2-file-2',
                    content: 'src/middleware/auth.middleware.ts',
                    status: 'completed',
                    type: 'file',
                    children: [
                      {
                        id: 'todo-2-code-2',
                        content: 'JWT认证中间件',
                        status: 'completed',
                        type: 'code',
                        code: {
                          language: 'typescript',
                          content: `import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token无效' });
  }
};`
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'todo-3',
            content: '数据库：扩展用户表结构',
            status: 'completed',
            type: 'task',
            children: [
              {
                id: 'todo-3-repo',
                content: 'moma-backend',
                status: 'completed',
                type: 'repo',
                children: [
                  {
                    id: 'todo-3-file-1',
                    content: 'migrations/add_oauth_fields.sql',
                    status: 'completed',
                    type: 'file',
                    children: [
                      {
                        id: 'todo-3-code-1',
                        content: 'DDL迁移脚本',
                        status: 'completed',
                        type: 'code',
                        code: {
                          language: 'sql',
                          content: `-- 添加第三方登录字段
ALTER TABLE users
ADD COLUMN github_id VARCHAR(255),
ADD COLUMN google_id VARCHAR(255),
ADD COLUMN avatar_url VARCHAR(500),
ADD COLUMN provider VARCHAR(50);

-- 创建索引
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_google_id ON users(google_id);`
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'todo-4',
            content: '测试：编写单元测试',
            status: 'completed',
            type: 'task'
          },
          {
            id: 'todo-5',
            content: '文档：更新API文档',
            status: 'completed',
            type: 'task'
          }
        ],
      },
      createdAt: new Date('2024-01-15T10:03:00'),
      step: '任务规划与执行',
    },
    {
      id: 'conv-5',
      taskId: 'task-1',
      role: 'assistant',
      content: '✅ 所有任务已完成！正在生成交付报告...',
      createdAt: new Date('2024-01-15T11:25:00'),
      step: '任务完成',
    },
  ],
  'task-2': [
    {
      id: 'conv-5',
      taskId: 'task-2',
      role: 'user',
      content: '代码编辑器在打开大文件时很卡，请优化性能',
      createdAt: new Date('2024-01-17T09:00:00'),
      step: '需求提交',
    },
    {
      id: 'conv-6',
      taskId: 'task-2',
      role: 'assistant',
      content: '开始性能分析...',
      structuredContent: {
        type: 'analysis',
        analysis: [
          { label: '问题', value: '大文件加载卡顿', type: 'error' },
          { label: '影响范围', value: '代码编辑器模块', type: 'warning' },
          { label: '性能瓶颈', value: '文件一次性加载、语法高亮、无虚拟滚动', type: 'error' },
        ],
      },
      createdAt: new Date('2024-01-17T09:05:00'),
      step: '问题分析',
    },
    {
      id: 'conv-7',
      taskId: 'task-2',
      role: 'assistant',
      content: '制定优化方案并开始实施...',
      structuredContent: {
        type: 'todo',
        todos: [
          {
            id: 'todo-10',
            content: '实现文件分块加载',
            status: 'completed',
            children: [
              {
                id: 'todo-10-1',
                content: 'editor-frontend',
                status: 'completed',
                type: 'repo',
                children: [
                  {
                    id: 'todo-10-file-1',
                    content: 'src/components/CodeEditor/FileLoader.tsx',
                    status: 'completed',
                    type: 'file',
                  }
                ]
              }
            ]
          },
          {
            id: 'todo-11',
            content: '优化语法高亮算法',
            status: 'completed',
            children: [
              {
                id: 'todo-11-1',
                content: 'editor-frontend',
                status: 'completed',
                type: 'repo',
                children: [
                  {
                    id: 'todo-11-file-1',
                    content: 'src/utils/syntax-highlighter.ts',
                    status: 'completed',
                    type: 'file',
                  }
                ]
              }
            ]
          },
          {
            id: 'todo-12',
            content: '添加虚拟滚动',
            status: 'completed',
            children: [
              {
                id: 'todo-12-1',
                content: 'editor-frontend',
                status: 'completed',
                type: 'repo',
                children: [
                  {
                    id: 'todo-12-file-1',
                    content: 'src/components/CodeEditor/VirtualScroll.tsx',
                    status: 'completed',
                    type: 'file',
                  }
                ]
              }
            ]
          },
          {
            id: 'todo-13',
            content: '性能测试和对比',
            status: 'completed'
          },
        ],
      },
      createdAt: new Date('2024-01-17T09:10:00'),
      step: '优化方案',
    },
    {
      id: 'conv-8',
      taskId: 'task-2',
      role: 'assistant',
      content: '已完成文件分块加载功能的实现',
      structuredContent: {
        type: 'code',
        code: {
          language: 'typescript',
          fileName: 'src/components/CodeEditor/FileLoader.tsx',
          content: `import React, { useState, useEffect } from 'react';

const CHUNK_SIZE = 10000; // 每次加载10000行

export const FileLoader: React.FC<{ filePath: string }> = ({ filePath }) => {
  const [chunks, setChunks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadChunk = async (offset: number) => {
    setLoading(true);
    const response = await fetch(\`/api/files/\${filePath}?offset=\${offset}&limit=\${CHUNK_SIZE}\`);
    const data = await response.text();
    setChunks(prev => [...prev, data]);
    setLoading(false);
  };

  return <div>{/* 渲染代码 */}</div>;
};`,
        },
      },
      createdAt: new Date('2024-01-17T09:30:00'),
      step: '实现分块加载',
    },
    {
      id: 'conv-9',
      taskId: 'task-2',
      role: 'assistant',
      content: '已优化语法高亮算法，使用Web Worker处理',
      structuredContent: {
        type: 'code',
        code: {
          language: 'typescript',
          fileName: 'src/utils/syntax-highlighter.ts',
          content: `// 使用Web Worker进行语法高亮，避免阻塞主线程
const worker = new Worker('/workers/syntax-worker.js');

export const highlightCode = (code: string, language: string): Promise<string> => {
  return new Promise((resolve) => {
    worker.postMessage({ code, language });
    worker.onmessage = (e) => resolve(e.data);
  });
};`,
        },
      },
      createdAt: new Date('2024-01-17T10:00:00'),
      step: '优化语法高亮',
    },
    {
      id: 'conv-10',
      taskId: 'task-2',
      role: 'assistant',
      content: '已添加虚拟滚动功能',
      structuredContent: {
        type: 'code',
        code: {
          language: 'typescript',
          fileName: 'src/components/CodeEditor/VirtualScroll.tsx',
          content: `import React from 'react';
import { FixedSizeList } from 'react-window';

export const VirtualScroll: React.FC<{ lines: string[] }> = ({ lines }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={lines.length}
      itemSize={20}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{lines[index]}</div>
      )}
    </FixedSizeList>
  );
};`,
        },
      },
      createdAt: new Date('2024-01-17T10:30:00'),
      step: '添加虚拟滚动',
    },
    {
      id: 'conv-11',
      taskId: 'task-2',
      role: 'assistant',
      content: '性能测试完成，优化效果显著',
      structuredContent: {
        type: 'analysis',
        analysis: [
          { label: '优化前', value: '打开100MB文件耗时: 15s，内存占用: 800MB', type: 'error' },
          { label: '优化后', value: '打开100MB文件耗时: 2s，内存占用: 150MB', type: 'success' },
          { label: '性能提升', value: '加载速度提升7.5倍，内存占用降低81%', type: 'success' },
          { label: 'FPS', value: '从15fps提升至60fps', type: 'success' },
        ],
      },
      createdAt: new Date('2024-01-17T11:00:00'),
      step: '性能测试',
    },
    {
      id: 'conv-12',
      taskId: 'task-2',
      role: 'assistant',
      content: '✅ 优化任务已全部完成，代码已提交并创建MR，等待Code Review',
      createdAt: new Date('2024-01-17T11:30:00'),
      step: '完成',
    },
  ],
  'task-3': [
    {
      id: 'conv-9',
      taskId: 'task-3',
      role: 'user',
      content: '添加AI需求分析功能，基于用户输入的需求描述，自动分析需求并生成任务列表',
      createdAt: new Date('2024-01-18T10:00:00'),
      step: '需求提交',
    },
    {
      id: 'conv-10',
      taskId: 'task-3',
      role: 'assistant',
      content: '收到需求，正在分析项目结构和技术方案...',
      structuredContent: {
        type: 'analysis',
        analysis: [
          { label: '项目', value: 'AI交付平台', type: 'info' },
          { label: '涉及仓库', value: 'platform-frontend, platform-backend', type: 'info' },
          { label: '预计工作量', value: '6-8小时', type: 'warning' },
          { label: '技术栈', value: 'React + TypeScript + OpenAI API', type: 'info' },
        ],
      },
      createdAt: new Date('2024-01-18T10:01:00'),
      step: '需求分析',
    },
    {
      id: 'conv-11',
      taskId: 'task-3',
      role: 'assistant',
      content: '分析完成，需要修改以下Git仓库：',
      structuredContent: {
        type: 'tree',
        tree: [
          {
            key: 'platform-frontend',
            title: 'platform-frontend',
            icon: 'github',
            children: [
              { key: 'ai-analysis-page', title: '创建AI需求分析页面', status: 'in_progress' },
              { key: 'analysis-form', title: '实现需求输入表单', status: 'in_progress' },
              { key: 'result-display', title: '展示分析结果组件', status: 'pending' },
            ],
          },
          {
            key: 'platform-backend',
            title: 'platform-backend',
            icon: 'github',
            children: [
              { key: 'ai-service', title: '集成OpenAI API服务', status: 'pending' },
              { key: 'analysis-controller', title: '实现需求分析控制器', status: 'pending' },
              { key: 'prompt-templates', title: '设计AI提示词模板', status: 'pending' },
            ],
          },
        ],
      },
      createdAt: new Date('2024-01-18T10:05:00'),
      step: 'Git仓库分析',
    },
    {
      id: 'conv-12',
      taskId: 'task-3',
      role: 'assistant',
      content: '正在实施开发任务...',
      structuredContent: {
        type: 'todo',
        todos: [
          { id: 'todo-14', content: '前端：创建AI需求分析页面', status: 'in_progress' },
          { id: 'todo-15', content: '前端：实现需求输入表单', status: 'in_progress' },
          { id: 'todo-16', content: '后端：集成OpenAI API服务', status: 'pending' },
          { id: 'todo-17', content: '后端：实现需求分析控制器', status: 'pending' },
          { id: 'todo-18', content: '设计AI提示词模板', status: 'pending' },
          { id: 'todo-19', content: '展示分析结果组件', status: 'pending' },
        ],
      },
      createdAt: new Date('2024-01-18T10:10:00'),
      step: '开发计划',
    },
    {
      id: 'conv-13',
      taskId: 'task-3',
      role: 'assistant',
      content: '正在开发前端页面...',
      structuredContent: {
        type: 'progress',
        progress: {
          current: 2,
          total: 6,
          message: '正在实现需求输入表单组件',
        },
      },
      createdAt: new Date('2024-01-18T10:30:00'),
      step: '执行开发',
    },
  ],
};

const mockReports: Record<string, any> = {};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { projectId, status } = req.query;

    let filteredTasks = mockTasks;

    if (projectId) {
      filteredTasks = filteredTasks.filter((t) => t.projectId === projectId);
    }

    if (status) {
      filteredTasks = filteredTasks.filter((t) => t.status === status);
    }

    res.json({ success: true, data: filteredTasks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = mockTasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId, title, description, createdBy } = req.body;

    const newTask = {
      id: `task-${Date.now()}`,
      projectId,
      title,
      description,
      status: 'in_progress', // 下发后直接进入进行中状态
      createdBy: createdBy || 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    };

    mockTasks.push(newTask);
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
      completedAt: updates.status === 'completed' ? new Date() : mockTasks[taskIndex].completedAt,
    };

    res.json({ success: true, data: mockTasks[taskIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    mockTasks.splice(taskIndex, 1);
    delete mockConversations[id];
    delete mockReports[id];

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
};

export const getTaskConversations = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const conversations = mockConversations[taskId] || [];

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
};

export const addConversation = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { role, content } = req.body;

    if (!mockConversations[taskId]) {
      mockConversations[taskId] = [];
    }

    const newConversation = {
      id: `conv-${Date.now()}`,
      taskId,
      role,
      content,
      createdAt: new Date(),
    };

    mockConversations[taskId].push(newConversation);
    res.status(201).json({ success: true, data: newConversation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add conversation' });
  }
};

// 获取待下发任务(从需求平台拉取的任务)
export const getPendingRequirements = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    // Mock数据:模拟从需求平台拉取的待下发任务
    const mockPendingRequirements = [
      {
        id: 'req-1',
        projectId: '1',
        title: '实现用户个人资料编辑功能',
        description: '允许用户编辑个人资料,包括头像、昵称、简介等信息',
        source: 'KeOnes',
        sourceUrl: 'https://keyones.example.com/browse/PROJ-456',
        priority: 'high',
        createdAt: new Date('2024-01-20T10:00:00'),
      },
      {
        id: 'req-2',
        projectId: '1',
        title: '添加消息通知功能',
        description: '实现站内消息通知系统,支持实时推送和历史消息查看',
        source: 'KeOnes',
        sourceUrl: 'https://keyones.example.com/browse/PROJ-457',
        priority: 'medium',
        createdAt: new Date('2024-01-20T11:00:00'),
      },
      {
        id: 'req-3',
        projectId: '2',
        title: '优化搜索功能',
        description: '提升代码编辑器的搜索性能,支持正则表达式和全局搜索',
        source: 'KeOnes',
        sourceUrl: 'https://keyones.example.com/story/view/123456',
        priority: 'high',
        createdAt: new Date('2024-01-21T09:00:00'),
      },
      {
        id: 'req-4',
        projectId: '2',
        title: '添加代码格式化快捷键',
        description: '支持一键格式化代码,支持多种语言',
        source: 'KeOnes',
        sourceUrl: 'https://keyones.example.com/story/view/123457',
        priority: 'low',
        createdAt: new Date('2024-01-21T10:00:00'),
      },
      {
        id: 'req-5',
        projectId: '3',
        title: '实现任务模板功能',
        description: '允许用户保存和复用常用的任务模板',
        source: 'KeOnes',
        sourceUrl: 'https://keyones.example.com/browse/PROJ-458',
        priority: 'medium',
        createdAt: new Date('2024-01-22T14:00:00'),
      },
      {
        id: 'req-6',
        projectId: '3',
        title: '增加任务批量操作',
        description: '支持批量修改任务状态、批量分配任务等操作',
        source: 'KeOnes',
        sourceUrl: 'https://keyones.example.com/browse/PROJ-459',
        priority: 'medium',
        createdAt: new Date('2024-01-22T15:00:00'),
      },
    ];

    let filteredRequirements = mockPendingRequirements;

    // 如果指定了项目ID,只返回该项目的待下发任务
    if (projectId) {
      filteredRequirements = filteredRequirements.filter((req) => req.projectId === projectId);
    }

    res.json({ success: true, data: filteredRequirements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pending requirements' });
  }
};

export const getTaskReport = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    // 为task-1创建详细的Mock报告
    if (taskId === 'task-1' && !mockReports[taskId]) {
      const task = mockTasks.find(t => t.id === taskId);
      mockReports[taskId] = {
        id: `report-${taskId}`,
        taskId,
        taskTitle: task?.title || '未知任务',
        requirementStatus: 'completed', // 已完成状态
        tokenConsumed: 45230,
        requirementUrl: 'https://jira.example.com/browse/PROJ-123',
        impactAnalysis: [
          {
            module: '用户认证模块',
            description: '新增登录功能会影响现有的用户认证流程，需要更新Session管理',
            severity: 'high',
            upstreamServices: ['用户中心服务', 'OAuth认证服务'],
            downstreamServices: ['权限管理服务', '用户画像服务'],
          },
          {
            module: '前端路由',
            description: '新增登录页面路由，影响未登录用户的访问控制',
            severity: 'medium',
            upstreamServices: [],
            downstreamServices: ['前端路由守卫', 'SSO单点登录'],
          },
          {
            module: '数据库用户表',
            description: '需要新增第三方登录相关字段',
            severity: 'medium',
            upstreamServices: [],
            downstreamServices: ['用户查询服务', '数据同步服务'],
          },
        ],
        createdAt: new Date('2024-01-16T11:30:00'),
        updatedAt: new Date('2024-01-16T11:30:00'),
        mergeRequests: [
          {
            id: 'mr-1',
            gitRepoName: 'moma-frontend',
            gitRepoUrl: 'https://github.com/company/moma-frontend',
            mrUrl: 'https://github.com/company/moma-frontend/pull/456',
            status: 'merged',
            createdAt: new Date('2024-01-16T11:00:00'),
          },
          {
            id: 'mr-2',
            gitRepoName: 'moma-backend',
            gitRepoUrl: 'https://github.com/company/moma-backend',
            mrUrl: 'https://github.com/company/moma-backend/pull/789',
            status: 'merged',
            createdAt: new Date('2024-01-16T11:10:00'),
          },
        ],
        codeChanges: [
          {
            id: 'change-1',
            gitRepoName: 'moma-frontend',
            filePath: 'src/pages/LoginPage.tsx',
            changeType: 'added',
            content: `import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const response = await authApi.login(values);
      localStorage.setItem('token', response.data.token);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form onFinish={handleLogin}>
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          登录
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;`,
            createdAt: new Date('2024-01-16T10:30:00'),
          },
          {
            id: 'change-2',
            gitRepoName: 'moma-frontend',
            filePath: 'src/services/auth.ts',
            changeType: 'added',
            content: `export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  loginWithGithub: (code: string) =>
    api.post('/auth/github', { code }),
  loginWithGoogle: (token: string) =>
    api.post('/auth/google', { token }),
};`,
            createdAt: new Date('2024-01-16T10:45:00'),
          },
          {
            id: 'change-3',
            gitRepoName: 'moma-backend',
            filePath: 'src/controllers/auth.controller.ts',
            changeType: 'added',
            content: `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token, user: { id: user.id, username: user.username } });
};`,
            createdAt: new Date('2024-01-16T11:00:00'),
          },
          {
            id: 'change-4',
            gitRepoName: 'moma-backend',
            filePath: 'src/middleware/auth.middleware.ts',
            changeType: 'modified',
            content: `import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token无效' });
  }
};`,
            createdAt: new Date('2024-01-16T11:05:00'),
          },
        ],
        databaseChanges: [
          {
            id: 'db-1',
            changeType: 'DDL',
            sqlScript: `-- 添加第三方登录字段
ALTER TABLE users
ADD COLUMN github_id VARCHAR(255),
ADD COLUMN google_id VARCHAR(255),
ADD COLUMN avatar_url VARCHAR(500),
ADD COLUMN provider VARCHAR(50);

-- 创建索引
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_google_id ON users(google_id);`,
            description: '为users表添加第三方登录相关字段',
            createdAt: new Date('2024-01-16T10:50:00'),
          },
          {
            id: 'db-2',
            changeType: 'DML',
            sqlScript: `-- 插入测试用户
INSERT INTO users (username, password, email, created_at)
VALUES
  ('testuser', '$2b$10$...', 'test@example.com', NOW()),
  ('admin', '$2b$10$...', 'admin@example.com', NOW());`,
            description: '插入测试用户数据',
            createdAt: new Date('2024-01-16T11:20:00'),
          },
        ],
        configChanges: [
          {
            id: 'config-1',
            configType: 'file',
            configKey: 'JWT_SECRET',
            oldValue: undefined,
            newValue: 'your-secret-key-here',
            filePath: '.env',
            createdAt: new Date('2024-01-16T10:40:00'),
          },
          {
            id: 'config-2',
            configType: 'file',
            configKey: 'GITHUB_CLIENT_ID',
            oldValue: undefined,
            newValue: 'ghp_xxxxxxxxxxxx',
            filePath: '.env',
            createdAt: new Date('2024-01-16T10:40:00'),
          },
          {
            id: 'config-3',
            configType: 'platform',
            configKey: 'session.timeout',
            oldValue: '3600',
            newValue: '7200',
            platform: 'Apollo配置中心',
            createdAt: new Date('2024-01-16T11:15:00'),
          },
        ],
      };
    }

    // 为task-2创建AI完成的Mock报告（演示待确认状态）
    if (taskId === 'task-2' && !mockReports[taskId]) {
      const task = mockTasks.find(t => t.id === taskId);
      mockReports[taskId] = {
        id: `report-${taskId}`,
        taskId,
        taskTitle: task?.title || '未知任务',
        requirementStatus: 'ai_completed', // AI完成状态
        tokenConsumed: 32500,
        requirementUrl: 'https://jira.example.com/browse/PROJ-124',
        impactAnalysis: [
          {
            module: '用户信息展示',
            description: '个人中心页面新增用户头像上传功能',
            severity: 'low',
            upstreamServices: ['文件上传服务', 'CDN服务'],
            downstreamServices: ['用户头像展示', '社交分享'],
          },
          {
            module: '文件存储',
            description: '需要集成OSS存储服务',
            severity: 'medium',
            upstreamServices: ['阿里云OSS'],
            downstreamServices: ['图片处理服务'],
          },
        ],
        createdAt: new Date('2024-01-16T14:30:00'),
        updatedAt: new Date('2024-01-16T14:30:00'),
        mergeRequests: [
          {
            id: 'mr-3',
            gitRepoName: 'moma-frontend',
            gitRepoUrl: 'https://github.com/company/moma-frontend',
            mrUrl: 'https://github.com/company/moma-frontend/pull/457',
            status: 'pending_cr',
            createdAt: new Date('2024-01-16T14:00:00'),
          },
        ],
        codeChanges: [
          {
            id: 'change-3',
            gitRepoName: 'moma-frontend',
            filePath: 'src/components/AvatarUpload.tsx',
            changeType: 'added',
            content: `import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const AvatarUpload = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/upload"
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default AvatarUpload;`,
            createdAt: new Date('2024-01-16T14:00:00'),
          },
        ],
        databaseChanges: [],
        configChanges: [
          {
            id: 'config-3',
            configType: 'platform',
            configKey: 'oss.endpoint',
            newValue: 'https://oss-cn-beijing.aliyuncs.com',
            platform: 'Apollo配置中心',
            createdAt: new Date('2024-01-16T14:15:00'),
          },
        ],
      };
    }

    // 如果报告不存在，返回404
    if (!mockReports[taskId]) {
      return res.status(404).json({
        success: false,
        error: 'Report not found. Task may not be completed yet.'
      });
    }

    res.json({ success: true, data: mockReports[taskId] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch report' });
  }
};
