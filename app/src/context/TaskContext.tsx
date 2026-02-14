import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Task, TaskStatus } from '@/types';
import { mockTasks } from '@/data/mockData';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string, actualDuration: number, summary?: string) => void;
  getTasksByDate: (childId: string, date: string) => Task[];
  getOverdueTasks: (childId: string, currentDate: string) => Task[];
  getTasksByStatus: (childId: string, date: string, status: TaskStatus) => Task[];
  getPendingTasksCount: (childId: string, date: string) => number;
  getCompletedTasksCount: (childId: string, date: string) => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// 从 localStorage 获取任务数据
const getTasksFromStorage = (): Task[] => {
  try {
    return JSON.parse(localStorage.getItem('growtree_tasks') || '[]');
  } catch {
    return [];
  }
};

// 保存任务数据到 localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem('growtree_tasks', JSON.stringify(tasks));
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // 初始化时从localStorage读取
  useEffect(() => {
    const storedTasks = getTasksFromStorage();
    if (storedTasks.length > 0) {
      setAllTasks(storedTasks);
    } else {
      setAllTasks(mockTasks);
    }
  }, []);

  // 任务变化时保存到localStorage
  useEffect(() => {
    if (allTasks.length > 0) {
      saveTasksToStorage(allTasks);
    }
  }, [allTasks]);

  // 只返回当前用户的任务
  const tasks = user ? allTasks.filter(task => task.userId === user.id) : [];

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAllTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setAllTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setAllTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const startTask = (taskId: string) => {
    setAllTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: 'in_progress' } : task
    ));
  };

  const completeTask = (taskId: string, actualDuration: number, summary?: string) => {
    setAllTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: 'completed', actualDuration, summary }
        : task
    ));
  };

  const getTasksByDate = (childId: string, date: string): Task[] => {
    return tasks.filter(task => task.childId === childId && task.date === date);
  };

  const getOverdueTasks = (childId: string, currentDate: string): Task[] => {
    return tasks.filter(
      task => task.childId === childId &&
      task.date < currentDate &&
      task.status !== 'completed'
    );
  };

  const getTasksByStatus = (childId: string, date: string, status: TaskStatus): Task[] => {
    return tasks.filter(
      task => task.childId === childId &&
      task.date === date &&
      task.status === status
    );
  };

  const getPendingTasksCount = (childId: string, date: string): number => {
    return tasks.filter(
      task => task.childId === childId &&
      task.date === date &&
      (task.status === 'pending' || task.status === 'in_progress')
    ).length;
  };

  const getCompletedTasksCount = (childId: string, date: string): number => {
    return tasks.filter(
      task => task.childId === childId &&
      task.date === date &&
      task.status === 'completed'
    ).length;
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      startTask,
      completeTask,
      getTasksByDate,
      getOverdueTasks,
      getTasksByStatus,
      getPendingTasksCount,
      getCompletedTasksCount
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
