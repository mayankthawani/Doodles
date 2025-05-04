"use client";
import { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useTaskContext } from '@/context/TaskContext';

export function TaskCalendar() {
  const { tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasksForDate = useMemo(() => {
    if (!selectedDate || !Array.isArray(tasks)) return [];

    const currentDate = new Date(selectedDate);
    currentDate.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (!task.startDate || !task.dueDate) return false;

      const startDate = new Date(task.startDate);
      const dueDate = new Date(task.dueDate);
      startDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      // For non-recurring tasks
      if (!task.recurringFrequency || task.recurringFrequency === 'none') {
        return currentDate.getTime() === dueDate.getTime();
      }

      // Check date range (inclusive)
      if (currentDate < startDate || currentDate > dueDate) {
        return false;
      }

      // Handle recurring tasks
      const daysSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
      
      switch (task.recurringFrequency) {
        case 'daily':
          return daysSinceStart >= 0;
        case 'weekly':
          return daysSinceStart >= 0 && daysSinceStart % 7 === 0;
        case 'monthly':
          return currentDate.getDate() === startDate.getDate();
        case 'custom':
          if (!task.recurringCustom?.interval) return false;
          const { interval, unit } = task.recurringCustom;
          switch (unit) {
            case 'days':
              return daysSinceStart >= 0 && daysSinceStart % interval === 0;
            case 'weeks':
              return daysSinceStart >= 0 && daysSinceStart % (interval * 7) === 0;
            case 'months':
              if (daysSinceStart < 0) return false;
              const monthDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12
                + currentDate.getMonth() - startDate.getMonth();
              return monthDiff % interval === 0 && currentDate.getDate() === startDate.getDate();
            default:
              return false;
          }
        default:
          return false;
      }
    });
  }, [tasks, selectedDate]);

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        modifiers={{
          hasTask: (date) => {
            const dateStr = date.toDateString();
            return tasksForDate.some(task => {
              if (task.recurringFrequency && task.recurringFrequency !== 'none') {
                // For recurring tasks, check if it falls within the pattern
                return tasksForDate.some(t => t.id === task.id);
              }
              return task.dueDate && new Date(task.dueDate).toDateString() === dateStr;
            });
          }
        }}
        modifiersStyles={{
          hasTask: { backgroundColor: 'var(--primary)', color: 'white' }
        }}
      />

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Tasks for {selectedDate.toLocaleDateString()}</h3>
        <div className="space-y-2">
          {tasksForDate.map(task => (
            <div key={task.id} className="p-3 bg-card rounded-lg shadow">
              <h4 className="font-medium">{task.title}</h4>
              {task.recurringFrequency !== 'none' && (
                <span className="text-xs text-muted-foreground">
                  Recurring: {task.recurringFrequency}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
