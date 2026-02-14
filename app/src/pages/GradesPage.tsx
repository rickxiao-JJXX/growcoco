import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, FileText, Filter, Award, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import type { Grade, Subject } from '@/types';
import { SUBJECTS, EXAM_TYPES, EVALUATION_LEVELS } from '@/lib/constants';

export default function GradesPage() {
  const { currentChild } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  // 添加成绩表单状态
  const [newGrade, setNewGrade] = useState<Partial<Grade>>({
    subject: 'chinese',
    examType: 'unit',
    examName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    score: 0,
    totalScore: 100,
    evaluation: 'excellent',
    weakPoints: []
  });

  const filteredGrades = grades.filter(grade => {
    if (filterSubject !== 'all' && grade.subject !== filterSubject) return false;
    if (filterYear !== 'all' && !grade.date.startsWith(filterYear)) return false;
    return true;
  });

  const handleAddGrade = () => {
    if (!currentChild || !newGrade.examName) return;

    const grade: Grade = {
      id: `grade_${Date.now()}`,
      childId: currentChild.id,
      subject: newGrade.subject as Subject,
      examType: newGrade.examType || 'unit',
      examName: newGrade.examName,
      date: newGrade.date || format(new Date(), 'yyyy-MM-dd'),
      score: newGrade.score || 0,
      totalScore: newGrade.totalScore || 100,
      targetScore: newGrade.targetScore,
      evaluation: newGrade.evaluation as 'excellent' | 'good' | 'pass' | 'improve',
      classRank: newGrade.classRank,
      weakPoints: newGrade.weakPoints || []
    };

    setGrades([...grades, grade]);
    setIsAddModalOpen(false);
    toast.success('成绩录入成功');

    // 重置表单
    setNewGrade({
      subject: 'chinese',
      examType: 'unit',
      examName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      score: 0,
      totalScore: 100,
      evaluation: 'excellent',
      weakPoints: []
    });
  };

  const handleReset = () => {
    setFilterSubject('all');
    setFilterYear('all');
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
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-xl font-bold text-white">成绩档案</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          录入成绩
        </motion.button>
      </div>

      {/* 筛选 */}
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">筛选</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="flex-1 bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="学年" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="flex-1 bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="科目" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">全部</SelectItem>
                {SUBJECTS.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleReset}
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              重置
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 成绩列表 */}
      {filteredGrades.length === 0 ? (
        <EmptyState
          title="暂无成绩记录"
          description="点击右上角添加按钮开始记录"
          icon={FileText}
        />
      ) : (
        <div className="space-y-3">
          {filteredGrades.map((grade) => {
            const subjectConfig = SUBJECTS.find(s => s.id === grade.subject);
            const evaluationConfig = EVALUATION_LEVELS.find(e => e.id === grade.evaluation);

            return (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: subjectConfig?.bgColor }}
                    >
                      <span style={{ color: subjectConfig?.color }} className="font-bold">
                        {subjectConfig?.name[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{grade.examName}</h4>
                      <p className="text-slate-400 text-sm">
                        {grade.date} · {EXAM_TYPES.find(t => t.id === grade.examType)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {grade.score}<span className="text-sm text-slate-400">/{grade.totalScore}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${evaluationConfig?.color}20`,
                        color: evaluationConfig?.color
                      }}
                    >
                      {evaluationConfig?.name}
                    </span>
                  </div>
                </div>

                {grade.classRank && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                    <Award className="w-4 h-4 text-amber-400" />
                    班级排名: 第{grade.classRank}名
                  </div>
                )}

                {grade.weakPoints.length > 0 && (
                  <div className="mt-3 p-3 bg-amber-500/10 rounded-xl">
                    <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      薄弱环节
                    </div>
                    <div className="space-y-1">
                      {grade.weakPoints.map((point, idx) => (
                        <div key={idx} className="text-sm text-slate-400">
                          {point.knowledge}: {point.score}/{point.total}分
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 录入成绩弹窗 */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              录入成绩
            </DialogTitle>
            <p className="text-slate-400 text-sm">记录孩子的每一次进步</p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 学期信息 */}
            <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20">
              <p className="text-blue-400 text-sm">已自动关联当前学期信息</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-slate-400 text-xs">学年</span>
                  <p className="text-white">2025</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">年级</span>
                  <p className="text-white">{currentChild.grade}年级</p>
                </div>
              </div>
            </div>

            {/* 考试科目 */}
            <div className="space-y-2">
              <Label className="text-slate-300">考试科目 <span className="text-red-400">*</span></Label>
              <Select
                value={newGrade.subject}
                onValueChange={(v) => setNewGrade({ ...newGrade, subject: v as Subject })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {SUBJECTS.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 考试类型 */}
            <div className="space-y-2">
              <Label className="text-slate-300">考试类型</Label>
              <Select
                value={newGrade.examType}
                onValueChange={(v) => setNewGrade({ ...newGrade, examType: v })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {EXAM_TYPES.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 考试日期 */}
            <div className="space-y-2">
              <Label className="text-slate-300">考试日期</Label>
              <Input
                type="date"
                value={newGrade.date}
                onChange={(e) => setNewGrade({ ...newGrade, date: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* 考试名称 */}
            <div className="space-y-2">
              <Label className="text-slate-300">考试名称 <span className="text-red-400">*</span></Label>
              <Input
                value={newGrade.examName}
                onChange={(e) => setNewGrade({ ...newGrade, examName: e.target.value })}
                placeholder="如：第一单元测"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* 目标分数 */}
            <div className="space-y-2">
              <Label className="text-slate-300">目标分数</Label>
              <Input
                type="number"
                value={newGrade.targetScore || ''}
                onChange={(e) => setNewGrade({ ...newGrade, targetScore: Number(e.target.value) })}
                placeholder="设定个小目标"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* 本次得分 */}
            <div className="space-y-2">
              <Label className="text-slate-300">本次得分 <span className="text-red-400">*</span></Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={newGrade.score}
                  onChange={(e) => setNewGrade({ ...newGrade, score: Number(e.target.value) })}
                  className="flex-1 bg-slate-800 border-slate-700 text-white"
                />
                <span className="text-slate-400">/</span>
                <Input
                  type="number"
                  value={newGrade.totalScore}
                  onChange={(e) => setNewGrade({ ...newGrade, totalScore: Number(e.target.value) })}
                  className="w-24 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* 表现评价 */}
            <div className="space-y-2">
              <Label className="text-slate-300">表现评价</Label>
              <Select
                value={newGrade.evaluation}
                onValueChange={(v) => setNewGrade({ ...newGrade, evaluation: v as any })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {EVALUATION_LEVELS.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 班级排名 */}
            <div className="space-y-2">
              <Label className="text-slate-300">班级排名 (选填)</Label>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">第</span>
                <Input
                  type="number"
                  value={newGrade.classRank || ''}
                  onChange={(e) => setNewGrade({ ...newGrade, classRank: Number(e.target.value) })}
                  placeholder="输入名次"
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <span className="text-slate-400 text-sm">名</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              取消
            </Button>
            <Button
              onClick={handleAddGrade}
              disabled={!newGrade.examName}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              保存成绩
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 辅助函数
function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (formatStr === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  }
  return `${year}-${month}-${day}`;
}
