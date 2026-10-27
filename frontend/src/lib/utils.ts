export { cn } from "cn";

export const PHONE_PLACEHOLDER = "+880 1234567894";

export function isOptionalEmailValid(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
