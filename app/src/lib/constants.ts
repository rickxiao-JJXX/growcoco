import type { SubjectConfig, ExamType, EvaluationLevel, GrowthStage, NavItem, MenuItem } from '@/types';

// 科目配置
export const SUBJECTS: SubjectConfig[] = [
  {
    id: 'chinese',
    name: '语文',
    icon: 'BookOpen',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.2)'
  },
  {
    id: 'math',
    name: '数学',
    icon: 'Calculator',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.2)'
  },
  {
    id: 'english',
    name: '英语',
    icon: 'Languages',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.2)'
  },
  {
    id: 'science',
    name: '科学',
    icon: 'FlaskConical',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.2)'
  },
  {
    id: 'sport',
    name: '运动',
    icon: 'Dumbbell',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.2)'
  }
];

// 年级列表
export const GRADES = [
  { value: 1, label: '1年级' },
  { value: 2, label: '2年级' },
  { value: 3, label: '3年级' },
  { value: 4, label: '4年级' },
  { value: 5, label: '5年级' },
  { value: 6, label: '6年级' },
  { value: 7, label: '7年级' },
  { value: 8, label: '8年级' },
  { value: 9, label: '9年级' },
  { value: 10, label: '10年级' },
  { value: 11, label: '11年级' },
  { value: 12, label: '12年级' }
];

// 考试类型
export const EXAM_TYPES: ExamType[] = [
  { id: 'quiz', name: '随堂测' },
  { id: 'unit', name: '单元测' },
  { id: 'monthly', name: '月考' },
  { id: 'midterm', name: '期中' },
  { id: 'final', name: '期末' },
  { id: 'mock', name: '模拟考' },
  { id: 'other', name: '其他' }
];

// 评价等级
export const EVALUATION_LEVELS: EvaluationLevel[] = [
  { id: 'excellent', name: '优秀', color: '#22c55e' },
  { id: 'good', name: '良好', color: '#3b82f6' },
  { id: 'pass', name: '及格', color: '#f59e0b' },
  { id: 'improve', name: '待提高', color: '#ef4444' }
];

// 成长阶段
export const GROWTH_STAGES: GrowthStage[] = [
  { level: 1, name: '种子', description: '播下希望的种子', minPoints: 0, maxPoints: 30, icon: 'seed' },
  { level: 2, name: '小芽', description: '破土而出，开始成长', minPoints: 30, maxPoints: 100, icon: 'sprout' },
  { level: 3, name: '幼苗', description: '茁壮成长，充满活力', minPoints: 100, maxPoints: 200, icon: 'seedling' },
  { level: 4, name: '小树', description: '枝繁叶茂，日渐茁壮', minPoints: 200, maxPoints: 350, icon: 'tree' },
  { level: 5, name: '大树', description: '参天大树，硕果累累', minPoints: 350, maxPoints: 500, icon: 'bigtree' },
  { level: 6, name: '森林', description: '郁郁葱葱，生机盎然', minPoints: 500, maxPoints: 999999, icon: 'forest' }
];

// 底部导航
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '打卡', icon: 'Home', path: '/' },
  { id: 'sync', label: '数据同步', icon: 'RefreshCw', path: '/sync' },
  { id: 'export', label: '导出数据', icon: 'Download', path: '/export' },
  { id: 'import', label: '导入数据', icon: 'Upload', path: '/import' }
];

// 侧边菜单
export const SIDE_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: '每日打卡', icon: 'CheckCircle', path: '/' },
  { id: 'statistics', label: '学习统计', icon: 'BarChart3', path: '/statistics' },
  { id: 'grades', label: '成绩档案', icon: 'TrendingUp', path: '/grades' },
  { id: 'forest', label: '成长森林', icon: 'TreePine', path: '/forest' },
  {
    id: 'templates',
    label: '模板管理',
    icon: 'LayoutGrid',
    children: [
      { id: 'chinese', label: '语文', icon: 'BookOpen' },
      { id: 'math', label: '数学', icon: 'Calculator' },
      { id: 'english', label: '英语', icon: 'Languages' },
      { id: 'science', label: '科学', icon: 'FlaskConical' }
    ]
  }
];

// 时长选项
export const DURATION_OPTIONS = [
  { value: 15, label: '15分钟' },
  { value: 30, label: '30分钟' },
  { value: 45, label: '45分钟' },
  { value: 60, label: '1小时' },
  { value: 90, label: '1小时30分钟' },
  { value: 120, label: '2小时' }
];

// 重复选项
export const REPEAT_OPTIONS = [
  { value: 'once', label: '仅一次', icon: '1' },
  { value: 'daily', label: '每天', icon: '15' },
  { value: 'weekday', label: '工作日', icon: 'briefcase' },
  { value: 'weekend', label: '周末', icon: 'party' },
  { value: 'custom', label: '自定义', icon: 'settings' }
];

// 颜色配置
export const COLORS = {
  // 背景
  bgPrimary: '#0a1628',
  bgSecondary: '#1a2744',
  bgTertiary: '#243552',
  
  // 主色
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  secondary: '#22c55e',
  accent: '#f59e0b',
  
  // 文字
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textLink: '#60a5fa',
  
  // 功能色
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // 科目色
  chinese: '#3b82f6',
  math: '#22c55e',
  english: '#f59e0b',
  science: '#a855f7',
  sport: '#ef4444'
};

// 动画配置
export const ANIMATION = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  pageTransition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  stagger: { staggerChildren: 0.05 },
  chart: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  number: { duration: 0.6, ease: 'easeOut' }
};
