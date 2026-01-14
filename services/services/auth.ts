import { apiFetch, setToken } from "./apiClient";

export interface User {
  id: number;
  email: string;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const res = await apiFetch<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    return res;
  } catch (error: any) {
    // 提供更详细的错误信息
    const errorMessage = error?.message || "登录失败，请检查网络连接和账号密码";
    throw new Error(errorMessage);
  }
}

export function logout() {
  setToken(null);
}

