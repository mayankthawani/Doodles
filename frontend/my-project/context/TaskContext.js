"use client";
import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "all",
    status: "all"
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");
      
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      // Ensure dates are in ISO format before sending
      const formattedData = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        startDate: taskData.startDate ? new Date(taskData.startDate).toISOString() : undefined
      };

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!res.ok) throw new Error("Failed to create task");
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError("Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error("Failed to update task");
      const updatedTask = await res.json();
      
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));

      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task status');
      }

      // Update state with new task data
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      return data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");
      
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
    const matchesStatus = filters.status === "all" || task.status === filters.status;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        loading,
        error,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        refreshTasks: fetchTasks,
        updateTaskStatus
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
