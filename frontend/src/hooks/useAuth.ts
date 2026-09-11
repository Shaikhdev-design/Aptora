"use client";

import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "aptora_access_token";
const AUTH_EVENT = "aptora-auth-changed";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

function getApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000"
  );
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    function syncAuthState() {
      setIsAuthenticated(Boolean(getStoredToken()));
    }

    syncAuthState();

    window.addEventListener(
      AUTH_EVENT,
      syncAuthState,
    );

    window.addEventListener(
      "storage",
      syncAuthState,
    );

    return () => {
      window.removeEventListener(
        AUTH_EVENT,
        syncAuthState,
      );

      window.removeEventListener(
        "storage",
        syncAuthState,
      );
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${getApiUrl()}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email.trim(),
              password: credentials.password,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Invalid email or password.",
          );
        }

        const authData = data as AuthResponse;

        if (!authData.access_token) {
          throw new Error(
            "Login succeeded but no access token was returned.",
          );
        }

        storeToken(authData.access_token);

        setIsAuthenticated(true);

        return authData;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to sign in.";

        setError(message);
        setIsAuthenticated(false);

        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (userData: RegisterData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${getApiUrl()}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              full_name: userData.full_name.trim(),
              email: userData.email.trim(),
              password: userData.password,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to create your account.",
          );
        }

        const authData = data as AuthResponse;

        if (!authData.access_token) {
          throw new Error(
            "Account was created but no access token was returned.",
          );
        }

        /*
         * Registration automatically logs the user in.
         */
        storeToken(authData.access_token);

        setIsAuthenticated(true);

        return authData;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to create your account.";

        setError(message);
        setIsAuthenticated(false);

        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearStoredToken();
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  return {
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
  };
}