export { cn } from "cn";

export const PHONE_PLACEHOLDER = "+880 1234567894";

export function isOptionalEmailValid(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

type ApiErrorBody = {
  message?: string;
  errors?: { field?: string; message?: string }[];
};

/** User-facing message from an axios-style API error. */
export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong'
): string {
  const error = err as {
    response?: { status?: number; data?: ApiErrorBody };
    message?: string;
  };

  if (!error.response) {
    return 'Cannot reach the server. Check that the backend is running and try again.';
  }

  const { status, data } = error.response;

  if (status === 401) {
    return 'Email or password is incorrect. Please try again.';
  }

  if (data?.errors?.length) {
    return data.errors[0]?.message || data.message || fallback;
  }

  return data?.message || fallback;
}
