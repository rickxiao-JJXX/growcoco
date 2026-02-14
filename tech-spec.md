# GrowTree 成长树 - 技术规格文档

## 1. 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **状态管理**: React Context + useState/useReducer
- **路由**: React Router DOM
- **动画**: Framer Motion
- **图表**: Recharts
- **图标**: Lucide React
- **日期处理**: date-fns

## 2. 组件清单

### shadcn/ui 组件 (预装)
- Button - 按钮
- Card - 卡片
- Input - 输入框
- Label - 标签
- Select - 下拉选择
- Dialog - 弹窗
- Sheet - 侧边栏
- Tabs - 标签页
- Progress - 进度条
- Slider - 滑块
- Switch - 开关
- Checkbox - 复选框
- RadioGroup - 单选组
- Calendar - 日历
- Popover - 气泡卡片
- DropdownMenu - 下拉菜单
- Toast - 消息提示
- Skeleton - 骨架屏
- Separator - 分隔线
- Badge - 徽章
- Avatar - 头像

### 自定义组件

#### 布局组件
| 组件名 | 用途 | 位置 |
|--------|------|------|
| MobileLayout | 移动端主布局 | components/layout/MobileLayout.tsx |
| BottomNav | 底部导航栏 | components/layout/BottomNav.tsx |
| TopHeader | 顶部头部 | components/layout/TopHeader.tsx |
| SideMenu | 侧边菜单 | components/layout/SideMenu.tsx |

#### 页面组件
| 组件名 | 用途 | 位置 |
|--------|------|------|
| LoginPage | 登录页面 | pages/LoginPage.tsx |
| DashboardPage | 学习计划主页 | pages/DashboardPage.tsx |
| StatisticsPage | 学习统计 | pages/StatisticsPage.tsx |
| GradesPage | 成绩档案 | pages/GradesPage.tsx |
| ForestPage | 成长森林 | pages/ForestPage.tsx |

#### 功能组件
| 组件名 | 用途 | 位置 |
|--------|------|------|
| TaskCard | 任务卡片 | components/TaskCard.tsx |
| TaskList | 任务列表 | components/TaskList.tsx |
| CalendarStrip | 周历条 | components/CalendarStrip.tsx |
| AddPlanModal | 添加计划弹窗 | components/AddPlanModal.tsx |
| StatsSummary | 统计摘要 | components/StatsSummary.tsx |
| StudyChart | 学习趋势图 | components/StudyChart.tsx |
| SubjectDistribution | 科目分布图 | components/SubjectDistribution.tsx |
| GrowthTree | 成长树展示 | components/GrowthTree.tsx |
| PointsDisplay | 积分显示 | components/PointsDisplay.tsx |
| ChildSelector | 孩子选择器 | components/ChildSelector.tsx |
| AddChildModal | 添加孩子弹窗 | components/AddChildModal.tsx |
| GradeEntryModal | 录入成绩弹窗 | components/GradeEntryModal.tsx |

#### 通用组件
| 组件名 | 用途 | 位置 |
|--------|------|------|
| SubjectIcon | 科目标签图标 | components/SubjectIcon.tsx |
| LoadingSpinner | 加载动画 | components/LoadingSpinner.tsx |
| EmptyState | 空状态 | components/EmptyState.tsx |
| AnimatedNumber | 数字动画 | components/AnimatedNumber.tsx |

## 3. 动画实现方案

| 动画效果 | 实现库 | 实现方式 | 复杂度 |
|----------|--------|----------|--------|
| 页面过渡 | Framer Motion | AnimatePresence + motion.div | 中 |
| 按钮hover | Tailwind + FM | whileHover, whileTap | 低 |
| 卡片hover | Framer Motion | whileHover={{ y: -2 }} | 低 |
| 弹窗动画 | Framer Motion | initial/animate/exit | 中 |
| 列表stagger | Framer Motion | staggerChildren | 中 |
| 进度条 | Framer Motion | animate width | 低 |
| 数字滚动 | Framer Motion | useSpring + useMotionValue | 中 |
| 图表动画 | Recharts | animationDuration + animationBegin | 低 |
| 加载旋转 | CSS/Tailwind | animate-spin | 低 |
| 抖动动画 | Framer Motion | animate x with keyframes | 低 |
| 滑入滑出 | Framer Motion | translateY with AnimatePresence | 中 |

