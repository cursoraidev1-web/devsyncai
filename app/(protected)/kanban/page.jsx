'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Plus, Search, Filter, LayoutGrid } from 'lucide-react';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../utils/errorHandler';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../../styles/pages/TaskTracker.css';

const columns = [
    { id: 'todo', title: 'To Do', color: '#EF4444' },
    { id: 'in-progress', title: 'In Progress', color: '#3B82F6' },
    { id: 'in-review', title: 'In Review', color: '#F59E0B' },
    { id: 'completed', title: 'Completed', color: '#10B981' },
];

const KanbanPage = () => {
    const router = useRouter();
    const { tasks, tasksLoading, updateTask, loadAllTasks, projects, addTask } = useApp();
    const updatingTasks = useRef(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProject, setFilterProject] = useState('all');
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [creatingTask, setCreatingTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee_id: '',
        dueDate: '',
        tags: [],
    });

    useEffect(() => {
        loadAllTasks();
    }, [loadAllTasks]);

    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0].id);
        }
    }, [projects, selectedProjectId]);

    const filteredTasks = tasks.filter(task => {
        if (!task) return false;
        const matchesSearch =
            (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProject = filterProject === 'all' || task.project_id === filterProject;
        return matchesSearch && matchesProject;
    });

    const getTasksByStatus = (status) =>
        filteredTasks.filter(t => (t.status || 'todo') === status);

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('taskId');
        const task = tasks.find(t => String(t.id) === String(taskId));
        if (!task || task.status === newStatus) return;
        if (updatingTasks.current.has(task.id)) return;
        updatingTasks.current.add(task.id);
        try {
            await updateTask(task.id, { status: newStatus });
            toast.success('Task moved');
        } catch (error) {
            const errorInfo = handleApiError(error);
            toast.error(errorInfo.message || 'Failed to update task');
        } finally {
            updatingTasks.current.delete(task.id);
        }
    };

    const handleCreateTask = async () => {
        if (creatingTask) return;
        if (!newTask.title.trim()) {
            toast.error('Task title is required');
            return;
        }
        if (!selectedProjectId) {
            toast.error('Please select a project');
            return;
        }
        setCreatingTask(true);
        try {
            await addTask({ ...newTask, project_id: selectedProjectId });
            toast.success('Task created successfully');
            setShowNewTaskModal(false);
            setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', assignee_id: '', dueDate: '', tags: [] });
        } catch (error) {
            const errorInfo = handleApiError(error);
            toast.error(errorInfo.message || 'Failed to create task');
        } finally {
            setCreatingTask(false);
        }
    };

    const getPriorityColor = (priority) => {
        if (priority === 'high' || priority === 'urgent') return '#EF4444';
        if (priority === 'medium') return '#F59E0B';
        return '#10B981';
    };

    return (
        <div className="task-tracker">
            {/* Header */}
            <div className="board-header">
                <div className="board-title-section">
                    <div className="board-icon">
                        <LayoutGrid size={20} />
                    </div>
                    <div>
                        <h1 className="board-title">Kanban Board</h1>
                        <p className="board-subtitle">Drag and drop tasks between columns</p>
                    </div>
                </div>
                <button
                    className="btn btn-primary new-task-header-btn"
                    onClick={() => {
                        if (projects.length === 0) {
                            toast.error('Please create a project first');
                            router.push('/projects');
                            return;
                        }
                        setShowNewTaskModal(true);
                    }}
                >
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
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Board */}
            {tasksLoading ? (
                <PulsingLoader message="Loading tasks..." />
            ) : (
                <div className="kanban-board" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', minHeight: '600px' }}>
                    {columns.map(column => {
                        const columnTasks = getTasksByStatus(column.id);
                        return (
                            <div
                                key={column.id}
                                className="kanban-column"
                                style={{ minWidth: '280px', flex: '1', background: 'var(--bg-secondary, #f9fafb)', borderRadius: '12px', padding: '16px' }}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, column.id)}
                            >
                                {/* Column Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: column.color }} />
                                    <h3 style={{ fontWeight: '600', fontSize: '14px', margin: 0 }}>{column.title}</h3>
                                    <span style={{ marginLeft: 'auto', background: column.color + '20', color: column.color, borderRadius: '999px', padding: '2px 8px', fontSize: '12px', fontWeight: '600' }}>
                                        {columnTasks.length}
                                    </span>
                                </div>

                                {/* Tasks */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {columnTasks.map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                            style={{
                                                background: 'var(--bg-primary, #fff)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                                cursor: 'grab',
                                                borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                                                userSelect: 'none',
                                            }}
                                        >
                                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', color: 'var(--text-primary, #1a1f36)' }}>
                                                {task.title}
                                            </div>
                                            {task.description && (
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary, #718096)', margin: '0 0 8px', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {task.description}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: getPriorityColor(task.priority) }}>
                                                    {task.priority}
                                                </span>
                                                {task.dueDate && task.dueDate !== 'No due date' && (
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary, #718096)', marginLeft: 'auto' }}>
                                                        {task.dueDate}
                                                    </span>
                                                )}
                                            </div>
                                            {(task.tags || []).length > 0 && (
                                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                                                    {task.tags.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} style={{ fontSize: '10px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', padding: '1px 6px' }}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {columnTasks.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary, #9ca3af)', fontSize: '13px', border: '2px dashed var(--border-color, #e5e7eb)', borderRadius: '8px' }}>
                                            Drop tasks here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* New Task Modal */}
            {showNewTaskModal && (
                <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Task</h2>
                        <div className="modal-body">
                            <div className="input-group">
                                <label htmlFor="kanban-task-title">Task Title *</label>
                                <input
                                    id="kanban-task-title"
                                    type="text"
                                    placeholder="E.g., Implement user authentication"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    maxLength={200}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="kanban-task-desc">Description</label>
                                <textarea
                                    id="kanban-task-desc"
                                    placeholder="Describe the task..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="kanban-task-project">Project *</label>
                                <select
                                    id="kanban-task-project"
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a project...</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label htmlFor="kanban-task-status">Status</label>
                                    <select
                                        id="kanban-task-status"
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                    >
                                        {columns.map(col => (
                                            <option key={col.id} value={col.id}>{col.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="kanban-task-priority">Priority</label>
                                    <select
                                        id="kanban-task-priority"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="kanban-task-due">Due Date</label>
                                <input
                                    id="kanban-task-due"
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowNewTaskModal(false)}
                                disabled={creatingTask}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateTask}
                                disabled={creatingTask || !newTask.title.trim() || !selectedProjectId}
                            >
                                {creatingTask ? 'Creating...' : (
                                    <><Plus size={16} /> Create Task</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanPage;
