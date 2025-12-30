import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import PulsingLoader from '../components/PulsingLoader';
import LoadingSpinner from '../components/LoadingSpinner';
import './TaskTracker.css';

const TaskTracker = () => {
  const { tasks, tasksLoading, addTask, updateTask, deleteTask, getTasksByProject, loadAllTasks, projects } = useApp();
  const [view, setView] = useState('board'); // 'board' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all'); // 'all' or project ID
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: 'developer',
    dueDate: '',
    tags: []
  });

  // Set default project when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Refresh all tasks when component mounts or when needed
  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  // Get filtered tasks based on project filter
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Filter by project if not 'all'
    if (filterProject !== 'all') {
      filtered = getTasksByProject(filterProject);
    }
    
    return filtered;
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: '#6b7280' },
    { id: 'in-progress', title: 'In Progress', color: '#4f46e5' },
    { id: 'in-review', title: 'In Review', color: '#f59e0b' },
    { id: 'completed', title: 'Completed', color: '#10b981' }
  ];

  // Get base filtered tasks (by project)
  const baseTasks = getFilteredTasks();
  
  // Apply search and priority filters
  const filteredTasks = (baseTasks || []).filter(task => {
    if (!task) return false;
    const title = task.title || '';
    const description = task.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleCreateTask = async () => {
    if (!newTask.title) return;
    
    if (!selectedProjectId) {
      alert('Please select a project first');
      return;
    }

    try {
      await addTask({
        ...newTask,
        project_id: selectedProjectId
      });
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: 'developer',
        dueDate: '',
        tags: []
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      const errorMessage = error?.message || 'Failed to create task. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId || t.id === parseInt(taskId));
    if (task) {
      try {
        await updateTask(task.id, { status: newStatus });
      } catch (error) {
        console.error('Failed to update task:', error);
        alert('Failed to update task. Please try again.');
      }
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} className="priority-icon high" />;
      case 'medium':
        return <Clock size={16} className="priority-icon medium" />;
      default:
        return <CheckCircle size={16} className="priority-icon low" />;
    }
  };

  return (
    <div className="task-tracker">
      <div className="tracker-header">
        <div>
          <h1>Task & Feature Tracker</h1>
          <p className="page-subtitle">Manage tasks across your projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewTaskModal(true)}>
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="tracker-controls">
        <div className="tracker-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tracker-filters">
          <div className="filter-group">
            <Filter size={18} />
            <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Filter size={18} />
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'board' ? 'active' : ''}`}
              onClick={() => setView('board')}
            >
              Board
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {tasksLoading ? (
        <PulsingLoader message="Loading tasks..." />
      ) : (
        <>
      {/* Kanban Board View */}
      {view === 'board' && (
        <div className="kanban-board">
          {columns.map(column => (
            <div
              key={column.id}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="column-header" style={{ borderTopColor: column.color }}>
                <div className="column-title">
                  <span>{column.title}</span>
                  <span className="column-count">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
              </div>

              <div className="column-content">
                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <div
                      key={task.id}
                      className="task-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <div className="task-card-header">
                        <h3>{task.title}</h3>
                        {getPriorityIcon(task.priority)}
                      </div>
                      <p className="task-card-description">{task.description}</p>
                      <div className="task-card-tags">
                        {(task.tags || []).map((tag, idx) => (
                          <span key={idx} className="task-tag">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="task-card-footer">
                        <div className="task-assignee">
                          <User size={14} />
                          <span>{task.assignee}</span>
                        </div>
                        {task.dueDate && (
                          <div className="task-due-date">
                            <Calendar size={14} />
                            <span>{task.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="task-list-view">
          <div className="task-list-header">
            <div className="list-col col-task">Task</div>
            <div className="list-col col-status">Status</div>
            <div className="list-col col-priority">Priority</div>
            <div className="list-col col-assignee">Assignee</div>
            <div className="list-col col-due">Due Date</div>
          </div>
          <div className="task-list-body">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-list-item">
                <div className="list-col col-task">
                  <div className="task-list-title">{task.title}</div>
                  <div className="task-list-desc">{task.description}</div>
                  <div className="task-list-tags">
                    {(task.tags || []).map((tag, idx) => (
                      <span key={idx} className="badge badge-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="list-col col-status">
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value })}
                    className="status-select"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
                <div className="list-col col-priority">
                  <span className={`badge badge-${
                    task.priority === 'high' ? 'danger' : 
                    task.priority === 'medium' ? 'warning' : 
                    'secondary'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="list-col col-assignee">
                  <div className="assignee-info">
                    <User size={16} />
                    <span>{task.assignee}</span>
                  </div>
                </div>
                <div className="list-col col-due">
                  {task.dueDate || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            
            <div className="input-group">
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                type="text"
                placeholder="E.g., Implement user authentication"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                placeholder="Describe the task..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="input-group">
              <label htmlFor="task-project">Project *</label>
              <select
                id="task-project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
              >
                {projects.length === 0 ? (
                  <option value="">No projects available</option>
                ) : (
                  <>
                    <option value="">Select a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="task-assignee">Assignee</label>
                <select
                  id="task-assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                >
                  <option value="developer">Developer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="devops">DevOps</option>
                  <option value="designer">Designer</option>
                  <option value="pm">Product Manager</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateTask}>
                <Plus size={18} />
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default TaskTracker;
