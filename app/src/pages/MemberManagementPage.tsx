import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Trash2,
  Edit2,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Baby,
  Calendar,
  Phone,
  X,
  GraduationCap,
  Save,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { User, Child } from '@/types';
import { GRADES } from '@/lib/constants';

// 从 localStorage 获取所有用户
const getAllUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem('growtree_users') || '[]');
  } catch {
    return [];
  }
};

// 保存用户列表到 localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem('growtree_users', JSON.stringify(users));
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  } catch {
    return '未知';
  }
};

// 编辑孩子弹窗
function EditChildModal({
  isOpen,
  onClose,
  child,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  onSave: (updates: Partial<Omit<Child, 'id'>>) => void;
}) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setGrade(child.grade);
      setPoints(child.points);
    }
  }, [child]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('请输入孩子姓名');
      return;
    }
    onSave({ name: name.trim(), grade, points });
    onClose();
  };

  if (!child) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Baby className="w-5 h-5 text-blue-400" />
            编辑孩子信息
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-300">姓名</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              年级
            </Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {GRADES.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGrade(g.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    grade === g.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">积分</Label>
            <Input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              placeholder="请输入积分"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 添加孩子弹窗
function AddChildModal({
  isOpen,
  onClose,
  onAdd
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (child: Omit<Child, 'id' | 'points' | 'growthLevel' | 'growthName' | 'monthlyPoints'>) => void;
}) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('请输入孩子姓名');
      return;
    }
    onAdd({ name: name.trim(), grade });
    setName('');
    setGrade(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            添加孩子
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-300">姓名</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              年级
            </Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {GRADES.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGrade(g.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    grade === g.value
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            添加
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 编辑会员弹窗
function EditMemberModal({
  isOpen,
  onClose,
  user,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updates: Partial<Omit<User, 'id' | 'children'>>) => void;
}) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setPhone(user.phone);
      setPassword('');
    }
  }, [user]);

  const handleSubmit = () => {
    if (!username.trim()) {
      toast.error('请输入用户名');
      return;
    }
    if (!phone.trim()) {
      toast.error('请输入手机号');
      return;
    }

    const updates: Partial<Omit<User, 'id' | 'children'>> = {
      username: username.trim(),
      phone: phone.trim()
    };

    if (password.trim()) {
      updates.password = password.trim();
    }

    onSave(updates);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-blue-400" />
            编辑会员信息
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-300">用户名</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">手机号</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">新密码（留空则不修改）</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入新密码"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 会员卡片组件
function MemberCard({
  user,
  onUpdate,
  onDelete
}: {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onDelete: (userId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [deletingChild, setDeletingChild] = useState<Child | null>(null);
  const [deletingMember, setDeletingMember] = useState(false);

  const handleAddChild = (child: Omit<Child, 'id' | 'points' | 'growthLevel' | 'growthName' | 'monthlyPoints'>) => {
    const newChild: Child = {
      ...child,
      id: `child_${Date.now()}`,
      points: 0,
      growthLevel: 1,
      growthName: '种子',
      monthlyPoints: 0
    };

    const updatedUser = {
      ...user,
      children: [...(user.children || []), newChild]
    };

    onUpdate(updatedUser);
    toast.success('孩子添加成功');
  };

  const handleUpdateChild = (childId: string, updates: Partial<Omit<Child, 'id'>>) => {
    const updatedChildren = (user.children || []).map((child) =>
      child.id === childId ? { ...child, ...updates } : child
    );

    const updatedUser = { ...user, children: updatedChildren };
    onUpdate(updatedUser);
    toast.success('孩子信息更新成功');
  };

  const handleDeleteChild = (childId: string) => {
    const updatedChildren = (user.children || []).filter((child) => child.id !== childId);
    const updatedUser = {
      ...user,
      children: updatedChildren,
      currentChildId: updatedChildren.length > 0 ? updatedChildren[0].id : undefined
    };

    onUpdate(updatedUser);
    setDeletingChild(null);
    toast.success('孩子删除成功');
  };

  const handleUpdateMember = (updates: Partial<Omit<User, 'id' | 'children'>>) => {
    const updatedUser = { ...user, ...updates };
    onUpdate(updatedUser);
    toast.success('会员信息更新成功');
  };

  const handleDeleteMember = () => {
    onDelete(user.id);
    setDeletingMember(false);
    toast.success('会员删除成功');
  };

  return (
    <>
      <motion.div
        layout
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        {/* 会员基本信息 */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{user.username || user.phone}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone className="w-3 h-3" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                  <Calendar className="w-3 h-3" />
                  注册于 {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditMemberOpen(true)}
                className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingMember(true)}
                className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 孩子数量统计 */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/30">
              <Baby className="w-4 h-4 text-green-400" />
              <span className="text-slate-300 text-sm">
                {user.children?.length || 0} 个孩子
              </span>
            </div>
          </div>
        </div>

        {/* 展开的孩子列表 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700/50"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-300 text-sm font-medium">孩子列表</h4>
                  <button
                    onClick={() => setIsAddChildOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 text-sm hover:bg-green-600/30 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    添加孩子
                  </button>
                </div>

                {user.children && user.children.length > 0 ? (
                  <div className="space-y-2">
                    {user.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Baby className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{child.name}</p>
                            <p className="text-slate-400 text-xs">
                              {GRADES.find((g) => g.value === child.grade)?.label} · {child.points} 积分
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingChild(child)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingChild(child)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <Baby className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">暂无孩子信息</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 编辑会员弹窗 */}
      <EditMemberModal
        isOpen={isEditMemberOpen}
        onClose={() => setIsEditMemberOpen(false)}
        user={user}
        onSave={handleUpdateMember}
      />

      {/* 添加孩子弹窗 */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onAdd={handleAddChild}
      />

      {/* 编辑孩子弹窗 */}
      <EditChildModal
        isOpen={!!editingChild}
        onClose={() => setEditingChild(null)}
        child={editingChild}
        onSave={(updates) => editingChild && handleUpdateChild(editingChild.id, updates)}
      />

      {/* 删除孩子确认 */}
      <AlertDialog open={!!deletingChild} onOpenChange={() => setDeletingChild(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              确认删除孩子
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              确定要删除孩子 "{deletingChild?.name}" 吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingChild && handleDeleteChild(deletingChild.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除会员确认 */}
      <AlertDialog open={deletingMember} onOpenChange={setDeletingMember}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              确认删除会员
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              确定要删除会员 "{user.username || user.phone}" 吗？此操作将同时删除该会员下的所有孩子数据，且不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// 主页面组件
export default function MemberManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 加载用户数据
  useEffect(() => {
    const loadUsers = () => {
      const allUsers = getAllUsers();
      setUsers(allUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  // 保存用户数据
  const saveUsersData = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  // 更新用户
  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    saveUsersData(updatedUsers);

    // 如果当前登录用户被更新，也更新 localStorage 中的当前用户
    const currentUser = localStorage.getItem('growtree_user');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.id === updatedUser.id) {
        localStorage.setItem('growtree_user', JSON.stringify(updatedUser));
      }
    }
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsersData(updatedUsers);

    // 如果当前登录用户被删除，清除登录状态
    const currentUser = localStorage.getItem('growtree_user');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.id === userId) {
        localStorage.removeItem('growtree_user');
      }
    }
  };

  // 过滤用户
  const filteredUsers = users.filter(
    (user) =>
      user.phone.includes(searchTerm) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a2744] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a2744] p-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            会员管理
          </h1>
          <p className="text-slate-400 mt-2">管理所有注册用户及其孩子信息</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">总会员数</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Baby className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">总孩子数</p>
                <p className="text-2xl font-bold text-white">
                  {users.reduce((sum, user) => sum + (user.children?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索手机号或用户名..."
            className="pl-12 pr-4 py-3 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 会员列表 */}
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <MemberCard
                key={user.id}
                user={user}
                onUpdate={handleUpdateUser}
                onDelete={handleDeleteUser}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">
                {searchTerm ? '未找到匹配的会员' : '暂无注册用户'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
