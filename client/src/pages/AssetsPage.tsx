import { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
  Popconfirm,
  Table,
  Tag,
  Descriptions,
  Tabs,
  Spin,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GithubOutlined,
  FileMarkdownOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { projectApi } from '../services/api';
import type { Project, GitRepo, ProjectAssignee } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AssetsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [repos, setRepos] = useState<GitRepo[]>([]);
  const [assignees, setAssignees] = useState<ProjectAssignee[]>([]);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false);
  const [knowledgeModalOpen, setKnowledgeModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingKnowledge, setViewingKnowledge] = useState<GitRepo | null>(null);
  const [loading, setLoading] = useState(false);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeContent, setKnowledgeContent] = useState<string | null>(null);
  const [knowledgeStatus, setKnowledgeStatus] = useState<string>('not_generated');

  const [projectForm] = Form.useForm();
  const [repoForm] = Form.useForm();
  const [assigneeForm] = Form.useForm();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadRepos(selectedProject.id);
      loadAssignees(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const response = await projectApi.getAll();
      setProjects(response.data.data);
      if (response.data.data.length > 0 && !selectedProject) {
        setSelectedProject(response.data.data[0]);
      }
    } catch (error) {
      message.error('加载项目列表失败');
    }
  };

  const loadRepos = async (projectId: string) => {
    try {
      const response = await projectApi.getRepos(projectId);
      setRepos(response.data.data);
    } catch (error) {
      message.error('加载仓库列表失败');
    }
  };

  const loadAssignees = async (projectId: string) => {
    try {
      const response = await projectApi.getAssignees(projectId);
      setAssignees(response.data.data);
    } catch (error) {
      message.error('加载人员列表失败');
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    projectForm.resetFields();
    setProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    projectForm.setFieldsValue(project);
    setProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectApi.delete(id);
      message.success('项目删除成功');
      loadProjects();
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    } catch (error) {
      message.error('删除项目失败');
    }
  };

  const handleProjectSubmit = async () => {
    try {
      const values = await projectForm.validateFields();
      setLoading(true);

      if (editingProject) {
        await projectApi.update(editingProject.id, values);
        message.success('项目更新成功');
      } else {
        await projectApi.create(values);
        message.success('项目创建成功');
      }

      setProjectModalOpen(false);
      projectForm.resetFields();
      loadProjects();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepo = () => {
    repoForm.resetFields();
    setRepoModalOpen(true);
  };

  const handleRepoSubmit = async () => {
    if (!selectedProject) return;

    try {
      const values = await repoForm.validateFields();
      setLoading(true);

      await projectApi.addRepo(selectedProject.id, values);
      message.success('仓库添加成功');

      setRepoModalOpen(false);
      repoForm.resetFields();
      loadRepos(selectedProject.id);
    } catch (error) {
      message.error('添加仓库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRepo = async (repoId: string) => {
    if (!selectedProject) return;

    try {
      await projectApi.deleteRepo(selectedProject.id, repoId);
      message.success('仓库删除成功');
      loadRepos(selectedProject.id);
    } catch (error) {
      message.error('删除仓库失败');
    }
  };

  const handleAddAssignee = () => {
    assigneeForm.resetFields();
    setAssigneeModalOpen(true);
  };

  const handleAssigneeSubmit = async () => {
    if (!selectedProject) return;

    try {
      const values = await assigneeForm.validateFields();
      setLoading(true);

      await projectApi.addAssignee(selectedProject.id, values);
      message.success('人员添加成功');

      setAssigneeModalOpen(false);
      assigneeForm.resetFields();
      loadAssignees(selectedProject.id);
    } catch (error) {
      message.error('添加人员失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignee = async (assigneeId: string) => {
    if (!selectedProject) return;

    try {
      await projectApi.deleteAssignee(selectedProject.id, assigneeId);
      message.success('人员删除成功');
      loadAssignees(selectedProject.id);
    } catch (error) {
      message.error('删除人员失败');
    }
  };

  const handleGenerateKnowledge = async (repo: GitRepo) => {
    if (!selectedProject) return;

    try {
      setKnowledgeLoading(true);
      await projectApi.generateRepoKnowledge(selectedProject.id, repo.id);
      message.success('开始生成知识库，请稍候...');

      // 轮询检查生成状态
      const checkStatus = setInterval(async () => {
        const response = await projectApi.getRepoKnowledge(selectedProject.id, repo.id);
        const status = response.data.data.knowledgeStatus;

        if (status === 'generated') {
          clearInterval(checkStatus);
          setKnowledgeLoading(false);
          message.success('知识库生成成功');
          loadRepos(selectedProject.id);
        } else if (status === 'failed') {
          clearInterval(checkStatus);
          setKnowledgeLoading(false);
          message.error('知识库生成失败');
        }
      }, 2000);

      // 10秒后停止轮询
      setTimeout(() => {
        clearInterval(checkStatus);
        setKnowledgeLoading(false);
      }, 10000);
    } catch (error) {
      message.error('生成知识库失败');
      setKnowledgeLoading(false);
    }
  };

  const handleViewKnowledge = async (repo: GitRepo) => {
    if (!selectedProject) return;

    try {
      setViewingKnowledge(repo);
      setKnowledgeModalOpen(true);
      setKnowledgeLoading(true);

      const response = await projectApi.getRepoKnowledge(selectedProject.id, repo.id);
      setKnowledgeContent(response.data.data.knowledge);
      setKnowledgeStatus(response.data.data.knowledgeStatus);
    } catch (error) {
      message.error('获取知识库失败');
    } finally {
      setKnowledgeLoading(false);
    }
  };

  const repoColumns = [
    {
      title: '仓库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GitRepo) => (
        <Space>
          <GithubOutlined />
          <a href={record.url} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      render: (text: string) => text && <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'CR人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (text: string) => text && <Tag color="green">{text}</Tag>,
    },
    {
      title: '知识库',
      key: 'knowledge',
      render: (_: any, record: GitRepo) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          not_generated: { text: '未生成', color: 'default' },
          generating: { text: '生成中', color: 'processing' },
          generated: { text: '已生成', color: 'success' },
          failed: { text: '失败', color: 'error' },
        };
        const status = statusMap[record.knowledgeStatus || 'not_generated'];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: GitRepo) => (
        <Space>
          {record.knowledgeStatus === 'generated' ? (
            <Button
              type="link"
              icon={<FileMarkdownOutlined />}
              onClick={() => handleViewKnowledge(record)}
            >
              查看知识
            </Button>
          ) : (
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={() => handleGenerateKnowledge(record)}
              loading={knowledgeLoading}
            >
              生成知识
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个仓库吗？"
            onConfirm={() => handleDeleteRepo(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const assigneeColumns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      render: (text: string) => text && <Tag>{text}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: ProjectAssignee) => (
        <Popconfirm
          title="确定要删除这个人员吗？"
          onConfirm={() => handleDeleteAssignee(record.id)}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>我的资产</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProject}>
          添加项目
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <Card
          title="项目列表"
          style={{ width: 350, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
        >
          <List
            dataSource={projects}
            renderItem={(project) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  background: selectedProject?.id === project.id ? '#e6f4ff' : 'transparent',
                  padding: '12px',
                  borderRadius: 4,
                }}
                onClick={() => setSelectedProject(project)}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project);
                    }}
                  />,
                  <Popconfirm
                    title="确定要删除这个项目吗？"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{project.name}</Text>}
                  description={
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      type="secondary"
                      style={{ marginBottom: 0 }}
                    >
                      {project.description || '暂无描述'}
                    </Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title="项目详情"
          style={{ flex: 1 }}
        >
          {selectedProject ? (
            <Tabs
              items={[
                {
                  key: 'info',
                  label: '基本信息',
                  children: (
                    <Descriptions bordered column={2}>
                      <Descriptions.Item label="项目名称" span={2}>
                        {selectedProject.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="项目描述" span={2}>
                        {selectedProject.description || '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="测试环境" span={2}>
                        {selectedProject.testEnv ? (
                          <a href={selectedProject.testEnv} target="_blank" rel="noopener noreferrer">
                            {selectedProject.testEnv}
                          </a>
                        ) : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="域名" span={2}>
                        {selectedProject.domain || '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="KeyOnes四层级" span={2}>
                        {selectedProject.keyones || '-'}
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                },
                {
                  key: 'repos',
                  label: 'Git仓库',
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRepo}>
                          添加仓库
                        </Button>
                      </div>
                      <Table
                        columns={repoColumns}
                        dataSource={repos}
                        rowKey="id"
                        pagination={false}
                      />
                    </div>
                  ),
                },
                {
                  key: 'assignees',
                  label: '可下发人员',
                  children: (
                    <div>
                      <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAssignee}>
                          添加人员
                        </Button>
                      </div>
                      <Table
                        columns={assigneeColumns}
                        dataSource={assignees}
                        rowKey="id"
                        pagination={false}
                      />
                    </div>
                  ),
                },
              ]}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Text type="secondary">请选择一个项目</Text>
            </div>
          )}
        </Card>
      </div>

      {/* 项目表单 */}
      <Modal
        title={editingProject ? '编辑项目' : '添加项目'}
        open={projectModalOpen}
        onOk={handleProjectSubmit}
        onCancel={() => setProjectModalOpen(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={projectForm} layout="vertical">
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item label="项目描述" name="description">
            <TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>
          <Form.Item label="测试环境" name="testEnv">
            <Input placeholder="https://test.example.com" />
          </Form.Item>
          <Form.Item label="域名" name="domain">
            <Input placeholder="example.com" />
          </Form.Item>
          <Form.Item
            label="KeyOnes四层级"
            name="keyones"
            extra="格式：一层级/二层级/三层级/四层级"
          >
            <Input placeholder="技术效能中心/效能架构部/CodeLink/IDECodeLink" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 仓库表单 */}
      <Modal
        title="添加仓库"
        open={repoModalOpen}
        onOk={handleRepoSubmit}
        onCancel={() => setRepoModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={repoForm} layout="vertical">
          <Form.Item
            label="仓库名称"
            name="name"
            rules={[{ required: true, message: '请输入仓库名称' }]}
          >
            <Input placeholder="例如: frontend-repo" />
          </Form.Item>
          <Form.Item
            label="仓库地址"
            name="url"
            rules={[{ required: true, message: '请输入仓库地址' }]}
          >
            <Input placeholder="https://github.com/company/repo" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input placeholder="请输入仓库描述" />
          </Form.Item>
          <Form.Item label="负责人" name="owner">
            <Input placeholder="请输入负责人名称" />
          </Form.Item>
          <Form.Item label="CR人" name="reviewer">
            <Input placeholder="请输入CR人名称" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 人员表单 */}
      <Modal
        title="添加人员"
        open={assigneeModalOpen}
        onOk={handleAssigneeSubmit}
        onCancel={() => setAssigneeModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={assigneeForm} layout="vertical">
          <Form.Item
            label="人员姓名"
            name="userName"
            rules={[{ required: true, message: '请输入人员姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="邮箱" name="userEmail">
            <Input placeholder="example@company.com" />
          </Form.Item>
          <Form.Item label="职位" name="position">
            <Input placeholder="例如: 产品经理" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 知识库查看 */}
      <Modal
        title={`${viewingKnowledge?.name} - 知识库`}
        open={knowledgeModalOpen}
        onCancel={() => setKnowledgeModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setKnowledgeModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {knowledgeLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : knowledgeStatus === 'generating' ? (
          <Alert
            message="正在生成知识库"
            description="知识库正在生成中，请稍后再查看..."
            type="info"
            showIcon
          />
        ) : knowledgeContent ? (
          <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {knowledgeContent}
            </pre>
          </div>
        ) : (
          <Alert
            message="暂无知识库"
            description="该仓库尚未生成知识库"
            type="warning"
            showIcon
          />
        )}
      </Modal>
    </div>
  );
};

export default AssetsPage;
