import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button, Card, Badge, Avatar } from '../../components/ui';
import { PageHeader, ContentContainer, Section } from '../../components/layout';

const PMDashboardNew = () => {
  const navigate = useNavigate();
  const { projects, tasks, documents } = useApp();

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjectsCount,
      icon: FileText,
      color: 'var(--color-primary)',
      trend: activeProjectsCount > 0 ? `${activeProjectsCount} active` : 'No active projects',
      bgColor: 'var(--color-primary-soft)'
    },
    {
      label: 'Completed Tasks',
      value: completedTasksCount,
      icon: CheckCircle,
      color: 'var(--color-success)',
      trend: completedTasksCount > 0 ? `${completedTasksCount} completed` : 'No completed tasks',
      bgColor: '#D1FAE5'
    },
    {
      label: 'Pending Approvals',
      value: 0, // TODO: Load from API when handoff system is available
      icon: AlertCircle,
      color: 'var(--color-warning)',
      trend: 'No pending',
      bgColor: '#FEF3C7'
    },
    {
      label: 'Team Members',
      value: 0, // TODO: Load from teams API
      icon: Users,
      color: '#8b5cf6',
      trend: 'No members',
      bgColor: '#EDE9FE'
    }
  ];

  const activeProjects = projects.filter(p => p.status === 'active');
  const recentTasks = tasks.slice(0, 5);

  return (
    <ContentContainer>
      <PageHeader 
        title="Product Manager Dashboard"
        subtitle="Monitor projects and team performance"
        actions={
          <Button 
            variant="primary" 
            icon={<Plus size={18} />}
            onClick={() => navigate('/prd-designer')}
          >
            New PRD
          </Button>
        }
      />

      {/* Stats Grid */}
      <Section spacing="lg">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 'var(--spacing-lg)' 
        }}>
          {stats.map((stat, index) => (
            <Card key={index} padding="lg">
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: stat.bgColor,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <stat.icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--color-text-secondary)',
                    marginBottom: '4px'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                    marginBottom: '6px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: stat.value === 0 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {stat.trend}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 'var(--spacing-lg)' 
      }}>
        {/* Active Projects */}
        <Card 
          title="Active Projects"
          actions={
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/tasks')}
            >
              View All
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {activeProjects.map(project => (
              <div key={project.id} style={{
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '4px'
                  }}>
                    {project.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Badge variant="primary">{project.status}</Badge>
                    <span style={{ 
                      fontSize: '13px', 
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users size={14} />
                      {project.team.length} members
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)'
                  }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {project.progress}%
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: 'var(--color-surface-alt)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${project.progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-primary), #7c3aed)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} />
                    Due {project.deadline}
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    View Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card 
          title="Recent Tasks"
          actions={
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/tasks')}
            >
              View All
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {recentTasks.map(task => (
              <div key={task.id} style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-base)',
                transition: 'background-color 0.2s ease'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: task.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {task.status === 'completed' ? (
                    <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <Clock size={16} style={{ color: 'var(--color-warning)' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px'
                  }}>
                    {task.title}
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    flexWrap: 'wrap'
                  }}>
                    <Badge 
                      variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                    <span style={{ 
                      fontSize: '11px', 
                      color: 'var(--color-text-muted)' 
                    }}>
                      Due {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Documents */}
      <Section spacing="lg">
        <Card 
          title="Recent Documents"
          actions={
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/documents')}
            >
              View All
            </Button>
          }
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-md)' 
          }}>
            {documents.slice(0, 3).map(doc => (
              <div key={doc.id} style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                transition: 'box-shadow 0.2s ease'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {doc.name}
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '6px'
                  }}>
                    {doc.size} • {doc.uploadedAt}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {doc.tags.map((tag, idx) => (
                      <Badge key={idx} variant="default" size="sm">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </ContentContainer>
  );
};

export default PMDashboardNew;
