const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("acadebit_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("acadebit_token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

function get<T>(path: string) { return request<T>(path, { method: "GET" }); }
function post<T>(path: string, body: unknown) { return request<T>(path, { method: "POST", body: JSON.stringify(body) }); }
function put<T>(path: string, body: unknown) { return request<T>(path, { method: "PUT", body: JSON.stringify(body) }); }
function patch<T>(path: string, body?: unknown) { return request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }); }
function del<T>(path: string) { return request<T>(path, { method: "DELETE" }); }

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string; schoolId: string };
}

export const auth = {
  login: (email: string, password: string) =>
    post<LoginResponse>("/api/auth/login", { email, password }),
  register: (data: { name: string; email: string; password: string; role: string; schoolId?: string }) =>
    post<LoginResponse>("/api/auth/register", data),
  me: () => get<LoginResponse["user"]>("/api/auth/me"),
};

// ── Students ──────────────────────────────────────────────────────────────────

export interface Student {
  id: string; schoolId: string; name: string; admNo: string;
  class: string; nemisNo?: string; dob?: string; gender?: string;
  createdAt: string;
}

export const students = {
  list: (params?: { class?: string; limit?: number; offset?: number }) =>
    get<{ students: Student[]; total: number }>(`/api/students?${new URLSearchParams(params as Record<string, string> || {})}`),
  get: (id: string) => get<Student>(`/api/students/${id}`),
  create: (data: Partial<Student>) => post<Student>("/api/students", data),
  update: (id: string, data: Partial<Student>) => put<Student>(`/api/students/${id}`, data),
  delete: (id: string) => del<{ success: boolean }>(`/api/students/${id}`),
};

// ── Fees ──────────────────────────────────────────────────────────────────────

export const fees = {
  list: (params?: Record<string, string>) =>
    get<{ fees: unknown[] }>(`/api/fees?${new URLSearchParams(params || {})}`),
  summary: () => get<{ summary: unknown }>("/api/fees/summary"),
  recordPayment: (data: { studentId: string; amount: number; term: string; year: number; mpesaRef?: string }) =>
    post<unknown>("/api/fees/payment", data),
};

// ── Attendance ────────────────────────────────────────────────────────────────

export const attendance = {
  get: (date: string, className?: string) =>
    get<{ records: unknown[] }>(`/api/attendance?date=${date}${className ? `&class=${className}` : ""}`),
  mark: (records: Array<{ studentId: string; status: string; date: string }>) =>
    post<{ success: boolean }>("/api/attendance", { records }),
};

// ── Staff ─────────────────────────────────────────────────────────────────────

export const staff = {
  list: () => get<{ staff: unknown[] }>("/api/staff"),
  create: (data: unknown) => post<unknown>("/api/staff", data),
  update: (id: string, data: unknown) => put<unknown>(`/api/staff/${id}`, data),
  delete: (id: string) => del<{ success: boolean }>(`/api/staff/${id}`),
};

// ── AI ────────────────────────────────────────────────────────────────────────

export interface AIGenerateResult {
  output: string; provider: string; model: string;
}

export interface ChatMessage { role: "user" | "assistant"; content: string; }

