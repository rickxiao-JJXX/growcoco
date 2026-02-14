import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Check, MoreVertical, Clock, Pause } from 'lucide-react';
import type { Task } from '@/types';
import { SUBJECTS } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  isActive?: boolean;
  onStart: () => void;
  onComplete: (seconds: number) => void;
  onRetry: () => void;
  onDelete: () => void;
  onCancel?: () => void;
}

// 计时器组件（嵌入卡片内）
function InlineTimer({ 
  initialSeconds = 0,
  targetMinutes,
  onComplete,
  onCancel 
}: { 
  initialSeconds?: number;
  targetMinutes: number;
  onComplete: (seconds: number) => void;
  onCancel: () => void;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min((seconds / (targetMinutes * 60)) * 100, 100);

  return (
    <div className="mt-3 p-4 bg-slate-900/80 rounded-xl border border-slate-700">
      {/* 计时器显示 */}
      <div className="text-center mb-3">
        <div className="text-5xl font-mono font-bold text-blue-400">
          {formatTime(seconds)}
        </div>
        <div className="text-slate-400 text-sm mt-1">
          目标时长: {targetMinutes}分钟
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
            isRunning 
              ? 'bg-amber-600/80 hover:bg-amber-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              暂停
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              继续
            </>
          )}
        </button>
        <button
          onClick={() => onComplete(seconds)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
        >
          <Check className="w-5 h-5" />
          完成
        </button>
      </div>

      {/* 取消按钮 */}
      <button
        onClick={onCancel}
        className="w-full mt-2 py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
      >
        取消任务
      </button>
    </div>
  );
}

export default function TaskCard({
  task,
  isActive = false,
  onStart,
  onComplete,
  onRetry,
  onDelete,
  onCancel
}: TaskCardProps) {
  const subjectConfig = SUBJECTS.find(s => s.id === task.subject);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  const formatActualDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`relative bg-slate-800/60 rounded-2xl p-4 border overflow-hidden ${
        isActive ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-700/50'
      }`}
    >
      {/* 左侧科目色条 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: subjectConfig?.color || '#64748b' }}
      />

      <div className="pl-3">
        {/* 头部信息 */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* 科目标签 */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2"
              style={{
                backgroundColor: subjectConfig?.bgColor || 'rgba(100, 117, 139, 0.2)',
                color: subjectConfig?.color || '#94a3b8'
              }}
            >
              {subjectConfig?.name || '其他'}
            </div>

            {/* 任务名称 */}
            <h4 className="text-white font-medium mb-2">{task.name}</h4>

            {/* 任务信息 */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(task.duration)}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <span>+{task.points}分</span>
              </div>
              {task.status === 'pending' && (
                <span className="text-slate-500">未开始</span>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {task.status === 'pending' && !isActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Play className="w-4 h-4" />
                开始
              </motion.button>
            )}

            {task.status === 'in_progress' && !isActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Play className="w-4 h-4" />
                继续
              </motion.button>
            )}

            {task.status === 'completed' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                重试
              </motion.button>
            )}

            {/* 更多操作 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-400 hover:bg-red-600/20 cursor-pointer"
                >
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 嵌入计时器 */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InlineTimer
                targetMinutes={task.duration}
                onComplete={onComplete}
                onCancel={onCancel || (() => {})}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已完成显示实际用时 */}
        {task.status === 'completed' && task.actualDuration !== undefined && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-green-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              实际用时: {formatActualDuration(task.actualDuration)}
            </span>
            <span className="text-amber-400">+{task.points}积分</span>
            {task.summary && (
              <span className="text-slate-400">· {task.summary}</span>
            )}
          </div>
        )}

        {/* 添加学习总结按钮（已完成但未添加总结） */}
        {task.status === 'completed' && !task.summary && (
          <button className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            添加学习总结...
          </button>
        )}
      </div>
    </motion.div>
  );
}
