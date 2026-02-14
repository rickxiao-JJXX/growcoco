import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListPlus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import CalendarStrip from '@/components/CalendarStrip';
import TaskCard from '@/components/TaskCard';
import AddPlanModal from '@/components/AddPlanModal';
import CelebrationModal from '@/components/CelebrationModal';
import EmptyState from '@/components/EmptyState';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Subject, RepeatType } from '@/types';

export default function DashboardPage() {
  const { currentChild, user } = useAuth();
  const {
    addTask,
    deleteTask,
    startTask,
    completeTask,
    updateTask,
    getTasksByDate,
    getOverdueTasks,
    getPendingTasksCount,
    getCompletedTasksCount
  } = useTasks();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  
  // 当前激活的任务ID（正在计时）
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  // 庆祝弹窗状态
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    taskId: string;
    taskName: string;
    points: number;
    actualSeconds: number;
  } | null>(null);

  // 当selectedDate变化时，设置加载状态
  useEffect(() => {
    setIsLoading(true);
    // 模拟数据加载延迟
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const todayTasks = currentChild ? getTasksByDate(currentChild.id, dateStr) : [];
  const overdueTasks = currentChild ? getOverdueTasks(currentChild.id, dateStr) : [];
  const pendingCount = currentChild ? getPendingTasksCount(currentChild.id, dateStr) : 0;
  const completedCount = currentChild ? getCompletedTasksCount(currentChild.id, dateStr) : 0;

  const displayedTasks = todayTasks.filter(task => {
    if (activeTab === 'pending') {
      return task.status === 'pending' || task.status === 'in_progress';
    }
    return task.status === 'completed';
  });

  const handleAddTask = (plan: {
    subject: Subject;
    name: string;
    duration: number;
    repeat: RepeatType;
    points: number;
  }) => {
    if (!currentChild || !user) return;

    addTask({
      userId: user.id,
      childId: currentChild.id,
      subject: plan.subject,
      name: plan.name,
      duration: plan.duration,
      points: plan.points,
      date: dateStr
    });
    toast.success('计划创建成功');
  };

  const handleStartTask = (taskId: string) => {
    // 如果已经有其他任务在计时，先停止
    if (activeTaskId && activeTaskId !== taskId) {
      toast.info('请先完成当前任务');
      return;
    }
    
    startTask(taskId);
    setActiveTaskId(taskId);
    toast.info('任务已开始，加油！');
  };

  const handleCompleteTask = (taskId: string, actualSeconds: number) => {
    const task = todayTasks.find(t => t.id === taskId);
    if (!task) return;

    // 完成任务
    completeTask(taskId, actualSeconds);
    setActiveTaskId(null);

    // 显示庆祝弹窗
    setCelebration({
      isOpen: true,
      taskId,
      taskName: task.name,
      points: task.points,
      actualSeconds
    });
  };

  const handleSaveSummary = (summary: string) => {
    if (celebration) {
      updateTask(celebration.taskId, { summary });
      toast.success('学习总结已保存');
    }
    setCelebration(null);
  };

  const handleCancelTask = () => {
    setActiveTaskId(null);
    toast.info('任务已取消');
  };

  const handleRetryTask = (taskId: string) => {
    if (activeTaskId) {
      toast.info('请先完成当前任务');
      return;
    }
    startTask(taskId);
    setActiveTaskId(taskId);
    toast.info('重新开始任务');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
    toast.success('任务已删除');
  };

  if (!currentChild) {
    return (
      <EmptyState
        title="暂无孩子信息"
        description="请先添加孩子信息"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            学习计划
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {dateStr} · {currentChild.grade}年级
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors border border-slate-700"
          >
            <ListPlus className="w-4 h-4" />
            批量添加
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加计划
          </motion.button>
        </div>
      </div>

      {/* 日历 */}
      <CalendarStrip
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 逾期任务提示 */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center"
        >
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm hover:bg-amber-500/30 transition-colors">
            <AlertCircle className="w-4 h-4" />
            逾期任务 ({overdueTasks.length})
          </button>
        </motion.div>
      )}

      {/* 任务标签 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            activeTab === 'pending' ? 'text-white' : 'text-slate-500'
          }`}
        >
          待完成
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {pendingCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            activeTab === 'completed' ? 'text-white' : 'text-slate-500'
          }`}
        >
          已完成
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'completed' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {completedCount}
          </span>
        </button>
      </div>

      {/* 任务列表 */}
      <AnimatePresence mode="popLayout">
        {displayedTasks.length > 0 ? (
          <div className="space-y-3">
            {displayedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActive={task.id === activeTaskId}
                onStart={() => handleStartTask(task.id)}
                onComplete={(seconds) => handleCompleteTask(task.id, seconds)}
                onRetry={() => handleRetryTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                onCancel={handleCancelTask}
              />
            ))}
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            <SkeletonLoader type="card" count={3} className="space-y-3" />
          </div>
        ) : (
          <EmptyState
            title={activeTab === 'pending' ? '暂无待完成任务' : '暂无已完成任务'}
            description={activeTab === 'pending' ? '今天还没有安排任务哦' : '完成任务后会显示在这里'}
            action={
              activeTab === 'pending' && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="outline"
                  className="bg-transparent border-blue-600 text-blue-400 hover:bg-blue-600/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  立即创建计划
                </Button>
              )
            }
          />
        )}
      </AnimatePresence>

      {/* 庆祝弹窗 */}
      {celebration && (
        <CelebrationModal
          isOpen={celebration.isOpen}
          onClose={() => setCelebration(null)}
          points={celebration.points}
          taskName={celebration.taskName}
          actualSeconds={celebration.actualSeconds}
          onSaveSummary={handleSaveSummary}
        />
      )}

      {/* 添加计划弹窗 */}
      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}
