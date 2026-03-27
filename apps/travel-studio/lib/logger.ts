export type LogLevel = "info" | "warn" | "error";

export function logApi(
  level: LogLevel,
  requestId: string,
  message: string,
  meta?: Record<string, unknown>
): void {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    requestId,
    message,
    ...meta,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function newRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}
