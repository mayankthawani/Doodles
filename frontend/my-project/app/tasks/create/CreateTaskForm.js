"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecurrenceOptions from "@/components/dashboard/RecurrenceOptions";
import RecurrencePreview from "@/components/dashboard/RecurrencePreview";

export default function CreateTaskPage() {
  const router = useRouter();
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
      router.push('/dashboard');
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create New Task</h1>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>

          {/* Form */}
          <div className="bg-slate-900 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label className="text-lg text-gray-200">Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 bg-slate-800 border-slate-700 text-white"
                  placeholder="Enter task title"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-lg text-gray-200">Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 
                           rounded-lg text-white focus:outline-none focus:ring-2 
                           focus:ring-purple-500"
                  rows={4}
                  placeholder="Enter task description"
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg text-gray-200">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="mt-2 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg text-gray-200">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="mt-2 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date & Recurrence */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg text-gray-200">Due Date</Label>
                  <div className="mt-2 bg-slate-800 rounded-lg p-4">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                      className="bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-lg text-gray-200">Recurrence</Label>
                  <div className="mt-2">
                    <RecurrenceOptions
                      value={formData.recurrence}
                      onChange={(recurrence) => setFormData({ ...formData, recurrence })}
                    />
                  </div>
                </div>
              </div>

              {/* Recurrence Preview */}
              {formData.recurrence.frequency !== "none" && (
                <div>
                  <Label className="text-lg text-gray-200">Recurrence Preview</Label>
                  <div className="mt-2 p-4 bg-slate-800 rounded-lg">
                    <RecurrencePreview recurrenceSettings={formData.recurrence} />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
