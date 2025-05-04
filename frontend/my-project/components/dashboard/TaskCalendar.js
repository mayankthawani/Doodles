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
      
      // Reset time components for accurate comparison
      startDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      // For non-recurring tasks, show only on due date
      if (!task.recurringFrequency || task.recurringFrequency === 'none') {
        return currentDate.getTime() === dueDate.getTime();
      }

      // Check if current date is within range (inclusive)
      if (currentDate.getTime() < startDate.getTime() || 
          currentDate.getTime() > dueDate.getTime()) {
        return false;
      }

      // For recurring tasks, check pattern starting from start date
      const daysSinceStart = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (task.recurringFrequency) {
        case 'daily':
          return daysSinceStart >= 0;
        case 'weekly':
          return daysSinceStart >= 0 && daysSinceStart % 7 === 0;
        case 'monthly':
          return daysSinceStart >= 0 && currentDate.getDate() === startDate.getDate();
        case 'custom':
          if (!task.recurringCustom?.interval) return false;
          const { interval, unit } = task.recurringCustom;
          
          if (daysSinceStart < 0) return false;
          
          switch (unit) {
            case 'days':
              return daysSinceStart % interval === 0;
            case 'weeks':
              return daysSinceStart % (interval * 7) === 0;
            case 'months':
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
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-lg border bg-slate-800/50 p-4"
        />
      </div>
      <div className="col-span-2 bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Tasks for {selectedDate.toLocaleDateString()}
        </h3>
        <div className="space-y-4">
          {tasksForDate.length === 0 ? (
            <p className="text-gray-400">No tasks scheduled for this date.</p>
          ) : (
            tasksForDate.map(task => (
              <div 
                key={task.id}
                className="bg-slate-700 p-4 rounded-lg"
              >
                <h4 className="text-white font-medium">{task.title}</h4>
                <p className="text-gray-400 mt-1">{task.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Status: {task.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCalendar;
