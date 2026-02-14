import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Child, Reward } from '@/types';
import { mockUser } from '@/data/mockData';

// 简单的密码加密函数
const hashPassword = (password: string): string => {
  // 实际项目中应该使用更安全的加密算法，如bcrypt
  return btoa(password + process.env.REACT_APP_SALT || 'default_salt');
};

// 验证密码
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// 生成简单的token
const generateToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天过期
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
};

// 验证token
const verifyToken = (token: string): { userId: string } | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null;
    }
    return { userId: payload.userId };
  } catch {
    return null;
  }
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentChild: Child | null;
  setCurrentChild: (childId: string) => void;
  addChild: (child: Omit<Child, 'id' | 'points' | 'growthLevel' | 'growthName' | 'monthlyPoints'>) => void;
  updateChild: (childId: string, updates: Partial<Omit<Child, 'id'>>) => void;
  deleteChild: (childId: string) => void;
  updateUser: (updates: Partial<Omit<User, 'id' | 'children'>>) => void;
  rewards: Reward[];
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (rewardId: string, updates: Partial<Omit<Reward, 'id'>>) => void;
  deleteReward: (rewardId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 从 localStorage 获取用户列表
const getUsersFromStorage = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem('growtree_users') || '[]');
  } catch {
    return [];
  }
};

// 保存用户列表到 localStorage
const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem('growtree_users', JSON.stringify(users));
};

// 从 localStorage 获取奖励数据
const getRewardsFromStorage = (): Reward[] => {
  try {
    return JSON.parse(localStorage.getItem('growtree_rewards') || '[]');
  } catch {
    return [];
  }
};

// 保存奖励数据到 localStorage
const saveRewardsToStorage = (rewards: Reward[]) => {
  localStorage.setItem('growtree_rewards', JSON.stringify(rewards));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // 初始化时从 localStorage 读取token并验证
  useEffect(() => {
    const token = localStorage.getItem('growtree_token');
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const users = getUsersFromStorage();
        const user = users.find((u) => u.id === payload.userId);
        if (user) {
          setUser(user);
        } else {
          localStorage.removeItem('growtree_token');
        }
      } else {
        localStorage.removeItem('growtree_token');
      }
    }
    // 读取奖励数据
    const storedRewards = getRewardsFromStorage();
    setRewards(storedRewards);
    setIsLoading(false);
  }, []);

  // 用户变化时保存到 localStorage
  useEffect(() => {
    if (user) {
      const token = generateToken(user.id);
      localStorage.setItem('growtree_token', token);
      // 同时更新用户列表中的该用户
      const users = getUsersFromStorage();
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        saveUsersToStorage(users);
      }
    } else {
      localStorage.removeItem('growtree_token');
    }
  }, [user]);

  const login = async (phone: string, password: string): Promise<boolean> => {
    // 验证输入
    if (!phone.trim() || !password.trim()) {
      return false;
    }

    // 从 localStorage 获取用户列表
    const users = getUsersFromStorage();

    // 查找匹配的用户
    const foundUser = users.find((u) => u.phone === phone);
    if (foundUser && verifyPassword(password, foundUser.password)) {
      // 确保用户有 children 数组
      if (!foundUser.children) {
        foundUser.children = [];
      }
      setUser(foundUser);
      return true;
    }

    // 检查是否是默认测试用户
    if (phone === '13366016355' && password === 'password123') {
      // 确保测试用户也在用户列表中
      const testUserExists = users.find((u) => u.id === mockUser.id);
      if (!testUserExists) {
        // 加密测试用户的密码
        const hashedPassword = hashPassword(password);
        const testUserWithHashedPassword = {
          ...mockUser,
          password: hashedPassword
        };
        users.push(testUserWithHashedPassword);
        saveUsersToStorage(users);
        setUser(testUserWithHashedPassword);
      } else {
        setUser(testUserExists);
      }
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('growtree_token');
  };

  const currentChild = user?.children?.find((c) => c.id === user.currentChildId) || user?.children?.[0] || null;

  const setCurrentChild = (childId: string) => {
    if (user) {
      const updatedUser = { ...user, currentChildId: childId };
      setUser(updatedUser);
    }
  };

  const addChild = (child: Omit<Child, 'id' | 'points' | 'growthLevel' | 'growthName' | 'monthlyPoints'>) => {
    if (user) {
      const newChild: Child = {
        ...child,
        id: `child_${Date.now()}`,
        points: 0,
        growthLevel: 1,
        growthName: '种子',
        monthlyPoints: 0
      };
      const updatedChildren = [...(user.children || []), newChild];
      const updatedUser = {
        ...user,
        children: updatedChildren,
        currentChildId: newChild.id
      };
      setUser(updatedUser);
    }
  };

  const updateChild = (childId: string, updates: Partial<Omit<Child, 'id'>>) => {
    if (user && user.children) {
      const updatedChildren = user.children.map((child) =>
        child.id === childId ? { ...child, ...updates } : child
      );
      const updatedUser = { ...user, children: updatedChildren };
      setUser(updatedUser);
    }
  };

  const deleteChild = (childId: string) => {
    if (user && user.children) {
      const updatedChildren = user.children.filter((child) => child.id !== childId);
      const updatedUser = {
        ...user,
        children: updatedChildren,
        currentChildId: updatedChildren.length > 0 ? updatedChildren[0].id : undefined
      };
      setUser(updatedUser);
    }
  };

  const updateUser = (updates: Partial<Omit<User, 'id' | 'children'>>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: `reward_${Date.now()}`
    };
    const updatedRewards = [...rewards, newReward];
    setRewards(updatedRewards);
    saveRewardsToStorage(updatedRewards);
  };

  const updateReward = (rewardId: string, updates: Partial<Omit<Reward, 'id'>>) => {
    const updatedRewards = rewards.map(reward =>
      reward.id === rewardId ? { ...reward, ...updates } : reward
    );
    setRewards(updatedRewards);
    saveRewardsToStorage(updatedRewards);
  };

  const deleteReward = (rewardId: string) => {
    const updatedRewards = rewards.filter(reward => reward.id !== rewardId);
    setRewards(updatedRewards);
    saveRewardsToStorage(updatedRewards);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        currentChild,
        setCurrentChild,
        addChild,
        updateChild,
        deleteChild,
        updateUser,
        rewards,
        addReward,
        updateReward,
        deleteReward
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
