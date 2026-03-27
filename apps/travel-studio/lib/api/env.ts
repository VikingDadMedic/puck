type EnvSpec = {
  key: string;
  required: boolean;
  description: string;
};

const ENV_CONTRACT: EnvSpec[] = [
  {
    key: "SERP_API_KEY",
    required: false,
    description: "SerpAPI key for hotel/flight/activity/explore search",
  },
  {
    key: "PEXELS_API_KEY",
    required: false,
    description: "Pexels API key for stock photo search",
  },
  {
    key: "UNSPLASH_ACCESS_KEY",
    required: false,
    description: "Unsplash access key for stock photo search",
  },
  {
    key: "TRAVEL_STUDIO_API_KEY",
    required: false,
    description:
      "Optional server API key to protect write/search endpoints (recommended in production)",
  },
  {
    key: "NEXT_PUBLIC_TRAVEL_STUDIO_API_KEY",
    required: false,
    description:
      "Optional browser header value for local editor fetches (must match TRAVEL_STUDIO_API_KEY when both are set)",
  },
];

let validated = false;

export function validateEnv(): { missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const spec of ENV_CONTRACT) {
    const value = process.env[spec.key];
    if (!value) {
      if (spec.required) {
        missing.push(`${spec.key} — ${spec.description}`);
      } else {
        warnings.push(`${spec.key} not set — ${spec.description}`);
      }
    }
  }

  const serverApiKey = process.env.TRAVEL_STUDIO_API_KEY;
  const publicApiKey = process.env.NEXT_PUBLIC_TRAVEL_STUDIO_API_KEY;
  if (publicApiKey && !serverApiKey) {
    warnings.push(
      "NEXT_PUBLIC_TRAVEL_STUDIO_API_KEY is set but TRAVEL_STUDIO_API_KEY is not set"
    );
  }
  if (publicApiKey && serverApiKey && publicApiKey !== serverApiKey) {
    warnings.push(
      "NEXT_PUBLIC_TRAVEL_STUDIO_API_KEY does not match TRAVEL_STUDIO_API_KEY"
    );
  }
  if (process.env.NODE_ENV === "production" && !serverApiKey) {
    warnings.push(
      "TRAVEL_STUDIO_API_KEY is not set in production; APIs are publicly callable"
    );
  }

  validated = true;
  return { missing, warnings };
}

export function ensureEnvValidated(): void {
  if (validated) return;
  const { missing, warnings } = validateEnv();

  for (const w of warnings) {
    console.warn(`[env] ${w}`);
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join("\n")}`
    );
  }
}
