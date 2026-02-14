import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import type { Subject, RepeatType } from '@/types';
import { SUBJECTS, DURATION_OPTIONS, REPEAT_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 格式化时长为小时和分钟
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
  }
  return `${mins}分钟`;
};

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: {
    subject: Subject;
    name: string;
    duration: number;
    repeat: RepeatType;
    points: number;
  }) => void;
  selectedDate: Date;
}

export default function AddPlanModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate
}: AddPlanModalProps) {
  const [subject, setSubject] = useState<Subject>('math');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(30);
  const [repeat, setRepeat] = useState<RepeatType>('once');
  const [enablePoints, setEnablePoints] = useState(true);
  const [points, setPoints] = useState(10);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ subject, name: name.trim(), duration, repeat, enablePoints ? points : 0 });
    onClose();
    // 重置表单
    setSubject('math');
    setName('');
    setDuration(30);
    setRepeat('once');
    setEnablePoints(true);
    setPoints(10);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-slate-900 border-slate-800 h-[90vh] rounded-t-3xl">
        <SheetHeader className="pb-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg">添加学习计划</SheetTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <p className="text-slate-400 text-sm">
            {format(selectedDate, 'M月d日', { locale: zhCN })}
            <span className="ml-2">{format(selectedDate, 'EEEE', { locale: zhCN })}</span>
          </p>
        </SheetHeader>

        <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 选择科目 */}
          <div className="space-y-3">
            <Label className="text-slate-300">选择科目</Label>
            <div className="grid grid-cols-5 gap-3">
              {SUBJECTS.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSubject(s.id)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                    ${subject === s.id
                      ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                      : 'opacity-70 hover:opacity-100'
                    }
                  `}
                  style={{
                    backgroundColor: s.bgColor,
                    borderColor: subject === s.id ? s.color : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}20` }}
                  >
                    <span style={{ color: s.color }} className="text-lg font-bold">
                      {s.name[0]}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300">{s.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 计划名称 */}
          <div className="space-y-3">
            <Label className="text-slate-300">
              计划名称 <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：数学作业、英语阅读"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          {/* 计划时长 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">计划时长</Label>
              <span className="text-blue-400 font-semibold">{formatDuration(duration)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDuration(option.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${duration === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }
                  `}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
            <Slider
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              min={5}
              max={180}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>5分钟</span>
              <span>3小时</span>
            </div>
          </div>

          {/* 重复设置 */}
          <div className="space-y-3">
            <Label className="text-slate-300">重复设置</Label>
            <div className="grid grid-cols-5 gap-3">
              {REPEAT_OPTIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRepeat(option.value as RepeatType)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                    ${repeat === option.value
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }
                  `}
                >
                  <span className="text-lg font-bold">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 完成后奖励积分 */}
          <div className="space-y-3 bg-amber-500/10 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <Checkbox
                id="enable-points"
                checked={enablePoints}
                onCheckedChange={setEnablePoints}
                className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label htmlFor="enable-points" className="text-slate-300 cursor-pointer">完成后奖励积分</Label>
            </div>
            <div className="flex items-center gap-4 ml-6" style={{ opacity: enablePoints ? 1 : 0.6 }}>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Math.max(0, Number(e.target.value) || 0))}
                disabled={!enablePoints}
                min="0"
                className="w-24 bg-slate-800 border-slate-700 text-white text-center"
              />
              <span className="text-slate-400">积分</span>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            创建计划
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
