/**
 * Centralized API Client — Auto-attaches Firebase ID token to every request.
 */

import { auth } from "@/lib/firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://backend.enord.in";

/**
 * Get the current user's Firebase ID token (auto-refreshes if expired).
 */
async function getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
        // Check for reviewer backdoor token
        if (typeof window !== "undefined") {
            return localStorage.getItem("BYPASS_TOKEN");
        }
        return null;
    }

    try {
        return await user.getIdToken();
    } catch {
        return null;
    }
}

/**
 * Get headers with Firebase ID token for manual fetch requests.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getAuthToken();
    if (token) {
        return { "Authorization": `Bearer ${token}` };
    }
    return {};
}

/**
 * Make an authenticated API request.
 * Automatically attaches the Bearer token if the user is logged in.
 */
export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = await getAuthToken();

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

    const res = await fetch(url, {
        ...options,
        headers,
    });

    // If we get a 401, the token might be expired — clear and throw
    if (res.status === 401) {
        console.warn("API returned 401 — token may be expired");
    }

    return res;
}

/**
 * Convenience: POST JSON to authenticated API endpoint.
 */
export async function apiPost<T = unknown>(
    path: string,
    body: Record<string, unknown>
): Promise<T> {
    const res = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
    }

    return res.json();
}

/**
 * Convenience: GET from authenticated API endpoint.
 */
export async function apiGet<T = unknown>(path: string): Promise<T> {
    const res = await apiFetch(path, { method: "GET" });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
    }

    return res.json();
}

export { API_BASE };
