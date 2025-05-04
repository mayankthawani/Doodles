"use client";
import { useTaskContext } from "@/context/TaskContext";

export default function SearchPanel() {
  const { filters, setFilters } = useTaskContext();

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg 
                   text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <select
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="all">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
