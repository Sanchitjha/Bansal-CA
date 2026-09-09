/**
 * Typed fetch wrapper for the Bansal backend.
 *
 * - Base URL comes from NEXT_PUBLIC_API_URL (defaults to http://localhost:5000).
 * - Reads the JWT from localStorage (key `aa_token`) and sends it as
 *   `Authorization: Bearer <token>` on every request.
 * - Throws an ApiError on non-2xx responses so callers get a typed rejection
 *   they can inspect (status + server-provided message).
 *
 * Use it directly, or wrap it in a TanStack Query mutation/query hook.
 */

/** Backend base URL, without trailing slash. Use this in raw fetch() calls. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

const BASE_URL = API_URL;

const TOKEN_KEY = "aa_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore quota / private-mode errors
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: Record<string, string>;
  /** Skip attaching the Authorization header (for public endpoints). */
  skipAuth?: boolean;
}

export async function api<T = unknown>(
  path: string,
  { body, headers, skipAuth, ...init }: ApiOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (body !== undefined) {
    finalHeaders["Content-Type"] = finalHeaders["Content-Type"] ?? "application/json";
  }
  if (!skipAuth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...init,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : null) || res.statusText || "Request failed";
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}
