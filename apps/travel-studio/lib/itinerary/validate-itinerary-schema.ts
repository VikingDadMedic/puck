import Ajv2020, {
  type ErrorObject,
  type ValidateFunction,
} from "ajv/dist/2020";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";

let validateFn: ValidateFunction | null = null;

function resolveSchemasRoot(): string {
  const candidates = [
    path.join(process.cwd(), "schemas"),
    path.join(process.cwd(), "apps", "travel-studio", "schemas"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error(
    "Could not locate JSON schemas (tried ./schemas and ./apps/travel-studio/schemas)"
  );
}

function listSchemaFiles(dir: string): string[] {
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listSchemaFiles(p));
    else if (e.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function getValidator(): ValidateFunction {
  if (validateFn) return validateFn;

  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
  });
  addFormats(ajv);

  const root = resolveSchemasRoot();
  const files = listSchemaFiles(root);
  const seenIds = new Set<string>();
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8")) as {
      $id?: string;
    };
    if (raw.$id && seenIds.has(raw.$id)) continue;
    if (raw.$id) seenIds.add(raw.$id);
    ajv.addSchema(raw as object);
  }

  const docId =
    "https://voyagersocial.io/schemas/itinerary/itinerary-document.schema.json";
  validateFn = ajv.getSchema(docId) ?? null;
  if (!validateFn) {
    throw new Error(
      `AJV failed to compile itinerary document schema (${docId})`
    );
  }
  return validateFn;
}

export function validateItineraryDocument(
  doc: unknown
): { ok: true } | { ok: false; errors: string } {
  try {
    const validate = getValidator();
    if (validate(doc)) return { ok: true };
    return {
      ok: false,
      errors: validate.errors
        ? ajvErrorLines(validate.errors)
        : "Unknown schema validation error",
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, errors: `Validator setup failed: ${msg}` };
  }
}

function ajvErrorLines(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) return "Unknown schema validation error";
  return errors
    .map((e) => `${e.instancePath || "/"} ${e.message || ""}`.trim())
    .join("; ");
}
