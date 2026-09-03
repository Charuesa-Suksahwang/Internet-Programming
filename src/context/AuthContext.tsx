import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const API_BASE_URL = 'http://119.59.102.161:3056/api';

type LoginInput = {
  username: string;
  password: string;
};

type AuthContextType = {
  accessToken: string | null;
  isSigningIn: boolean;
  signIn: (input: LoginInput) => Promise<void>;
  signOut: () => void;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signOut = useCallback(() => {
    setAccessToken(null);
  }, []);

  const signIn = useCallback(async ({ username, password }: LoginInput) => {
    setIsSigningIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data: unknown = await response.json().catch(() => ({}));
      const responseData = data as {
        error?: string;
        message?: string;
        token?: string;
        accessToken?: string;
        data?: { token?: string; accessToken?: string };
      };

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Username or password is incorrect');
      }

      const token = responseData.token ?? responseData.accessToken ?? responseData.data?.token ?? responseData.data?.accessToken;
      if (!token) {
        throw new Error('The login API did not return an access token');
      }

      setAccessToken(token);
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const apiFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          ...(options.headers as Record<string, string> | undefined),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (response.status === 401 || response.status === 403) {
        signOut();
      }

      return response;
    },
    [accessToken, signOut]
  );

  const value = useMemo(
    () => ({ accessToken, isSigningIn, signIn, signOut, apiFetch }),
    [accessToken, apiFetch, isSigningIn, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
