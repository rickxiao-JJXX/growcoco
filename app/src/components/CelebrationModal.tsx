import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  taskName: string;
  actualSeconds: number;
  onSaveSummary: (summary: string) => void;
}

const SUMMARY_OPTIONS = [
  '认真完成，收获很大！',
  '今天状态不错，继续加油！',
  '有点难，但坚持下来了。',
  '学到了新知识！',
  '需要多复习这部分内容。',
  '这个知识点掌握得不够好。'
];

export default function CelebrationModal({
  isOpen,
  onClose,
  points,
  taskName,
  actualSeconds,
  onSaveSummary
}: CelebrationModalProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<string>('');
  const [customSummary, setCustomSummary] = useState('');

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins}分钟`;
    return `${mins}分${secs}秒`;
  };

  const handleSave = () => {
    const summary = customSummary || selectedSummary;
    if (summary) {
      onSaveSummary(summary);
    }
    onClose();
    setShowSummary(false);
    setSelectedSummary('');
    setCustomSummary('');
  };

  const handleSkip = () => {
    onClose();
    setShowSummary(false);
    setSelectedSummary('');
    setCustomSummary('');
  };

  // 彩带动画
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* 彩带效果 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ 
                  y: -20, 
                  x: `${piece.x}%`, 
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  y: '100vh', 
                  opacity: 0,
                  rotate: 360 + Math.random() * 360
                }}
                transition={{ 
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  width: 8 + Math.random() * 6,
                  height: 8 + Math.random() * 6,
                  backgroundColor: piece.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                }}
              />
            ))}
          </div>

          {/* 弹窗内容 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl max-w-sm w-full mx-4"
          >
            <AnimatePresence mode="wait">
              {!showSummary ? (
                <motion.div
                  key="celebration"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  {/* 星星图标 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center"
                  >
                    <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
                  </motion.div>

                  {/* 积分 */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-4xl font-bold text-amber-400">+{points}</span>
                    <span className="text-lg text-amber-400/80 ml-1">积分</span>
                  </motion.div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-300 mt-2"
                  >
                    任务完成，奖励已到账！
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={() => setShowSummary(true)}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium"
                    >
                      太棒了！
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* 关闭按钮 */}
                  <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>

                  {/* 标题 */}
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Edit3 className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">太棒了！</h3>
                    <p className="text-slate-400 text-sm">你完成了今天的学习任务</p>
                  </div>

                  {/* 任务信息 */}
                  <div className="bg-slate-700/50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{taskName}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-blue-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(actualSeconds)}
                      </span>
                      <span className="text-amber-400">+{points}积分</span>
                    </div>
                  </div>

                  {/* 学习总结 */}
                  <div className="mb-4">
                    <p className="text-slate-300 text-sm mb-2">学习总结（可选）</p>
                    <div className="flex flex-wrap gap-2">
                      {SUMMARY_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedSummary(option);
                            setCustomSummary('');
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedSummary === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 自定义总结 */}
                  <textarea
                    value={customSummary}
                    onChange={(e) => {
                      setCustomSummary(e.target.value);
                      setSelectedSummary('');
                    }}
                    placeholder="或输入自定义总结..."
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-sm placeholder:text-slate-500 resize-none focus:outline-none focus:border-blue-500"
                    rows={2}
                  />

                  {/* 按钮 */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      跳过
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      保存总结
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
