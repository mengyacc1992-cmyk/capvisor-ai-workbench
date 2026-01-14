const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

let token: string | null = null;

export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem("cv_token", t);
  else localStorage.removeItem("cv_token");
}

export function getToken() {
  if (token) return token;
  const stored = localStorage.getItem("cv_token");
  if (stored) token = stored;
  return token;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  const auth = getToken();
  if (auth) headers.Authorization = `Bearer ${auth}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

