import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, BarChart3, TrendingUp, TreePine, LayoutGrid, ChevronDown, BookOpen, Calculator, Languages, FlaskConical } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { id: string; label: string; icon: React.ElementType }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '每日打卡', icon: CheckCircle, path: '/' },
  { id: 'statistics', label: '学习统计', icon: BarChart3, path: '/statistics' },
  { id: 'grades', label: '成绩档案', icon: TrendingUp, path: '/grades' },
  { id: 'forest', label: '成长森林', icon: TreePine, path: '/forest' },
  {
    id: 'templates',
    label: '模板管理',
    icon: LayoutGrid,
    children: [
      { id: 'chinese', label: '语文', icon: BookOpen },
      { id: 'math', label: '数学', icon: Calculator },
      { id: 'english', label: '英语', icon: Languages },
      { id: 'science', label: '科学', icon: FlaskConical }
    ]
  }
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['templates']);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 bg-slate-900 border-slate-800 p-0">
        <SheetHeader className="p-4 border-b border-slate-800">
          <SheetTitle className="text-white flex items-center gap-2">
            <TreePine className="w-6 h-6 text-green-500" />
            <span>GrowTree</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const hasChildren = !!item.children;
            const isExpanded = expandedItems.includes(item.id);

            if (hasChildren) {
              return (
                <Collapsible
                  key={item.id}
                  open={isExpanded}
                  onOpenChange={() => toggleExpanded(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                        active
                          ? 'bg-blue-600/30 text-blue-400'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 mt-2 space-y-1"
                        >
                          {item.children?.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <button
                                key={child.id}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                              >
                                <ChildIcon className="w-4 h-4" />
                                <span className="text-sm">{child.label}</span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => item.path && handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? 'bg-blue-600/30 text-blue-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* 会员标识 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <span className="text-amber-400 text-sm">尊享会员权益生效中</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
