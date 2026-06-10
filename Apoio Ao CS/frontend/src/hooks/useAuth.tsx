import { useState, useEffect } from 'react';

const CHAVE_TOKEN = 'auth_token';

interface JwtPayload {
  role?: string;
  sub?: string;
  exp?: number;
  [key: string]: unknown;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

function resolveStateFromToken(token: string | null): AuthState {
  if (!token) return { token: null, role: null, isAuthenticated: false };
  const payload = parseJwt(token);
  if (!payload) return { token: null, role: null, isAuthenticated: false };
  return { token, role: payload.role ?? null, isAuthenticated: true };
}

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>(() =>
    resolveStateFromToken(localStorage.getItem(CHAVE_TOKEN))
  );

  useEffect(() => {
    const token = localStorage.getItem(CHAVE_TOKEN);
    const state = resolveStateFromToken(token);
    if (!state.isAuthenticated && token) {
      localStorage.removeItem(CHAVE_TOKEN);
    }
    setAuthState(state);
  }, []);

  const login = (token: string) => {
    const state = resolveStateFromToken(token);
    if (!state.isAuthenticated) return;
    localStorage.setItem(CHAVE_TOKEN, token);
    setAuthState(state);
  };

  const logout = () => {
    localStorage.removeItem(CHAVE_TOKEN);
    setAuthState({ token: null, role: null, isAuthenticated: false });
  };

  return { ...authState, login, logout };
}
