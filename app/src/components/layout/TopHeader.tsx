import { Menu, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddChildModal } from '@/components/AddChildModal';
import { useState } from 'react';

interface TopHeaderProps {
  onMenuClick: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  const { user, currentChild, setCurrentChild, logout, addChild } = useAuth();
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  const handleChildSelect = (childId: string) => {
    setCurrentChild(childId);
  };

  const handleAddChild = (name: string, grade: number) => {
    addChild({ name, grade });
    setIsAddChildModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-md border-b border-blue-700/30">
        <div className="flex items-center justify-between px-4 h-14">
          {/* 左侧菜单按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </motion.button>

          {/* 中间Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">GrowTree</span>
          </div>

          {/* 右侧用户选择器 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4 text-blue-200" />
                <span className="text-sm text-white font-medium">
                  {currentChild?.name || '选择孩子'}
                </span>
                <ChevronDown className="w-4 h-4 text-blue-200" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-slate-800 border-slate-700"
            >
              {user?.children.map((child) => (
                <DropdownMenuItem
                  key={child.id}
                  onClick={() => handleChildSelect(child.id)}
                  className={`cursor-pointer ${
                    currentChild?.id === child.id
                      ? 'bg-blue-600/30 text-blue-200'
                      : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  {child.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={() => setIsAddChildModalOpen(true)}
                className="cursor-pointer text-blue-400 hover:bg-blue-600/20"
              >
                <span className="mr-2">+</span>
                添加新小孩
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-400 hover:bg-red-600/20"
              >
                <span className="mr-2">→</span>
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AddChildModal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        onConfirm={handleAddChild}
      />
    </>
  );
}
