// 科目类型
export type Subject = 'chinese' | 'math' | 'english' | 'science' | 'sport';
export type { Subject as SubjectType };

// 科目配置
export interface SubjectConfig {
  id: Subject;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

// 孩子
export interface Child {
  id: string;
  name: string;
  grade: number;
  avatar?: string;
  points: number;
  growthLevel: number;
  growthName: string;
  monthlyPoints: number;
}

// 任务状态
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

// 任务
export interface Task {
  id: string;
  userId: string;
  childId: string;
  subject: Subject;
  name: string;
  duration: number;
  points: number;
  status: TaskStatus;
  date: string;
  actualDuration?: number;
  summary?: string;
  createdAt: string;
}

// 重复类型
export type RepeatType = 'once' | 'daily' | 'weekday' | 'weekend' | 'custom';

// 学习统计
export interface StudyStats {
  totalDuration: number;
  completedTasks: number;
  completionRate: number;
  bestDay: {
    date: string;
    duration: number;
  } | null;
  dailyData: {
    date: string;
    planned: number;
    completed: number;
  }[];
  subjectDistribution: {
    subject: Subject;
    count: number;
    duration: number;
    percentage: number;
  }[];
  taskCompletionTypes: {
    type: 'not_started' | 'incomplete' | 'completed';
    count: number;
  }[];
}

// 成绩
export interface Grade {
  id: string;
  childId: string;
  subject: Subject;
  examType: string;
  examName: string;
  date: string;
  score: number;
  totalScore: number;
  targetScore?: number;
  evaluation: 'excellent' | 'good' | 'pass' | 'improve';
  classRank?: number;
  weakPoints: {
    knowledge: string;
    score: number;
    total: number;
  }[];
}

// 奖励
export interface Reward {
  id: string;
  name: string;
  points: number;
  icon: string;
  description?: string;
}

// 用户
export interface User {
  id: string;
  phone: string;
  username?: string;
  password?: string;
  children: Child[];
  currentChildId?: string;
}

// 导航项
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

// 菜单项
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

// 成长阶段
export interface GrowthStage {
  level: number;
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
}

// 考试类型
export interface ExamType {
  id: string;
  name: string;
}

// 评价等级
export interface EvaluationLevel {
  id: 'excellent' | 'good' | 'pass' | 'improve';
  name: string;
  color: string;
}
