// Typed client for the backend's response envelope (API_CONTRACT.md §0):
//   success → { ok: true,  data: {...} }
//   failure → { ok: false, error: "code", message?, request_id? }
// All calls are same-origin '/api/*' — in dev next.config rewrites proxy to the
// backend; in prod Caddy serves /api. Cookies (HttpOnly session) flow automatically.

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string; message?: string; request_id?: string };
export type ApiEnvelope<T> = ApiOk<T> | ApiErr;

/** Stable error codes (API_CONTRACT.md §7). `network` is client-synthesized (offline). */
export type ApiErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'otp_locked'
  | 'moderation_pending'
  | 'content_blocked'
  | 'listing_unavailable'
  | 'payment_failed'
  | 'conflict'
  | 'internal'
  | 'network';

/** RU user-facing copy per code (INTERACTION_STATES.md §6). Never echoes server text blindly. */
const MESSAGES: Record<ApiErrorCode, string> = {
  validation_error: 'Проверьте введённые данные.',
  unauthorized: 'Нужно войти.',
  forbidden: 'Нет доступа.',
  not_found: 'Не найдено.',
  rate_limited: 'Слишком часто. Подождите немного и попробуйте снова.',
  otp_locked: 'Слишком много попыток. Попробуйте позже.',
  moderation_pending: 'Отправлено на проверку.',
  content_blocked: 'Текст содержит недопустимые слова — отредактируйте, пожалуйста.',
  listing_unavailable: 'Этот букет уже недоступен.',
  payment_failed: 'Оплата не прошла. Деньги в безопасности.',
  conflict: 'Действие уже выполнено или устарело. Обновите страницу.',
  internal: 'Что-то пошло не так. Попробуйте ещё раз.',
  network: 'Нет соединения. Проверьте интернет и повторите.',
};

export function messageForCode(code: string): string {
  return MESSAGES[code as ApiErrorCode] ?? MESSAGES.internal;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly requestId?: string;
  readonly status?: number;
  /** Extra fields the backend returned alongside the error (e.g. retry_after_sec). */
  readonly data?: Record<string, unknown>;

  constructor(code: string, message?: string, opts?: { requestId?: string; status?: number; data?: Record<string, unknown> }) {
    super(message ?? messageForCode(code));
    this.name = 'ApiError';
    this.code = (MESSAGES[code as ApiErrorCode] ? code : 'internal') as ApiErrorCode;
    this.requestId = opts?.requestId;
    this.status = opts?.status;
    this.data = opts?.data;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      credentials: 'include',
    });
  } catch {
    // fetch rejects only on network failure (offline, DNS, CORS) — distinct from HTTP errors.
    throw new ApiError('network');
  }

  let body: ApiEnvelope<T> | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    body = null;
  }

  if (body && body.ok) return body.data;

  if (body && body.ok === false) {
    const { error, message, request_id, ...rest } = body as ApiErr & Record<string, unknown>;
    throw new ApiError(error, message, { requestId: request_id, status: res.status, data: rest });
  }

  // Non-envelope response (proxy error page, 5xx without body, etc.).
  throw new ApiError(res.status === 404 ? 'not_found' : 'internal', undefined, { status: res.status });
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data != null ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data != null ? JSON.stringify(data) : undefined }),
};
