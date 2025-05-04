"use client";
import { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from 'lucide-react'; // Add this import at the top
import { Button } from "@/components/ui/button"; // Add this import at the top

const statusColumns = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'DONE', title: 'Done', color: 'bg-green-500' }
];

const TaskCard = ({ task }) => {
  return (
    <Card className="mb-2 cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
            {task.recurringFrequency !== 'none' && (
              <Badge variant="secondary" className="mt-1">
                {task.recurringFrequency === 'custom' ? 'Custom Recurring' : `Repeats ${task.recurringFrequency}`}
              </Badge>
            )}
          </div>
          <PriorityIndicator priority={task.priority} />
        </div>
      </CardHeader>
      {/* ...rest of the card content... */}
    </Card>
  );
};

export default function KanbanBoard() {
  const { tasks, updateTaskStatus, deleteTask } = useTaskContext(); // Add deleteTask to destructuring
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const groupedTasks = statusColumns.reduce((acc, column) => {
      // Filter tasks by status
      acc[column.id] = tasks
        .filter(task => task.status === column.id)
        .map(task => {
          // For recurring tasks, add nextOccurrence info without creating duplicates
          if (task.recurringFrequency && task.recurringFrequency !== 'none') {
            return {
              ...task,
              isRecurring: true,
              nextOccurrence: getNextOccurrence(task)
            };
          }
          return task;
        });
      return acc;
    }, {});
    setColumns(groupedTasks);
  }, [tasks]);

  // Helper function to get next occurrence
  const getNextOccurrence = (task) => {
    const today = new Date();
    const startDate = new Date(task.startDate || task.dueDate);
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;

    // Don't calculate next occurrence if before start date or after due date
    if (today < startDate || (dueDate && today > dueDate)) {
      return dueDate || startDate;
    }

    if (today >= startDate) {
      switch (task.recurringFrequency) {
        case 'daily':
          return new Date(today.setDate(today.getDate() + 1));
        case 'weekly':
          if (task.recurringCustom?.weekdays) {
            // Find next allowed weekday
            let next = new Date(today);
            do {
              next.setDate(next.getDate() + 1);
            } while (!task.recurringCustom.weekdays.includes(next.getDay()));
            return next;
          }
          return new Date(today.setDate(today.getDate() + 7));
        case 'monthly':
          return new Date(today.setMonth(today.getMonth() + 1));
        case 'custom':
          if (task.recurringCustom) {
            const { interval, unit } = task.recurringCustom;
            const next = new Date(today);
            switch (unit) {
              case 'days':
                next.setDate(next.getDate() + interval);
                break;
              case 'weeks':
                next.setDate(next.getDate() + (interval * 7));
                break;
              case 'months':
                next.setMonth(next.getMonth() + interval);
                break;
            }
            return next;
          }
      }
    }
    return task.dueDate ? new Date(task.dueDate) : null;
  };

  const handleDragStart = (e, taskId) => {
    if (taskId.includes('recurring-')) {
      e.preventDefault();
      return false;
    }
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (!taskId) return;
    setLoading(true);
    setError(null);

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      await updateTaskStatus(taskId, newStatus);
      
      // Local state update handled by TaskContext
      
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError(err.message || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await deleteTask(taskId);
      // TaskContext will automatically update the state
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map(column => (
        <div
          key={column.id}
          className={`bg-slate-800/50 rounded-lg p-4 ${loading ? 'opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{column.title}</h3>
            <Badge className={`${column.color}`}>
              {columns[column.id]?.length || 0}
            </Badge>
          </div>

          <div className="space-y-3">
            {columns[column.id]?.map(task => (
              <Card
                key={task.id}
                draggable={!task.id.includes('recurring-')}
                onDragStart={(e) => handleDragStart(e, task.id)}
                className={`p-3 bg-slate-700/50 hover:bg-slate-700 ${
                  task.id.includes('recurring-') ? 'cursor-not-allowed opacity-70' : 'cursor-move'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge 
                    className={`
                      ${task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 
                        'bg-blue-500'}
                    `}
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
