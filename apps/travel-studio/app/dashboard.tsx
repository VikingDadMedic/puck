"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, FileText, Eye } from "lucide-react";
import type { DashboardDocument } from "./page";
import { travelStudioApiHeaders } from "../config/travel-studio-fetch";

function CreateDocumentForm({
  existingPaths,
  onCancel,
  onCreated,
}: {
  existingPaths: Set<string>;
  onCancel: () => void;
  onCreated: (path: string, title: string, mode: string) => void;
}) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("itinerary");

  const normalizedPath = `/${
    slug
      .replace(/^\/+/, "")
      .replace(/[^a-z0-9-]/gi, "-")
      .toLowerCase() || "new-trip"
  }`;

  const isDuplicate = existingPaths.has(normalizedPath);

  const handleCreate = () => {
    if (isDuplicate) return;
    onCreated(normalizedPath, title.trim(), mode);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 24,
        maxWidth: 480,
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
        New Document
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
          Path slug
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-trip"
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
              padding: "8px 12px",
              border: `1px solid ${isDuplicate ? "#fca5a5" : "#d1d5db"}`,
              borderRadius: 6,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
          {isDuplicate ? (
            <span style={{ fontSize: 12, color: "#dc2626" }}>
              A document already exists at {normalizedPath} -- it will be opened
              for editing.
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              Will create: {normalizedPath}
            </span>
          )}
        </label>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mediterranean Cruise"
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </label>
        <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
          Document mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          >
            <option value="itinerary">Itinerary</option>
            <option value="proposal">Proposal</option>
            <option value="client_view">Client View</option>
          </select>
        </label>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isDuplicate}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: 6,
            background: isDuplicate ? "#93c5fd" : "#2563eb",
            color: "#fff",
            cursor: isDuplicate ? "not-allowed" : "pointer",
            fontSize: 13,
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export function Dashboard({
  documents: initialDocuments,
}: {
  documents: DashboardDocument[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const existingPaths = new Set(documents.map((d) => d.path));

  const handleDelete = useCallback(async (docPath: string) => {
    if (!confirm(`Delete document at ${docPath}? This cannot be undone.`))
      return;
    setDeleting(docPath);
    setDeleteError(null);
    try {
      const res = await fetch(
        `/api/documents?path=${encodeURIComponent(docPath)}`,
        {
          method: "DELETE",
          headers: travelStudioApiHeaders(),
        }
      );
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.path !== docPath));
      } else {
        const body = await res.json().catch(() => ({}));
        const msg =
          (body as { error?: { message?: string } })?.error?.message ||
          `Delete failed (${res.status})`;
        setDeleteError(msg);
      }
    } catch {
      setDeleteError("Network error while deleting");
    } finally {
      setDeleting(null);
    }
  }, []);

  const handleCreated = useCallback(
    (path: string, title: string, mode: string) => {
      const params = new URLSearchParams();
      if (title) params.set("title", title);
      if (mode && mode !== "itinerary") params.set("mode", mode);
      const qs = params.toString();
      router.push(`${path}/edit${qs ? `?${qs}` : ""}`);
    },
    [router]
  );

  const modeLabels: Record<string, string> = {
    itinerary: "Itinerary",
    proposal: "Proposal",
    client_view: "Client View",
  };

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            Travel Studio
          </h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Plus size={16} />
          New Document
        </button>
      </div>

      {showCreate && (
        <div style={{ marginBottom: 24 }}>
          <CreateDocumentForm
            existingPaths={existingPaths}
            onCancel={() => setShowCreate(false)}
            onCreated={handleCreated}
          />
        </div>
      )}

      {deleteError && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            marginBottom: 16,
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            fontSize: 13,
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              fontSize: 13,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {documents.length === 0 && !showCreate && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#9ca3af",
          }}
        >
          <FileText size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15 }}>
            No documents yet. Create your first trip!
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {documents.map((doc) => (
          <div
            key={doc.path}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {doc.name}
              </h3>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 12,
                  color: "#9ca3af",
                  fontFamily: "monospace",
                }}
              >
                {doc.path}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {doc.mode && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: 500,
                  }}
                >
                  {modeLabels[doc.mode] || doc.mode}
                </span>
              )}
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: doc.source === "seed" ? "#fef3c7" : "#f0fdf4",
                  color: doc.source === "seed" ? "#92400e" : "#065f46",
                  fontWeight: 500,
                }}
              >
                {doc.source === "seed" ? "Template" : `v${doc.version}`}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
              <a
                href={`${doc.path}/edit`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 12,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <Edit3 size={12} />
                Edit
              </a>
              <a
                href={doc.path}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                  fontSize: 12,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Eye size={12} />
                View
              </a>
              {doc.source === "saved" && (
                <button
                  type="button"
                  onClick={() => handleDelete(doc.path)}
                  disabled={deleting === doc.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 12px",
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: "pointer",
                    color: "#dc2626",
                    opacity: deleting === doc.path ? 0.5 : 1,
                  }}
                >
                  <Trash2 size={12} />
                  {deleting === doc.path ? "..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
