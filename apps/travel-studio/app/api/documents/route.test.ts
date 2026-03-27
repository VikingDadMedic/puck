import fs from "fs";
import { clearSerpCacheDirectory } from "../../../lib/serp/cache";
import { TRAVEL_DATA_DB_PATH } from "../../../lib/persistence/travel-data-store";
import { mediterraneanCruise } from "../../../config/seed-data";
import { GET, POST, DELETE } from "./route";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

const ORIGINAL_ENV = process.env;

function authHeaders(): Record<string, string> {
  const key = process.env.TRAVEL_STUDIO_API_KEY;
  return key ? { "x-api-key": key } : {};
}

async function postDocument(payload: Record<string, unknown>, withAuth = true) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (withAuth) Object.assign(headers, authHeaders());
  return POST(
    new Request("http://localhost/api/documents", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
  );
}

function getDocuments(query = "", withAuth = true) {
  const headers: Record<string, string> = {};
  if (withAuth) Object.assign(headers, authHeaders());
  return GET(
    new Request(`http://localhost/api/documents${query ? `?${query}` : ""}`, {
      headers,
    })
  );
}

function deleteDocument(path: string, withAuth = true) {
  const headers: Record<string, string> = {};
  if (withAuth) Object.assign(headers, authHeaders());
  return DELETE(
    new Request(
      `http://localhost/api/documents?path=${encodeURIComponent(path)}`,
      { method: "DELETE", headers }
    )
  );
}

describe("documents route contracts", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.TRAVEL_STUDIO_API_KEY = "docs-api-key";
    if (fs.existsSync(TRAVEL_DATA_DB_PATH)) {
      fs.unlinkSync(TRAVEL_DATA_DB_PATH);
    }
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
    if (fs.existsSync(TRAVEL_DATA_DB_PATH)) {
      fs.unlinkSync(TRAVEL_DATA_DB_PATH);
    }
    clearSerpCacheDirectory();
  });

  describe("POST", () => {
    it("returns AUTH_REQUIRED when api key header is missing", async () => {
      const response = await postDocument(
        { path: "/trip", data: mediterraneanCruise },
        false
      );
      const body = (await response.json()) as {
        error?: { code?: string; requestId?: string };
      };
      expect(response.status).toBe(401);
      expect(body.error?.code).toBe("AUTH_REQUIRED");
      expect(response.headers.get("x-request-id")).toBeTruthy();
    });

    it("returns DOCUMENT_CONFLICT when expectedVersion is stale", async () => {
      const createResponse = await postDocument({
        path: "/trip",
        expectedVersion: 0,
        data: mediterraneanCruise,
      });
      expect(createResponse.status).toBe(200);
      const createBody = (await createResponse.json()) as {
        version?: number;
      };
      expect(createBody.version).toBe(1);

      const staleResponse = await postDocument({
        path: "/trip",
        expectedVersion: 0,
        data: mediterraneanCruise,
      });
      const staleBody = (await staleResponse.json()) as {
        error?: { code?: string };
      };
      expect(staleResponse.status).toBe(409);
      expect(staleBody.error?.code).toBe("DOCUMENT_CONFLICT");
    });

    it("fails safe when persisted travel data is corrupted", async () => {
      fs.writeFileSync(TRAVEL_DATA_DB_PATH, "{not valid json", "utf-8");
      const response = await postDocument({
        path: "/trip",
        expectedVersion: 0,
        data: mediterraneanCruise,
      });
      const body = (await response.json()) as {
        error?: { code?: string };
      };
      expect(response.status).toBe(500);
      expect(body.error?.code).toBe("INTERNAL_ERROR");
    });
  });

  describe("GET", () => {
    it("returns AUTH_REQUIRED when api key header is missing", async () => {
      const response = await getDocuments("", false);
      const body = (await response.json()) as {
        error?: { code?: string };
      };
      expect(response.status).toBe(401);
      expect(body.error?.code).toBe("AUTH_REQUIRED");
    });

    it("lists seed documents when no saved data exists", async () => {
      const response = await getDocuments();
      expect(response.status).toBe(200);
      const body = (await response.json()) as {
        documents?: { path: string; source: string }[];
      };
      expect(body.documents).toBeDefined();
      expect(body.documents!.length).toBeGreaterThan(0);
      expect(body.documents!.some((d) => d.source === "seed")).toBe(true);
    });

    it("lists saved documents merged with seed", async () => {
      await postDocument({
        path: "/my-vacation",
        data: mediterraneanCruise,
      });
      const response = await getDocuments();
      const body = (await response.json()) as {
        documents?: { path: string; source: string }[];
      };
      expect(body.documents!.some((d) => d.path === "/my-vacation")).toBe(true);
      expect(
        body.documents!.find((d) => d.path === "/my-vacation")?.source
      ).toBe("saved");
    });

    it("filters by path when query param is provided", async () => {
      await postDocument({
        path: "/trip",
        data: mediterraneanCruise,
      });
      const response = await getDocuments("path=/trip");
      const body = (await response.json()) as {
        documents?: { path: string }[];
      };
      expect(body.documents).toHaveLength(1);
      expect(body.documents![0].path).toBe("/trip");
    });

    it("includes x-request-id header", async () => {
      const response = await getDocuments();
      expect(response.headers.get("x-request-id")).toBeTruthy();
    });
  });

  describe("DELETE", () => {
    it("returns AUTH_REQUIRED when api key header is missing", async () => {
      const response = await deleteDocument("/trip", false);
      const body = (await response.json()) as {
        error?: { code?: string };
      };
      expect(response.status).toBe(401);
      expect(body.error?.code).toBe("AUTH_REQUIRED");
    });

    it("returns VALIDATION_ERROR when path param is missing", async () => {
      const response = await DELETE(
        new Request("http://localhost/api/documents", {
          method: "DELETE",
          headers: authHeaders(),
        })
      );
      const body = (await response.json()) as {
        error?: { code?: string };
      };
      expect(response.status).toBe(400);
      expect(body.error?.code).toBe("VALIDATION_ERROR");
    });

    it("returns NOT_FOUND when document does not exist", async () => {
      const response = await deleteDocument("/nonexistent");
      const body = (await response.json()) as {
        error?: { code?: string };
      };
      expect(response.status).toBe(404);
      expect(body.error?.code).toBe("NOT_FOUND");
    });

    it("deletes a saved document successfully", async () => {
      await postDocument({
        path: "/to-delete",
        data: mediterraneanCruise,
      });

      const deleteResponse = await deleteDocument("/to-delete");
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.headers.get("x-request-id")).toBeTruthy();

      const listResponse = await getDocuments("path=/to-delete");
      const listBody = (await listResponse.json()) as {
        documents?: { path: string }[];
      };
      const found = listBody.documents?.find((d) => d.path === "/to-delete");
      expect(found).toBeUndefined();
    });
  });
});
