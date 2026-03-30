import { createClient } from "@supabase/supabase-js";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role?: string;
};

function isSupabaseAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return null;
  return parts[1];
}

export async function validateSupabaseToken(
  request: Request
): Promise<AuthenticatedUser | null> {
  if (!isSupabaseAuthConfigured()) return null;

  const token = extractBearerToken(request);
  if (!token) return null;

  try {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await adminClient.auth.getUser(token);
    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      role: data.user.role ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(
  request: Request
): Promise<AuthenticatedUser | null> {
  return validateSupabaseToken(request);
}
