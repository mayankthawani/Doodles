import { PrismaClient } from '@prisma/client';
import { getNextOccurrences } from '../utils/recurrence.js';

const prisma = new PrismaClient();

const validateRecurrence = (task) => {
  if (!task.recurringFrequency || task.recurringFrequency === 'none') {
    return { ...task, recurringCustom: null };
  }

  if (!task.dueDate) {
    throw new Error('Due date is required for recurring tasks');
  }

  if (task.recurringFrequency === 'custom' && !task.recurringCustom) {
    throw new Error('Custom recurrence settings are required for custom frequency');
  }

  // Ensure start date exists
  task.recurringCustom = {
    ...task.recurringCustom,
    startDate: task.recurringCustom?.startDate || task.dueDate
  };

  return task;
};

const validateTaskDates = (startDate, dueDate) => {
  const start = new Date(startDate);
  const end = dueDate ? new Date(dueDate) : null;

  if (end && start > end) {
    throw new Error('Start date must be before due date');
  }

  return { start, end };
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, startDate, dueDate, priority, recurringFrequency, recurringCustom } = req.body;

    // Validate priority
    if (!priority || !['low', 'medium', 'high'].includes(priority)) {
      throw new Error('Valid priority (low/medium/high) is required');
    }

    // Ensure dates are properly parsed and formatted as ISO strings
    const formattedStartDate = startDate ? new Date(startDate).toISOString() : null;
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

    // Format recurring custom dates if they exist
    const formattedRecurringCustom = recurringCustom ? {
      ...recurringCustom,
      startDate: recurringCustom.startDate ? new Date(recurringCustom.startDate).toISOString() : formattedStartDate,
      endDate: recurringCustom.endDate ? new Date(recurringCustom.endDate).toISOString() : formattedDueDate
    } : null;

    // Create the task with formatted dates and explicit priority
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority.toLowerCase(), // Ensure consistent casing
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        recurringFrequency: recurringFrequency || 'none',
        recurringCustom: formattedRecurringCustom,
        userId: req.user.id,
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id }
    });
    
    const tasksWithOccurrences = tasks.map(task => ({
      ...task,
      nextOccurrences: getNextOccurrences(task)
    }));
    
    res.json(tasksWithOccurrences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      ...task,
      nextOccurrences: getNextOccurrences(task)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { startDate, dueDate, recurringCustom, ...otherData } = req.body;

    // Format the dates
    const formattedData = {
      ...otherData,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    // Format recurring custom dates if they exist
    if (recurringCustom) {
      formattedData.recurringCustom = {
        ...recurringCustom,
        startDate: recurringCustom.startDate ? new Date(recurringCustom.startDate).toISOString() : formattedData.startDate,
        endDate: recurringCustom.endDate ? new Date(recurringCustom.endDate).toISOString() : formattedData.dueDate
      };
    }

    // First check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Then update the task with formatted dates
    const updatedTask = await prisma.task.update({
      where: {
        id: req.params.id
      },
      data: formattedData
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!task.count) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getKanbanTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    // Process tasks to include virtual instances for recurring tasks
    const processedTasks = tasks.map(task => {
      if (task.recurringFrequency && task.recurringFrequency !== 'none') {
        const nextOccurrences = getNextOccurrences(task);
        return {
          ...task,
          nextOccurrences
        };
      }
      return task;
    });

    const groupedTasks = {
      TODO: processedTasks.filter(task => task.status === 'TODO'),
      IN_PROGRESS: processedTasks.filter(task => task.status === 'IN_PROGRESS'),
      DONE: processedTasks.filter(task => task.status === 'DONE')
    };

    res.json(groupedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await prisma.task.update({
      where: { 
        id,
        userId: req.user.id 
      },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};