### 动画时序规范
```typescript
const animationConfig = {
  // 快速反馈
  fast: { duration: 0.15, ease: "easeOut" },
  
  // 标准交互
  normal: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  
  // 页面过渡
  pageTransition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  
  // 列表动画
  stagger: { staggerChildren: 0.05 },
  
  // 图表动画
  chart: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  
  // 数字动画
  number: { duration: 0.6, ease: "easeOut" }
};
```

## 4. 项目结构

```
/mnt/okcomputer/output/app/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MobileLayout.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── TopHeader.tsx
│   │   │   └── SideMenu.tsx
│   │   ├── ui/           # shadcn/ui 组件
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── CalendarStrip.tsx
│   │   ├── AddPlanModal.tsx
│   │   ├── StatsSummary.tsx
│   │   ├── StudyChart.tsx
│   │   ├── SubjectDistribution.tsx
│   │   ├── GrowthTree.tsx
│   │   ├── PointsDisplay.tsx
│   │   ├── ChildSelector.tsx
│   │   ├── AddChildModal.tsx
│   │   ├── GradeEntryModal.tsx
│   │   ├── SubjectIcon.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── AnimatedNumber.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── StatisticsPage.tsx
│   │   ├── GradesPage.tsx
│   │   └── ForestPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useStats.ts
│   │   ├── useChildren.ts
│   │   └── useLocalStorage.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── TaskContext.tsx
│   │   └── ChildContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 5. 类型定义

```typescript
// types/index.ts

export interface Child {
  id: string;
  name: string;
  grade: number;
  avatar?: string;
  points: number;
  growthLevel: number;
}

export interface Task {
  id: string;
  childId: string;
  subject: Subject;
  name: string;
  duration: number; // 分钟
  points: number;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  actualDuration?: number;
  summary?: string;
}

export type Subject = 'chinese' | 'math' | 'english' | 'science' | 'sport';

export interface StudyStats {
  totalDuration: number;
  completedTasks: number;
  completionRate: number;
  bestDay: {
    date: string;
    duration: number;
  };
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
}

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

export interface Reward {
  id: string;
  name: string;
  points: number;
  icon: string;
  description?: string;
}

export interface User {
  id: string;
  phone: string;
  username?: string;
  children: Child[];
  currentChildId?: string;
}
```

## 6. 路由设计

```typescript
// 路由配置
const routes = [
  { path: '/login', element: <LoginPage /> },
  { 
    path: '/', 
    element: <ProtectedRoute><MobileLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/statistics', element: <StatisticsPage /> },
      { path: '/grades', element: <GradesPage /> },
      { path: '/forest', element: <ForestPage /> },
    ]
  }
];
```

## 7. 状态管理

### AuthContext
- user: User | null
- isAuthenticated: boolean
- login(phone, password): Promise<void>
- logout(): void

### ChildContext
- children: Child[]
- currentChild: Child | null
- addChild(child): void
- selectChild(childId): void
- updatePoints(childId, points): void

### TaskContext
- tasks: Task[]
- todayTasks: Task[]
- overdueTasks: Task[]
- addTask(task): void
- updateTask(taskId, updates): void
- deleteTask(taskId): void
- startTask(taskId): void
- completeTask(taskId, actualDuration): void

## 8. 本地存储方案

使用 localStorage 持久化数据:
- `growtree_user`: 用户信息
- `growtree_children`: 孩子列表
- `growtree_tasks`: 任务列表
- `growtree_grades`: 成绩记录
- `growtree_current_child`: 当前选中的孩子ID

## 9. 图表配置

### Recharts 主题配置
```typescript
const chartTheme = {
  backgroundColor: 'transparent',
  textColor: '#94a3b8',
  gridColor: '#243552',
  colors: {
    chinese: '#3b82f6',
    math: '#22c55e',
    english: '#f59e0b',
    science: '#a855f7',
    sport: '#ef4444',
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b'
  }
};
```

## 10. 响应式断点

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}
```

## 11. 性能优化

- 使用 React.memo 优化组件渲染
- 使用 useMemo/useCallback 缓存计算和回调
- 图片懒加载
- 组件懒加载 (React.lazy + Suspense)
- 虚拟列表 (如任务列表过长)

## 12. 开发顺序

1. 项目初始化 + 配置
2. 类型定义 + Mock数据
3. 登录页面
4. 主布局 (MobileLayout + BottomNav)
5. 学习计划页面 (Dashboard)
6. 添加计划弹窗
7. 学习统计页面 (Statistics + Charts)
8. 成绩档案页面 (Grades)
9. 成长森林页面 (Forest)
10. 多孩子管理功能
11. 数据导入导出功能
12. 动画优化
13. 测试 + 构建 + 部署
