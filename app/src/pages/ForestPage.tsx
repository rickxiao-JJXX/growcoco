import { useState } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Gift, Coins, History, Settings, Target, CheckCircle, Sprout, TreePine as TreeIcon, Gift as GiftIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GROWTH_STAGES } from '@/lib/constants';
import EmptyState from '@/components/EmptyState';

// 成长树SVG组件
const GrowthTreeSVG = ({ level, progress }: { level: number; progress?: number }) => {
  // progress is used for future animation enhancements
  void progress;
  const trees = [
    // 种子
    <svg key="seed" viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="60" r="15" fill="#8B4513" />
      <ellipse cx="50" cy="55" rx="8" ry="12" fill="#654321" />
    </svg>,
    // 小芽
    <svg key="sprout" viewBox="0 0 100 100" className="w-full h-full">
      <path d="M50 80 Q50 60 35 50" stroke="#22c55e" strokeWidth="4" fill="none" />
      <ellipse cx="35" cy="45" rx="12" ry="8" fill="#22c55e" transform="rotate(-30 35 45)" />
      <path d="M50 80 Q50 55 65 50" stroke="#22c55e" strokeWidth="4" fill="none" />
      <ellipse cx="65" cy="45" rx="12" ry="8" fill="#22c55e" transform="rotate(30 65 45)" />
    </svg>,
    // 幼苗
    <svg key="seedling" viewBox="0 0 100 100" className="w-full h-full">
      <rect x="47" y="60" width="6" height="30" fill="#8B4513" />
      <ellipse cx="50" cy="40" rx="20" ry="25" fill="#22c55e" />
      <ellipse cx="35" cy="50" rx="12" ry="15" fill="#16a34a" />
      <ellipse cx="65" cy="50" rx="12" ry="15" fill="#16a34a" />
    </svg>,
    // 小树
    <svg key="tree" viewBox="0 0 100 100" className="w-full h-full">
      <rect x="45" y="70" width="10" height="25" fill="#8B4513" />
      <circle cx="50" cy="45" r="30" fill="#22c55e" />
      <circle cx="30" cy="55" r="20" fill="#16a34a" />
      <circle cx="70" cy="55" r="20" fill="#16a34a" />
      <circle cx="50" cy="30" r="18" fill="#15803d" />
    </svg>,
    // 大树
    <svg key="bigtree" viewBox="0 0 100 100" className="w-full h-full">
      <rect x="42" y="65" width="16" height="35" fill="#8B4513" />
      <ellipse cx="50" cy="40" rx="40" ry="35" fill="#22c55e" />
      <ellipse cx="25" cy="50" rx="25" ry="22" fill="#16a34a" />
      <ellipse cx="75" cy="50" rx="25" ry="22" fill="#16a34a" />
      <ellipse cx="50" cy="25" rx="22" ry="18" fill="#15803d" />
      <circle cx="40" cy="35" r="8" fill="#166534" opacity="0.5" />
      <circle cx="60" cy="35" r="8" fill="#166534" opacity="0.5" />
    </svg>,
    // 森林
    <svg key="forest" viewBox="0 0 100 100" className="w-full h-full">
      <rect x="35" y="70" width="8" height="25" fill="#8B4513" />
      <rect x="57" y="75" width="6" height="20" fill="#654321" />
      <circle cx="39" cy="50" r="22" fill="#22c55e" />
      <circle cx="60" cy="60" r="18" fill="#16a34a" />
      <circle cx="25" cy="60" r="15" fill="#15803d" />
      <circle cx="75" cy="55" r="16" fill="#22c55e" />
      <circle cx="50" cy="35" r="20" fill="#16a34a" />
    </svg>
  ];

  return (
    <div className="relative w-48 h-48 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        {trees[level - 1] || trees[0]}
      </div>
      {/* 光晕效果 */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${level >= 4 ? '#22c55e' : '#3b82f6'}40 0%, transparent 70%)`
        }}
      />
    </div>
  );
};

export default function ForestPage() {
  const { currentChild, rewards } = useAuth();
  const [activeTab, setActiveTab] = useState('tree');

  if (!currentChild) {
    return (
      <EmptyState
        title="暂无孩子信息"
        description="请先添加孩子信息"
      />
    );
  }

  const currentStage = GROWTH_STAGES.find(
    s => currentChild.growthLevel >= s.level
  ) || GROWTH_STAGES[0];

  const nextStage = GROWTH_STAGES.find(s => s.level > currentChild.growthLevel);
  const progressToNext = nextStage
    ? ((currentChild.monthlyPoints - currentStage.minPoints) / (nextStage.minPoints - currentStage.minPoints)) * 100
    : 100;

  const pointsNeeded = nextStage ? nextStage.minPoints - currentChild.monthlyPoints : 0;

  const handleLuckyDraw = () => {
    toast.info('请先让家长进入设置模式配置奖品');
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-600/30 flex items-center justify-center">
          <TreePine className="w-5 h-5 text-green-400" />
        </div>
        <h1 className="text-xl font-bold text-white">成长森林</h1>
      </div>

      {/* Tab切换 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/60">
          <TabsTrigger
            value="tree"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Sprout className="w-4 h-4 mr-2" />
            成长小树
          </TabsTrigger>
          <TabsTrigger
            value="shop"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            积分商城
          </TabsTrigger>
        </TabsList>

        {/* 成长小树 */}
        <TabsContent value="tree" className="space-y-6 mt-4">
          {/* 成长之旅 */}
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">成长之旅</h3>
                  <p className="text-slate-400 text-sm">完成任务，让小树和森林一起长大</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: CheckCircle, label: '每日打卡', desc: '做任务赚积分', color: 'text-green-400' },
                  { icon: Sprout, label: '养小树', desc: '积分助成长', color: 'text-blue-400' },
                  { icon: TreeIcon, label: '种森林', desc: '每月一棵树', color: 'text-emerald-400' },
                  { icon: GiftIcon, label: '换奖励', desc: '积分换礼物', color: 'text-amber-400' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-2">
                    <div className={`w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-2`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-white text-sm font-medium">{item.label}</span>
                    <span className="text-slate-500 text-xs">{item.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 本月小树 */}
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">本月小树</CardTitle>
                    <p className="text-slate-400 text-sm">坚持打卡，让小树苗茁壮成长</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-600/30 text-green-400 text-xs rounded-full">
                    {new Date().getMonth() + 1}月
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* 树的展示 */}
              <GrowthTreeSVG level={currentChild.growthLevel} progress={progressToNext} />

              {/* 等级信息 */}
              <div className="text-center mt-4">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{currentStage.name}</h3>
                  <span className="px-2 py-0.5 bg-amber-600/30 text-amber-400 text-xs rounded-full">
                    Lv.{currentChild.growthLevel}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">{currentStage.description}</p>
              </div>

              {/* 进度条 */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">当前进度</span>
                  <span className="text-slate-400">
                    目标: {nextStage?.name || '已满级'}
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
                {pointsNeeded > 0 && (
                  <p className="text-center text-sm text-green-400 mt-2">
                    再获得 <span className="font-bold">{pointsNeeded}</span> 积分即可升级
                  </p>
                )}
              </div>

              {/* 本月积分 */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-slate-400 text-sm">本月积分</span>
                <span className="text-2xl font-bold text-green-400">{currentChild.monthlyPoints}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 积分商城 */}
        <TabsContent value="shop" className="space-y-6 mt-4">
          {/* 可用积分 */}
          <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-amber-400 text-sm">我的可用积分</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-4xl font-bold text-white">{currentChild.points}</h3>
                      <span className="text-amber-400 text-sm">+10待确认</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/50 rounded-lg text-slate-400 text-sm hover:bg-slate-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  家长设置
                </button>
              </div>
            </CardContent>
          </Card>

          {/* 功能卡片 */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLuckyDraw}
              className="p-4 bg-gradient-to-br from-amber-600/30 to-orange-600/30 rounded-2xl border border-amber-500/30 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                <Gift className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-white font-medium">幸运抽奖</h4>
              <p className="text-amber-400/70 text-sm">需配置</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-3">
                <History className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-white font-medium">积分记录</h4>
              <p className="text-slate-400 text-sm">查看明细</p>
            </motion.button>
          </div>

          {/* 奖励池 */}
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">奖励池</CardTitle>
                  <p className="text-slate-400 text-sm">挑选你喜欢的礼物吧</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {rewards.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{reward.name}</h4>
                        <span className="px-2 py-1 bg-amber-500/30 text-amber-400 text-xs rounded-full">
                          {reward.points} 积分
                        </span>
                      </div>
                      {reward.description && (
                        <p className="text-slate-400 text-xs mb-2">{reward.description}</p>
                      )}
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="奖励池空空如也"
                  description="请先让家长进入设置模式配置奖品"
                  icon={Gift}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

