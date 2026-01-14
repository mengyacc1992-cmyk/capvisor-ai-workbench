import { apiFetch, setToken } from "./apiClient";

export interface User {
  id: number;
  email: string;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiFetch<{ user: User; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(res.token);
  return res;
}

export function logout() {
  setToken(null);
}

