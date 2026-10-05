import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export interface AuthUser {
  id?: number;
  name: string;
  emailOrPhone: string;
  username?: string;
  role: 'customer' | 'management';
}

interface AuthContextType {
  user: AuthUser | null;
  role: 'customer' | 'management' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  isCustomerPortalOpen: boolean;
  loginModalDefaultTab: 'customer' | 'management';
  openLoginModal: (defaultTab?: 'customer' | 'management') => void;
  closeLoginModal: () => void;
  openCustomerPortal: () => void;
  closeCustomerPortal: () => void;
  loginCustomer: (name: string, emailOrPhone: string) => void;
  loginCustomerWithPassword: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (name: string, emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  resetCustomerPassword: (emailOrPhone: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  loginManagement: (password: string, username?: string) => Promise<{ success: boolean; message?: string }>;
  resetManagementPassword: (recoveryKey: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  getManagementCredentials: () => { username: string; passwordHint: string };
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalDefaultTab, setLoginModalDefaultTab] = useState<'customer' | 'management'>('management');
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);

  // Check active PHP session on mount or fallback to stored admin session
  const checkSession = useCallback(async () => {
    try {
      const data = await apiService.getMe();
      if (data && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          emailOrPhone: data.user.email || data.user.username,
          username: data.user.username,
          role: 'management',
        };
        setUser(authUser);
        sessionStorage.setItem('vana_admin_user', JSON.stringify(authUser));
        setIsLoading(false);
        return;
      }
    } catch {
      // Backend check failed; fallback to local session if present
    }

    const savedUser = sessionStorage.getItem('vana_admin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const openLoginModal = (_defaultTab?: 'customer' | 'management') => {
    setLoginModalDefaultTab('management');
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openCustomerPortal = () => setIsCustomerPortalOpen(false);
  const closeCustomerPortal = () => setIsCustomerPortalOpen(false);

  // Management Login via PHP Session API with local fallback support
  const loginManagement = async (password: string, username: string = 'admin'): Promise<{ success: boolean; message?: string }> => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // 1. Try PHP / MySQL backend API first if available
    try {
      const res = await apiService.login(cleanUser, cleanPass);
      if (res && res.user) {
        const authUser: AuthUser = {
          id: res.user.id,
          name: res.user.name,
          emailOrPhone: res.user.email || res.user.username,
          username: res.user.username,
          role: 'management',
        };
        setUser(authUser);
        sessionStorage.setItem('vana_admin_user', JSON.stringify(authUser));
        setIsLoginModalOpen(false);
        return { success: true };
      }
    } catch {
      // Backend offline or unreachable, fall back to local verification below
    }

    // 2. Check local credentials (supports custom reset password and defaults)
    const storedCustomPass = localStorage.getItem('vana_resort_admin_password');
    const validPasswords = [
      'Admin@Vana2026!',
      'vana@araku2025',
      'admin',
      ...(storedCustomPass ? [storedCustomPass] : []),
    ];

    const isValidUser =
      cleanUser.toLowerCase() === 'admin' ||
      cleanUser.toLowerCase() === 'admin@vanaresortaraku.com';
    const isValidPass = validPasswords.includes(cleanPass);

    if (isValidUser && isValidPass) {
      const localUser: AuthUser = {
        id: 1,
        name: 'Resort General Manager',
        emailOrPhone: 'admin@vanaresortaraku.com',
        username: 'admin',
        role: 'management',
      };
      setUser(localUser);
      sessionStorage.setItem('vana_admin_user', JSON.stringify(localUser));
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid management credentials. Default: admin / Admin@Vana2026!',
    };
  };

  // Logout via PHP Session API & local session cleanup
  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch {
      // Ignore if server unreachable
    } finally {
      sessionStorage.removeItem('vana_admin_user');
      setUser(null);
      setIsCustomerPortalOpen(false);
    }
  };

  // Legacy guest stubs (Customer login removed per specification)
  const loginCustomer = (name: string, emailOrPhone: string) => {
    setUser({
      name: name.trim() || 'Valued Guest',
      emailOrPhone: emailOrPhone.trim(),
      role: 'customer',
    });
    setIsLoginModalOpen(false);
  };

  const loginCustomerWithPassword = async () => {
    return { success: false, message: 'Customer portal login is currently disabled. Please contact the front desk.' };
  };

  const registerCustomer = async () => {
    return { success: false, message: 'Customer registration is disabled.' };
  };

  const resetCustomerPassword = async () => {
    return { success: false, message: 'Password reset is disabled for guest accounts.' };
  };

  const resetManagementPassword = async (
    recoveryKey: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    const cleanKey = recoveryKey.trim().toLowerCase();
    const cleanPass = newPassword.trim();

    const validKeys = ['vana-admin', 'admin', 'admin@vana2026!', 'vana@araku2025'];
    if (!validKeys.includes(cleanKey)) {
      return {
        success: false,
        message: 'Invalid master recovery key. Authorized keys are "vana-admin" or "admin".',
      };
    }

    if (cleanPass.length < 4) {
      return {
        success: false,
        message: 'New password must be at least 4 characters long.',
      };
    }

    // Save to local storage for local/offline authentication
    localStorage.setItem('vana_resort_admin_password', cleanPass);

    // Also attempt backend update if backend is reachable
    try {
      await apiService.resetPassword(recoveryKey, cleanPass, 'admin');
    } catch {
      // If backend is not available, local fallback is already stored
    }

    return {
      success: true,
      message: 'Management password updated successfully! Redirecting to login...',
    };
  };

  const getManagementCredentials = () => {
    const customPass = localStorage.getItem('vana_resort_admin_password');
    return {
      username: 'admin',
      passwordHint: customPass
        ? `Custom key active (${customPass})`
        : 'Default: Admin@Vana2026! (or vana@araku2025)',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        isLoginModalOpen,
        isCustomerPortalOpen,
        loginModalDefaultTab,
        openLoginModal,
        closeLoginModal,
        openCustomerPortal,
        closeCustomerPortal,
        loginCustomer,
        loginCustomerWithPassword,
        registerCustomer,
        resetCustomerPassword,
        loginManagement,
        resetManagementPassword,
        getManagementCredentials,
        checkSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
