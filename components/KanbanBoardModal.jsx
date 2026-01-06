'use client';

import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import Logo from './Logo';
import { handleApiError } from '../utils/errorHandler';
import './KanbanBoardModal.css';

const KanbanBoardModal = ({ isOpen, onClose, tasks, updateTask, projects, onTaskClick }) => {
  const updatingTasks = useRef(new Set());

  const columns = [
    { id: 'todo', title: 'To Do', color: '#EF4444' },
    { id: 'in-progress', title: 'In Progress', color: '#3B82F6' },
    { id: 'in-review', title: 'In Review', color: '#FBBF24' },
    { id: 'completed', title: 'Completed', color: '#10B981' }
  ];

  // Get card color - exact 5-color palette matching design
  const getCardColor = (priority, index) => {
    // Exact color palette from design: Yellow → Purple → Red → Blue → Green
    const colorPalette = [
      '#FBBF24',  // Yellow
      '#A855F7',  // Purple
      '#EF4444',  // Red
      '#3B82F6',  // Blue
      '#10B981',  // Green
    ];
    
    // Cycle through exact 5-color palette for visual variety
    return colorPalette[Math.abs(index) % colorPalette.length];
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
    
    if (!task) return;
    
    // Prevent concurrent updates to same task
    if (updatingTasks.current.has(task.id)) {
      return;
    }
    
    updatingTasks.current.add(task.id);
    
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success('Task status updated');
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message || 'Failed to update task. Please try again.');
    } finally {
      updatingTasks.current.delete(task.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="kanban-modal-overlay" onClick={onClose}>
      <div className="kanban-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="kanban-modal-header">
          <div className="kanban-modal-title-section">
            <Logo width={40} height={40} />
            <div>
              <h2 className="kanban-modal-title">Tasks</h2>
              <p className="kanban-modal-subtitle">Experience your tasks in a simple way.</p>
            </div>
          </div>
          <button className="kanban-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Kanban Board */}
        <div className="kanban-modal-board">
          {columns.map(column => (
            <div
              key={column.id}
              className="kanban-modal-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="kanban-modal-column-header" style={{ borderTopColor: column.color }}>
                <div className="kanban-modal-column-title">
                  <span>{column.title}</span>
                  <span 
                    className="kanban-modal-count-badge"
                    style={{ backgroundColor: column.color }}
                  >
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
              </div>

              <div className="kanban-modal-column-content">
                {tasks
                  .filter(task => task.status === column.id)
                  .map((task, taskIndex) => {
                    // Calculate global index across all tasks for consistent color variety
                    const globalIndex = tasks.findIndex(t => t.id === task.id);
                    return (
                      <div
                        key={task.id}
                        className="kanban-modal-task-card sticky-note"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => onTaskClick && onTaskClick(task)}
                        style={{ 
                          backgroundColor: getCardColor(task.priority, globalIndex >= 0 ? globalIndex : taskIndex)
                        }}
                      >
                        <div className="kanban-modal-thumbtack">
                          <img src="/pin.png" alt="Pin" className="thumbtack-icon" />
                        </div>
                        <div className="kanban-modal-task-content">
                          <div className="kanban-modal-task-title">
                            {task.title}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoardModal;