export const ai = {
  generate: (toolType: string, prompt: string, context?: string) =>
    post<AIGenerateResult>("/api/ai/generate", { toolType, prompt, context }),

  chat: (messages: ChatMessage[], useKimi?: boolean) =>
    post<{ reply: string; provider: string }>("/api/ai/chat", { messages, useKimi }),

  voice: (query: string) =>
    post<{ response: string; provider: string }>("/api/ai/voice", { query }),

  history: (params?: { toolType?: string; limit?: number; offset?: number }) =>
    get<{ items: unknown[]; total: number }>(`/api/ai/history?${new URLSearchParams(params as Record<string, string> || {})}`),

  push: (data: { output?: string; toolType: string; targetClass: string; message?: string; scheduledAt?: string; contentId?: string }) =>
    post<{ success: boolean; contentId?: string }>("/api/ai/push", data),

  schoolStats: () => get<{ stats: unknown[] }>("/api/ai/school-stats"),

  streamGenerate: (toolType: string, prompt: string, onChunk: (chunk: string) => void, onDone: () => void) => {
    const token = getToken();
    const eventSource = new EventSource(
      `${BASE_URL}/api/ai/generate/stream?token=${token}`
    );
    // Use fetch-based streaming instead of EventSource for POST
    fetch(`${BASE_URL}/api/ai/generate/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toolType, prompt }),
    }).then(async (res) => {
      eventSource.close();
      const reader = res.body?.getReader();
      if (!reader) return onDone();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) { onDone(); break; }
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) onChunk(data.chunk);
            if (data.done) onDone();
          } catch { /* ignore parse errors */ }
        }
      }
    }).catch(() => onDone());

    return () => eventSource.close();
  },
};

// ── Gamification ──────────────────────────────────────────────────────────────

export interface XPData {
  totalXp: number; streakDays: number; level: number;
  levelProgress: number; nextLevelXp: number;
  badges: Array<{ name: string; icon: string; description: string; earnedAt: string }>;
  recentActivity: Array<{ action: string; xpEarned: number; createdAt: string }>;
}

export const gamification = {
  me: () => get<XPData>("/api/gamification/me"),
  leaderboard: (limit?: number) =>
    get<{ leaderboard: unknown[] }>(`/api/gamification/leaderboard${limit ? `?limit=${limit}` : ""}`),
  badges: () => get<{ badges: unknown[] }>("/api/gamification/badges"),
  updateStreak: () => post<{ streakDays: number; xpAwarded: number }>("/api/gamification/streak", {}),
  awardXP: (userId: string, action: string, xp: number) =>
    post<{ success: boolean }>("/api/gamification/award-xp", { userId, action, xp }),
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications = {
  list: (params?: { unreadOnly?: boolean; limit?: number }) =>
    get<{ notifications: unknown[]; unreadCount: number }>(`/api/notifications?${new URLSearchParams(params as Record<string, string> || {})}`),
  markRead: (id: string) => patch<{ success: boolean }>(`/api/notifications/${id}/read`),
  markAllRead: () => patch<{ success: boolean }>("/api/notifications/read-all"),
  send: (data: { userIds: string[]; type: string; title: string; message: string; metadata?: Record<string, unknown> }) =>
    post<{ success: boolean; count: number }>("/api/notifications/send", data),
  broadcast: (data: { targetClass?: string; roles?: string[]; type: string; title: string; message: string }) =>
    post<{ success: boolean; count: number }>("/api/notifications/broadcast", data),
  delete: (id: string) => del<{ success: boolean }>(`/api/notifications/${id}`),

  subscribe: (onMessage: (data: Record<string, unknown>) => void): EventSource => {
    const token = getToken();
    const source = new EventSource(`${BASE_URL}/api/notifications/stream?token=${token}`);
    source.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); } catch { /* ignore */ }
    };
    return source;
  },
};

// ── Content Library ───────────────────────────────────────────────────────────

export const content = {
  list: (params?: Record<string, string>) =>
    get<{ items: unknown[]; total: number }>(`/api/content?${new URLSearchParams(params || {})}`),
  get: (id: string) => get<unknown>(`/api/content/${id}`),
  create: (data: unknown) => post<unknown>("/api/content", data),
  update: (id: string, data: unknown) => put<unknown>(`/api/content/${id}`, data),
  togglePublish: (id: string) => patch<{ isPublished: boolean }>(`/api/content/${id}/publish`),
  delete: (id: string) => del<{ success: boolean }>(`/api/content/${id}`),
  trackView: (id: string) => post<{ success: boolean }>(`/api/content/${id}/view`, {}),
  deliver: (id: string, data: { targetClass: string; message?: string; scheduledAt?: string }) =>
    post<{ success: boolean }>(`/api/content/${id}/deliver`, data),
  classDeliveries: (className: string) =>
    get<{ deliveries: unknown[] }>(`/api/content/deliveries/class/${className}`),
};

// ── Competitions ──────────────────────────────────────────────────────────────

export const competitions = {
  list: (params?: { status?: string; grade?: string }) =>
    get<{ competitions: unknown[] }>(`/api/competitions?${new URLSearchParams(params || {})}`),
  get: (id: string) => get<{ competition: unknown; leaderboard: unknown[] }>(`/api/competitions/${id}`),
  create: (data: unknown) => post<unknown>("/api/competitions", data),
  updateStatus: (id: string, status: string) =>
    patch<unknown>(`/api/competitions/${id}/status`, { status }),
  submitScore: (id: string, data: { studentId: string; score: number; timeTakenSeconds?: number }) =>
    post<{ success: boolean }>(`/api/competitions/${id}/submit`, data),
  delete: (id: string) => del<{ success: boolean }>(`/api/competitions/${id}`),
};

// ── Past Papers ───────────────────────────────────────────────────────────────

export const pastPapers = {
  list: (params?: Record<string, string>) =>
    get<{ papers: unknown[]; total: number }>(`/api/pastpapers?${new URLSearchParams(params || {})}`),
  get: (id: string) => get<unknown>(`/api/pastpapers/${id}`),
  create: (data: unknown) => post<unknown>("/api/pastpapers", data),
  delete: (id: string) => del<{ success: boolean }>(`/api/pastpapers/${id}`),
  recordAttempt: (id: string, data: { studentId: string; score?: number; timeTakenSeconds?: number }) =>
    post<unknown>(`/api/pastpapers/${id}/attempt`, data),
  attempts: (id: string) => get<{ attempts: unknown[] }>(`/api/pastpapers/${id}/attempts`),
};

// ── Shop ──────────────────────────────────────────────────────────────────────

export const shop = {
  products: (params?: Record<string, string>) =>
    get<{ products: unknown[]; total: number }>(`/api/shop/products?${new URLSearchParams(params || {})}`),
  product: (id: string) => get<unknown>(`/api/shop/products/${id}`),
  createProduct: (data: unknown) => post<unknown>("/api/shop/products", data),
  updateProduct: (id: string, data: unknown) => put<unknown>(`/api/shop/products/${id}`, data),
  orders: (params?: Record<string, string>) =>
    get<{ orders: unknown[] }>(`/api/shop/orders?${new URLSearchParams(params || {})}`),
  order: (id: string) => get<unknown>(`/api/shop/orders/${id}`),
  placeOrder: (data: { items: Array<{ productId: string; quantity: number }>; deliveryAddress?: string }) =>
    post<unknown>("/api/shop/orders", data),
  updateOrderStatus: (id: string, status: string) =>
    patch<unknown>(`/api/shop/orders/${id}/status`, { status }),
  vendorStats: () => get<unknown>("/api/shop/vendor/stats"),
};

// ── Safety ────────────────────────────────────────────────────────────────────

export const safety = {
  events: (params?: { status?: string }) =>
    get<{ events: unknown[] }>(`/api/safety/events?${new URLSearchParams(params || {})}`),
  active: () => get<{ event: unknown | null }>("/api/safety/active"),
  trigger: (data: { type: string; notes?: string; headcountTotal?: number }) =>
    post<unknown>("/api/safety/trigger", data),
  updateHeadcount: (id: string, data: { headcountSafe: number; headcountTotal?: number }) =>
    patch<unknown>(`/api/safety/events/${id}/headcount`, data),
  resolve: (id: string, notes?: string) =>
    patch<unknown>(`/api/safety/events/${id}/resolve`, { notes }),
};

// ── Files ─────────────────────────────────────────────────────────────────────

export const files = {
  upload: (file: File, onProgress?: (pct: number) => void): Promise<{ id: string; url: string; filename: string }> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/api/files/upload`);
      const token = getToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(JSON.parse(xhr.responseText).error || "Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(formData);
    });
  },
  list: (params?: Record<string, string>) =>
    get<{ files: unknown[] }>(`/api/files?${new URLSearchParams(params || {})}`),
  delete: (id: string) => del<{ success: boolean }>(`/api/files/${id}`),
  url: (filePath: string) => `${BASE_URL}${filePath}`,
};

// ── Vendor ────────────────────────────────────────────────────────────────────

export const vendor = {
  dashboard: () => get<unknown>("/api/vendor/dashboard"),
  products: (params?: Record<string, string>) =>
    get<{ products: unknown[] }>(`/api/vendor/products?${new URLSearchParams(params || {})}`),
  orders: (params?: Record<string, string>) =>
    get<{ orders: unknown[] }>(`/api/vendor/orders?${new URLSearchParams(params || {})}`),
  inventoryAlerts: () => get<{ alerts: unknown[] }>("/api/vendor/inventory-alerts"),
};

// ── Reports ───────────────────────────────────────────────────────────────────

export const reports = {
  school: () => get<unknown>("/api/reports/school"),
  attendance: (params?: Record<string, string>) =>
    get<unknown>(`/api/reports/attendance?${new URLSearchParams(params || {})}`),
  fees: (params?: Record<string, string>) =>
    get<unknown>(`/api/reports/fees?${new URLSearchParams(params || {})}`),
};
