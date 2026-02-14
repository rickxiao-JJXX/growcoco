import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import SideMenu from './SideMenu';

export default function MobileLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a2744] flex flex-col touch-manipulation">
      {/* 顶部头部 */}
      <TopHeader onMenuClick={() => setIsSideMenuOpen(true)} />

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto pb-20 -mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="px-4 py-4"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 底部导航 */}
      <BottomNav />

      {/* 侧边菜单 */}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
    </div>
  );
}
