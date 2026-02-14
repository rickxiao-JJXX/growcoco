import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, TrendingUp, Award, Clock, BarChart3 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SUBJECTS } from '@/lib/constants';
import EmptyState from '@/components/EmptyState';

export default function StatisticsPage() {
  const { currentChild } = useAuth();
  const { tasks } = useTasks();

  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // 计算统计数据
  const stats = useMemo(() => {
    if (!currentChild) return null;

    const childTasks = tasks.filter(
      task => task.childId === currentChild.id &&
      task.date >= startDate &&
      task.date <= endDate
    );

    const completedTasks = childTasks.filter(t => t.status === 'completed');
    const totalDuration = completedTasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
    const completionRate = childTasks.length > 0
      ? Math.round((completedTasks.length / childTasks.length) * 100)
      : 0;

    // 按日期分组
    const dailyData: Record<string, { planned: number; completed: number }> = {};
    childTasks.forEach(task => {
      if (!dailyData[task.date]) {
        dailyData[task.date] = { planned: 0, completed: 0 };
      }
      dailyData[task.date].planned += task.duration;
      if (task.status === 'completed' && task.actualDuration) {
        dailyData[task.date].completed += Math.round(task.actualDuration / 60);
      }
    });

    // 按科目分组
    const subjectData = SUBJECTS.map(subject => {
      const subjectTasks = completedTasks.filter(t => t.subject === subject.id);
      const duration = subjectTasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
      return {
        subject: subject.name,
        count: subjectTasks.length,
        duration: Math.round(duration / 60),
        color: subject.color
      };
    }).filter(s => s.count > 0);

    // 找出最佳学习日
    let bestDay = { date: '', duration: 0 };
    Object.entries(dailyData).forEach(([date, data]) => {
      if (data.completed > bestDay.duration) {
        bestDay = { date, duration: data.completed };
      }
    });

    return {
      totalDuration,
      completedTasks: completedTasks.length,
      totalTasks: childTasks.length,
      completionRate,
      bestDay,
      dailyData: Object.entries(dailyData).map(([date, data]) => ({
        date: format(new Date(date), 'M-d'),
        planned: data.planned,
        completed: data.completed
      })),
      subjectData
    };
  }, [currentChild, tasks, startDate, endDate]);

  const handleExportPDF = () => {
    toast.info('PDF导出功能开发中...');
  };

  const handleExportExcel = () => {
    toast.info('Excel导出功能开发中...');
  };

  if (!currentChild) {
    return (
      <EmptyState
        title="暂无数据"
        description="请先添加孩子信息"
      />
    );
  }

  if (!stats || stats.totalTasks === 0) {
    return (
      <EmptyState
        title="暂无学习数据"
        description="该时间段内没有学习记录"
      />
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <h1 className="text-xl font-bold text-white">学习统计</h1>
      </div>

      {/* 日期选择 */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">选择日期范围:</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={startDate} onValueChange={setStartDate}>
              <SelectTrigger className="flex-1 bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
                  return (
                    <SelectItem key={date} value={date} className="text-white">
                      {date}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <span className="text-slate-400">至</span>
            <Select value={endDate} onValueChange={setEndDate}>
              <SelectTrigger className="flex-1 bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
                  return (
                    <SelectItem key={date} value={date} className="text-white">
                      {date}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 数据摘要 */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            数据摘要
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {formatDuration(Math.round(stats.totalDuration / 60))}
              </div>
              <div className="text-xs text-slate-400 mt-1">总学习时长</div>
            </div>
            <div className="text-center border-x border-slate-700">
              <div className="text-2xl font-bold text-green-400">
                {stats.completedTasks}
              </div>
              <div className="text-xs text-slate-400 mt-1">完成任务数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-slate-400 mt-1">平均完成率</div>
            </div>
          </div>

          {stats.bestDay.date && (
            <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-4 h-4" />
                <span className="text-sm">
                  最佳学习日: {stats.bestDay.date} · {formatDuration(stats.bestDay.duration)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 学习时间趋势 */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            学习时间趋势
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="completed" name="完成数量" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="planned" name="计划数量" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 科目时间分布 */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            科目时间分布
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {stats.subjectData.map((subject) => (
              <div key={subject.subject} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  <span style={{ color: subject.color }} className="font-bold">
                    {subject.subject[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{subject.subject}</span>
                    <span className="text-slate-400 text-xs">
                      {subject.count}次学习 · {subject.duration}分钟
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(subject.duration / (stats.totalDuration / 60)) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 报告导出 */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            报告导出中心
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
            <div>
              <p className="text-white text-sm">计划流水账</p>
              <p className="text-slate-400 text-xs">{stats.totalTasks}条任务记录，按日期科目整理</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="flex-1 bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              导出PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="flex-1 bg-transparent border-green-500/50 text-green-400 hover:bg-green-500/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              导出Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
