import type { Child, Task, Grade, User, StudyStats } from '@/types';

// 模拟用户
export const mockUser: User = {
  id: 'user_1',
  phone: '13366016355',
  username: '家长',
  password: 'password123',
  children: [
    {
      id: 'child_1',
      name: 'Coco',
      grade: 1,
      points: 80,
      growthLevel: 2,
      growthName: '小芽',
      monthlyPoints: 90
    },
    {
      id: 'child_2',
      name: '蕾蕾',
      grade: 6,
      points: 120,
      growthLevel: 3,
      growthName: '幼苗',
      monthlyPoints: 150
    }
  ],
  currentChildId: 'child_1'
};

// 模拟任务
export const mockTasks: Task[] = [
  // 今日待完成任务
  {
    id: 'task_1',
    childId: 'child_1',
    subject: 'chinese',
    name: '阅读',
    duration: 20,
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:00:00Z'
  },
  {
    id: 'task_2',
    childId: 'child_1',
    subject: 'chinese',
    name: '肖老师语文课',
    duration: 145, // 2小时25分钟
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:05:00Z'
  },
  {
    id: 'task_3',
    childId: 'child_1',
    subject: 'chinese',
    name: '语文寒假作业',
    duration: 30,
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:10:00Z'
  },
  {
    id: 'task_4',
    childId: 'child_1',
    subject: 'chinese',
    name: '古诗背诵',
    duration: 15,
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:15:00Z'
  },
  {
    id: 'task_5',
    childId: 'child_1',
    subject: 'math',
    name: '数学寒假作业',
    duration: 30,
    points: 10,
    status: 'in_progress',
    date: '2026-02-09',
    actualDuration: 23,
    createdAt: '2026-02-08T10:20:00Z'
  },
  {
    id: 'task_6',
    childId: 'child_1',
    subject: 'english',
    name: '英语寒假作业',
    duration: 30,
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:25:00Z'
  },
  {
    id: 'task_7',
    childId: 'child_1',
    subject: 'english',
    name: '班级背诵打卡并上传',
    duration: 15,
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:30:00Z'
  },
  {
    id: 'task_8',
    childId: 'child_1',
    subject: 'sport',
    name: '运动',
    duration: 30,
    points: 10,
    status: 'pending',
    date: '2026-02-09',
    createdAt: '2026-02-08T10:35:00Z'
  },
  // 已完成任务
  {
    id: 'task_9',
    childId: 'child_1',
    subject: 'chinese',
    name: '课外语文',
    duration: 15,
    points: 10,
    status: 'completed',
    date: '2026-02-09',
    actualDuration: 25,
    summary: '完成了课外阅读',
    createdAt: '2026-02-08T10:40:00Z'
  },
  {
    id: 'task_10',
    childId: 'child_1',
    subject: 'math',
    name: '课外数学',
    duration: 50,
    points: 10,
    status: 'completed',
    date: '2026-02-09',
    actualDuration: 1384, // 23:04
    summary: '完成了数学练习',
    createdAt: '2026-02-08T10:45:00Z'
  },
  {
    id: 'task_11',
    childId: 'child_1',
    subject: 'english',
    name: '课外英语',
    duration: 15,
    points: 10,
    status: 'completed',
    date: '2026-02-09',
    actualDuration: 2045, // 34:05
    summary: '完成了英语听力',
    createdAt: '2026-02-08T10:50:00Z'
  },
  {
    id: 'task_12',
    childId: 'child_1',
    subject: 'english',
    name: '百词斩',
    duration: 15,
    points: 10,
    status: 'completed',
    date: '2026-02-09',
    actualDuration: 519, // 8:39
    summary: '背诵了50个单词',
    createdAt: '2026-02-08T10:55:00Z'
  },
  // 逾期任务
  {
    id: 'task_13',
    childId: 'child_1',
    subject: 'chinese',
    name: '语文练习册',
    duration: 30,
    points: 10,
    status: 'pending',
    date: '2026-02-08',
    createdAt: '2026-02-07T10:00:00Z'
  },
  {
    id: 'task_14',
    childId: 'child_1',
    subject: 'math',
    name: '数学口算',
    duration: 15,
    points: 10,
    status: 'pending',
    date: '2026-02-07',
    createdAt: '2026-02-06T10:00:00Z'
  },
  {
    id: 'task_15',
    childId: 'child_1',
    subject: 'english',
    name: '英语听力',
    duration: 20,
    points: 10,
    status: 'pending',
    date: '2026-02-06',
    createdAt: '2026-02-05T10:00:00Z'
  }
];

// 模拟成绩
export const mockGrades: Grade[] = [];

// 模拟学习统计
export const mockStudyStats: StudyStats = {
  totalDuration: 3960, // 1小时6分钟 = 66分钟 = 3960秒
  completedTasks: 4,
  completionRate: 31,
  bestDay: {
    date: '2026-02-09',
    duration: 3960
  },
  dailyData: [
    { date: '2026-02-09', planned: 66, completed: 42 }
  ],
  subjectDistribution: [
    { subject: 'chinese', count: 1, duration: 25, percentage: 1 },
    { subject: 'math', count: 1, duration: 23, percentage: 35 },
    { subject: 'english', count: 2, duration: 42, percentage: 65 },
    { subject: 'science', count: 0, duration: 0, percentage: 0 },
    { subject: 'sport', count: 0, duration: 0, percentage: 0 }
  ],
  taskCompletionTypes: [
    { type: 'not_started', count: 9 },
    { type: 'incomplete', count: 0 },
    { type: 'completed', count: 4 }
  ]
};

// 获取今日任务
export const getTodayTasks = (childId: string, date: string): Task[] => {
  return mockTasks.filter(task => task.childId === childId && task.date === date);
};

// 获取逾期任务
export const getOverdueTasks = (childId: string, currentDate: string): Task[] => {
  return mockTasks.filter(
    task => task.childId === childId && 
    task.date < currentDate && 
    task.status !== 'completed'
  );
};

// 获取孩子信息
export const getChildById = (childId: string): Child | undefined => {
  return mockUser.children.find(child => child.id === childId);
};

// 获取当前孩子
export const getCurrentChild = (): Child | undefined => {
  return mockUser.children.find(child => child.id === mockUser.currentChildId);
};
