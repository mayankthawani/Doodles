"use client";
import { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  ListTodo, Search, PlusCircle, CheckCircle2, Clock, 
  AlertCircle, ArrowUpRight, BarChart2 
} from "lucide-react";

export default function Dashboard() {
  const { tasks, filters, setFilters } = useTaskContext();
  
  // Calculate task statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'DONE').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'DONE').length
  };

  return (
    <div className="min-h-screen bg-[#0A0118]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <ListTodo className="h-6 w-6 text-indigo-400" />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Doodles
                </span>
              </Link>
              
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9 w-[280px] bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/tasks/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              title: 'Total Tasks',
              value: stats.total,
              icon: ListTodo,
              color: 'from-blue-500/10 to-blue-500/30',
              textColor: 'text-blue-400'
            },
            { 
              title: 'Completed',
              value: stats.completed,
              icon: CheckCircle2,
              color: 'from-green-500/10 to-green-500/30',
              textColor: 'text-green-400'
            },
            { 
              title: 'In Progress',
              value: stats.inProgress,
              icon: Clock,
              color: 'from-yellow-500/10 to-yellow-500/30',
              textColor: 'text-yellow-400'
            },
            { 
              title: 'Overdue',
              value: stats.overdue,
              icon: AlertCircle,
              color: 'from-red-500/10 to-red-500/30',
              textColor: 'text-red-400'
            }
          ].map((stat, i) => (
            <Card 
              key={i} 
              className="bg-black/20 border-white/5 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">12%</span>
                  <span className="text-gray-400">vs last week</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters & Board Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300"
            >
              <option value="all">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <Button variant="outline" className="border-white/10 hover:border-white/20">
            <BarChart2 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>

        {/* Existing Kanban Board */}
        <KanbanBoard />
      </main>
    </div>
  );
}
