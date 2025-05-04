"use client";
import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import RecurrenceOptions from "./RecurrenceOptions";
import RecurrencePreview from "./RecurrencePreview";

export default function CreateTaskModal({ isOpen, onClose }) {
  const { createTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date(),
    status: "todo",
    recurrence: {
      frequency: "none",
      customSettings: null
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(formData);
      onClose();
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date(),
        status: "todo",
        recurrence: {
          frequency: "none",
          customSettings: null
        }
      });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 
                     text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 
                     text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 
                     text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Due Date & Recurrence</label>
            <Calendar
              mode="single"
              selected={formData.dueDate}
              onSelect={(date) => setFormData({ ...formData, dueDate: date })}
              className="rounded-md border bg-slate-800 mb-4"
            />
            
            <div className="mt-4">
              <label className="block text-gray-400 mb-2">Recurrence</label>
              <RecurrenceOptions
                value={formData.recurrence}
                onChange={(recurrence) => setFormData({ ...formData, recurrence })}
              />
            </div>

            <div className="mt-4">
              <RecurrencePreview recurrenceSettings={formData.recurrence} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
