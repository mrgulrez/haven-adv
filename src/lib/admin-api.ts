import { apiGet, apiPost, apiFetch } from "./api";

export interface AdminStats {
    total_users: number;
    pro_users: number;
    core_users: number;
    total_messages: number;
    total_voice_minutes_this_month: number;
}

export interface AdminUser {
    id: string;
    email: string;
    display_name: string | null;
    plan: string;
    created_at: string;
    voice_minutes_used: number;
    text_messages_sent: number;
}

export interface AdminUserListResponse {
    users: AdminUser[];
    total: number;
    page: number;
    page_size: number;
}

/**
 * Fetch high-level admin statistics.
 */
export async function fetchAdminStats(): Promise<AdminStats> {
    return apiGet<AdminStats>("/api/admin/stats");
}

/**
 * Fetch a paginated list of users with usage stats.
 */
export async function fetchAdminUsers(page: number = 1, searchQuery: string = ""): Promise<AdminUserListResponse> {
    const params = new URLSearchParams({ page: page.toString() });
    if (searchQuery) {
        params.append("search", searchQuery);
    }
    return apiGet<AdminUserListResponse>(`/api/admin/users?${params.toString()}`);
}

/**
 * Update a user's subscription plan manually.
 */
export async function updateUserPlan(userId: string, plan: "free" | "core" | "pro"): Promise<{ message: string }> {
    const res = await apiFetch(`/api/admin/users/${userId}/plan`, {
        method: "PUT",
        body: JSON.stringify({ plan })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update plan: ${text}`);
    }

    return res.json();
}

export interface AdminHealthResponse {
    database: "connected" | "error";
    openai: "connected" | "error" | "unconfigured";
    deepgram: "connected" | "error" | "unconfigured";
    cartesia: "connected" | "error" | "unconfigured";
    pinecone: "initialized" | "error" | "unconfigured";
}

/**
 * Fetch system health metrics.
 */
export async function fetchAdminHealth(): Promise<AdminHealthResponse> {
    return apiGet<AdminHealthResponse>("/api/admin/health");
}
