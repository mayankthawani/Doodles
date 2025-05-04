import React from 'react';

export function TaskCard({ task }) {
  const isRecurring = task.recurringFrequency && task.recurringFrequency !== 'none';
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
      className={`p-4 mb-2 bg-card rounded-lg shadow ${isRecurring ? 'border-l-4 border-primary' : ''}`}
    >
      <h3 className="font-medium mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
      )}
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span>Due: {formatDate(task.dueDate)}</span>
        {isRecurring && (
          <div className="flex items-center gap-2 text-primary">
            <span>{task.recurringFrequency}</span>
            {task.nextOccurrence && (
              <span>Next: {formatDate(task.nextOccurrence)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}