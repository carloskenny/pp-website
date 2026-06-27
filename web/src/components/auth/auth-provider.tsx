'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { message } from 'antd';
import {
  ApiError,
  AppUser,
  AuthSession,
  LoginPayload,
  login as apiLogin,
  logoutSession as apiLogoutSession,
  me as apiMe,
  refreshSession as apiRefreshSession,
  updateCurrentUser as apiUpdateCurrentUser,
  updateMyPassword as apiUpdateMyPassword,
} from '@/lib/api';

type AuthContextValue = {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AppUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AppUser | null>;
  hasRole: (roles: AppUser['role'][]) => boolean;
  updateProfile: (payload: {
    name?: string;
    phone?: string | null;
    avatarUrl?: string | null;
    preferences?: Partial<AppUser['preferences']>;
  }) => Promise<AppUser>;
  updatePassword: (payload: { password: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((session: AuthSession) => {
    setUser(session.user);
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const currentUser = await apiMe();
      setUser(currentUser);
      return;
    } catch (error) {
      if (isAuthError(error)) {
        try {
          const session = await apiRefreshSession();
          setSession(session);
          return;
        } catch {
          setUser(null);
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  }, [setSession]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const session = await apiLogin(payload);
      setSession(session);
      message.success('Login realizado com sucesso');
      return session.user;
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogoutSession();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await apiMe();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (isAuthError(error)) {
        const session = await apiRefreshSession();
        setSession(session);
        return session.user;
      }
      throw error;
    }
  }, [setSession]);

  const updateProfile = useCallback(
    async (payload: {
      name?: string;
      phone?: string | null;
      avatarUrl?: string | null;
      preferences?: Partial<AppUser['preferences']>;
    }) => {
      const updated = await apiUpdateCurrentUser(payload);
      setUser(updated);
      return updated;
    },
    [],
  );

  const updatePassword = useCallback(async (payload: { password: string }) => {
    await apiUpdateMyPassword(payload);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser,
      hasRole: (roles) => Boolean(user && roles.includes(user.role)),
      updateProfile,
      updatePassword,
    }),
    [isLoading, login, logout, refreshUser, updatePassword, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
