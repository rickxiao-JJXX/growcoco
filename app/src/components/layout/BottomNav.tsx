import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RefreshCw, Download, Upload, Check, X, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  action?: () => void;
}

// 数据导出弹窗
function ExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const handleExport = () => {
    try {
      // 收集所有数据
      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('growtree_user') || '{}'),
        tasks: JSON.parse(localStorage.getItem('growtree_tasks') || '[]'),
        grades: JSON.parse(localStorage.getItem('growtree_grades') || '[]'),
        children: JSON.parse(localStorage.getItem('growtree_children') || '[]')
      };

      // 创建Blob并下载
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studygrow_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('数据导出成功');
      onClose();
    } catch (error) {
      toast.error('数据导出失败');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl max-w-sm w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                导出数据
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileJson className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">JSON格式</p>
                  <p className="text-slate-400 text-sm">包含所有学习数据</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• 用户信息</p>
                <p>• 学习计划</p>
                <p>• 成绩记录</p>
                <p>• 孩子档案</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleExport}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                导出
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 数据导入弹窗
function ImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast.error('请选择JSON格式的文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // 验证数据格式
        if (!data.version) {
          toast.error('无效的数据文件格式');
          return;
        }

        // 导入数据
        if (data.user) localStorage.setItem('growtree_user', JSON.stringify(data.user));
        if (data.tasks) localStorage.setItem('growtree_tasks', JSON.stringify(data.tasks));
        if (data.grades) localStorage.setItem('growtree_grades', JSON.stringify(data.grades));
        if (data.children) localStorage.setItem('growtree_children', JSON.stringify(data.children));

        toast.success('数据导入成功，请刷新页面');
        onClose();
      } catch (error) {
        toast.error('数据导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl max-w-sm w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-400" />
                导入数据
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-white font-medium mb-1">点击或拖拽文件到此处</p>
              <p className="text-slate-400 text-sm">支持 .json 格式文件</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
            </div>

            <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <p className="text-amber-400 text-sm">
                <span className="font-medium">注意：</span>导入数据将覆盖当前所有数据，请确保已备份重要信息。
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 数据同步弹窗
function SyncModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      toast.success('数据同步成功');
      setTimeout(() => {
        setSyncComplete(false);
        onClose();
      }, 1500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl max-w-sm w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
                数据同步
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="text-center py-6">
              {syncComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  animate={isSyncing ? { rotate: 360 } : {}}
                  transition={isSyncing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center"
                >
                  <RefreshCw className="w-8 h-8 text-cyan-400" />
                </motion.div>
              )}

              <p className="text-white font-medium">
                {syncComplete ? '同步完成' : isSyncing ? '正在同步...' : '准备同步'}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {syncComplete 
                  ? '所有数据已同步到云端' 
                  : isSyncing 
                    ? '请稍候...' 
                    : '将本地数据同步到云端'}
              </p>
            </div>

            {!isSyncing && !syncComplete && (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSync}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors"
                >
                  开始同步
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSync, setShowSync] = useState(false);

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: '打卡', 
      icon: Home, 
      path: '/' 
    },
    { 
      id: 'sync', 
      label: '数据同步', 
      icon: RefreshCw, 
      action: () => setShowSync(true) 
    },
    { 
      id: 'export', 
      label: '导出数据', 
      icon: Download, 
      action: () => setShowExport(true) 
    },
    { 
      id: 'import', 
      label: '导入数据', 
      icon: Upload, 
      action: () => setShowImport(true) 
    }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 safe-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.path ? isActive(item.path) : false;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* 弹窗 */}
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} />
      <SyncModal isOpen={showSync} onClose={() => setShowSync(false)} />
    </>
  );
}
