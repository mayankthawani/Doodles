"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskContext } from '@/context/TaskContext';
import RecurrenceOptions from '@/components/dashboard/RecurrenceOptions';

export default function CreateTask() {
  const router = useRouter();
  const { createTask } = useTaskContext();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium", // Set default but require user selection
    startDate: "",
    dueDate: "",
    status: "TODO",
    recurringFrequency: "none",
    recurringCustom: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title) {
        alert("Title is required");
        return;
      }
      if (!formData.priority) {
        alert("Priority is required");
        return;
      }
      if (!formData.startDate || !formData.dueDate) {
        alert("Start date and due date are required");
        return;
      }

      const taskData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        recurringCustom: formData.recurringFrequency === 'none' ? null : {
          ...formData.recurringCustom,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.dueDate).toISOString()
        }
      };

      await createTask(taskData);
      router.push('/dashboard');
    } catch (err) {
      console.error("Failed to create task:", err);
      alert(err.message || "Failed to create task. Please try again.");
    }
  };

  const handleRecurrenceChange = (recurrence) => {
    console.log('Recurrence changed:', recurrence); // Debug log
    setFormData(prev => ({
      ...prev,
      recurringFrequency: recurrence.frequency,
      recurringCustom: recurrence.frequency === 'custom' ? {
        ...recurrence.customSettings,
        // Ensure proper date handling
        startDate: recurrence.customSettings?.startDate || new Date(),
        endDate: recurrence.customSettings?.endDate || null
      } : null
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Recurrence</label>
          <RecurrenceOptions
            value={{
              frequency: formData.recurringFrequency,
              customSettings: formData.recurringCustom
            }}
            onChange={handleRecurrenceChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </div>
  );
}
