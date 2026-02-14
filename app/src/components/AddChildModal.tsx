import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GRADES } from '@/lib/constants';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, grade: number) => void;
}

export function AddChildModal({ isOpen, onClose, onConfirm }: AddChildModalProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请输入小孩姓名');
      return;
    }
    onConfirm(name.trim(), grade);
    setName('');
    setGrade(1);
    setError('');
  };

  const handleClose = () => {
    setName('');
    setGrade(1);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            添加小孩
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 小孩姓名 */}
          <div className="space-y-2">
            <Label className="text-slate-300">
              小孩姓名 <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="请输入姓名"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* 当前年级 */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              当前年级
            </Label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {GRADES.map((g) => (
                <motion.button
                  key={g.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGrade(g.value)}
                  className={`
                    px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${grade === g.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }
                  `}
                >
                  {g.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            确认添加
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
