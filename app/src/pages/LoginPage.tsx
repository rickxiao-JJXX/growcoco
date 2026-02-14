import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Lock, TreePine, ChevronLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

// 注册表单组件
function RegisterForm({ onBack }: { onBack: () => void }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!phone.trim()) {
      toast.error('请输入手机号');
      return;
    }
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('请输入正确的手机号格式');
      return;
    }
    if (!password.trim()) {
      toast.error('请输入密码');
      return;
    }
    if (password.length < 6) {
      toast.error('密码长度至少6位');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    if (!username.trim()) {
      toast.error('请输入用户名');
      return;
    }

    setIsLoading(true);

    try {
      // 从 localStorage 获取用户列表
      const users = JSON.parse(localStorage.getItem('growtree_users') || '[]');

      // 检查手机号是否已注册
      if (users.find((u: any) => u.phone === phone)) {
        toast.error('该手机号已注册');
        setIsLoading(false);
        return;
      }

      // 创建新用户（密码加密）
      const hashPassword = (pwd: string): string => {
        return btoa(pwd + 'default_salt');
      };
      
      const newUser = {
        id: `user_${Date.now()}`,
        phone,
        password: hashPassword(password),
        username,
        children: [],
        currentChildId: null,
        createdAt: new Date().toISOString()
      };

      // 保存到用户列表
      users.push(newUser);
      localStorage.setItem('growtree_users', JSON.stringify(users));

      toast.success('注册成功，请登录');
      onBack();
    } catch {
      toast.error('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-sm"
    >
      <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          返回登录
        </button>

        <h2 className="text-xl font-semibold text-white text-center mb-6">
          创建新账号
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">手机号</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入11位手机号"
                maxLength={11}
                className="pl-12 pr-4 py-3 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">用户名</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="pl-12 pr-4 py-3 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">密码</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="设置密码（至少6位）"
                className="pl-12 pr-4 py-3 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">确认密码</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                className="pl-12 pr-4 py-3 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>注册中...</span>
                </div>
              ) : (
                '立即注册'
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

// 登录表单组件
function LoginForm({ onRegister }: { onRegister: () => void }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 加载上次登录的账号
  useEffect(() => {
    const lastPhone = localStorage.getItem('growtree_last_phone');
    if (lastPhone) {
      setPhone(lastPhone);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(phone, password);
      if (success) {
        // 保存登录账号
        localStorage.setItem('growtree_last_phone', phone);
        toast.success('登录成功');
        navigate('/');
      } else {
        setError('手机号或密码错误');
      }
    } catch {
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-sm"
    >
      <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-xl">
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          欢迎回来
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">手机号</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                placeholder="请输入手机号"
                maxLength={11}
                className="pl-12 pr-4 py-3 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">密码</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="输入您的密码"
                className="pl-12 pr-12 py-3 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>登录中...</span>
                </div>
              ) : (
                '开始成长'
              )}
            </Button>
          </motion.div>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-slate-500 text-xs">或</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <div className="text-center space-y-3">
          <p className="text-slate-400 text-sm">
            还没有账号？{' '}
            <button
              onClick={onRegister}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              立即免费创建
            </button>
          </p>
          <p className="text-slate-500 text-xs">
            测试账号：13366016355 / password123
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1d32] to-[#1a2744] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo区域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <TreePine className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          GrowTree <span className="text-green-400">成长树</span>
        </h1>
        <p className="text-slate-400">让成长看得见</p>
        <p className="text-slate-500 text-sm">Study & Growth</p>
      </motion.div>

      {/* 表单区域 */}
      <AnimatePresence mode="wait">
        {isRegister ? (
          <RegisterForm key="register" onBack={() => setIsRegister(false)} />
        ) : (
          <LoginForm key="login" onRegister={() => setIsRegister(true)} />
        )}
      </AnimatePresence>

      {/* 页脚 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-auto pt-8 text-center"
      >
        <p className="text-slate-500 text-sm">© 2026 GrowTree 成长树 · 让成长看得见</p>
        <p className="text-slate-600 text-xs mt-1">PREMIUM STUDY ASSISTANT</p>
      </motion.footer>
    </div>
  );
}
