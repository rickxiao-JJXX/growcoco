import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = '暂无数据',
  description = '开始添加第一条记录吧',
  icon: Icon = FileText,
  action
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
