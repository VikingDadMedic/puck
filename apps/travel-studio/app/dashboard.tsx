"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit3,
  Trash2,
  FileText,
  Eye,
  Layout,
  FileEdit,
} from "lucide-react";
import type { DashboardDocument } from "./page";
import { travelStudioApiHeaders } from "../config/travel-studio-fetch";

const slugify = (value: string) =>
  value
    .replace(/^\/+/, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase() || "new-trip";

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

  const normalizedPath = `/${slugify(slug)}`;
  const isDuplicate = existingPaths.has(normalizedPath);

  const handleCreate = () => {
    if (isDuplicate) return;
    onCreated(normalizedPath, title.trim(), mode);
  };

  return (
    <div
      style={{
        background: "var(--ts-bg-card)",
        border: "1px solid var(--ts-border-default)",
        borderRadius: 12,
        padding: 24,
        maxWidth: 480,
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
        New Template
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
            background: "var(--ts-bg-card)",
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
            background: isDuplicate ? "#93c5fd" : "var(--ts-accent-blue)",
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

function UseTemplateForm({
  templatePath,
  existingPaths,
  onCancel,
}: {
  templatePath: string;
  existingPaths: Set<string>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const router = useRouter();

  const generatedSlug = slugify(name || "new-itinerary");
  const normalizedPath = `/${generatedSlug}`;
  const isDuplicate = existingPaths.has(normalizedPath);

  const handleCreate = () => {
    if (!name.trim() || isDuplicate) return;
    const params = new URLSearchParams();
    params.set("templatePath", templatePath);
    params.set("title", name.trim());
    router.push(`/${generatedSlug}/edit?${params.toString()}`);
  };

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
        }}
      >
        Create itinerary from this template
      </p>
      <label
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#374151",
          display: "block",
        }}
      >
        Itinerary name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client's Summer Trip"
          style={{
            display: "block",
            width: "100%",
            marginTop: 4,
            padding: "6px 10px",
            border: `1px solid ${isDuplicate ? "#fca5a5" : "#d1d5db"}`,
            borderRadius: 5,
            fontSize: 13,
            boxSizing: "border-box",
          }}
        />
      </label>
      {name.trim() && (
        <span
          style={{
            display: "block",
            fontSize: 11,
            marginTop: 4,
            color: isDuplicate ? "#dc2626" : "#9ca3af",
          }}
        >
          {isDuplicate
            ? `A document already exists at ${normalizedPath}`
            : `Will create: ${normalizedPath}`}
        </span>
      )}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "5px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 5,
            background: "#fff",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || isDuplicate}
          style={{
            padding: "5px 12px",
            border: "none",
            borderRadius: 5,
            background: !name.trim() || isDuplicate ? "#93c5fd" : "#7c3aed",
            color: "#fff",
            cursor: !name.trim() || isDuplicate ? "not-allowed" : "pointer",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Create Itinerary
        </button>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {icon}
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h2>
      <span
        style={{
          fontSize: 12,
          color: "#9ca3af",
          fontWeight: 400,
        }}
      >
        ({count})
      </span>
    </div>
  );
}

const modeLabels: Record<string, string> = {
  itinerary: "Itinerary",
  proposal: "Proposal",
  client_view: "Client View",
};

export function Dashboard({
  documents: initialDocuments,
}: {
  documents: DashboardDocument[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [useTemplatePath, setUseTemplatePath] = useState<string | null>(null);
  const router = useRouter();

  const existingPaths = new Set(documents.map((d) => d.path));

  const templates = documents.filter(
    (d) => d.documentType === "template" || d.documentType === undefined
  );
  const itineraries = documents.filter((d) => d.documentType === "itinerary");

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
      {/* Header */}
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
          <p
            style={{
              margin: "4px 0 0",
              color: "var(--ts-text-muted)",
              fontSize: 14,
            }}
          >
            {templates.length} template{templates.length !== 1 ? "s" : ""},{" "}
            {itineraries.length} itinerar
            {itineraries.length !== 1 ? "ies" : "y"}
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
            background: "var(--ts-accent-blue)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Plus size={16} />
          New Template
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

      {/* ── Templates Section ── */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "24px 24px 28px",
          marginBottom: 32,
        }}
      >
        <SectionHeader
          icon={<Layout size={18} style={{ color: "#6366f1" }} />}
          title="Templates"
          count={templates.length}
        />

        {templates.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}
          >
            <FileText size={36} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p style={{ fontSize: 14, margin: 0 }}>
              No templates yet. Click &quot;New Template&quot; to create one.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {templates.map((doc) => (
              <div
                key={doc.path}
                style={{
                  background: "var(--ts-bg-card)",
                  border: "1px solid var(--ts-border-default)",
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
                      color: "var(--ts-text-primary)",
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

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: "auto",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={`${doc.path}/edit`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      background: "var(--ts-accent-blue)",
                      color: "#fff",
                      borderRadius: 6,
                      fontSize: 12,
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    <Edit3 size={12} />
                    Edit Template
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setUseTemplatePath(
                        useTemplatePath === doc.path ? null : doc.path
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      background:
                        useTemplatePath === doc.path ? "#ede9fe" : "#f5f3ff",
                      border: `1px solid ${
                        useTemplatePath === doc.path ? "#a78bfa" : "#c4b5fd"
                      }`,
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: "pointer",
                      color: "#6d28d9",
                      fontWeight: 500,
                    }}
                  >
                    <FileEdit size={12} />
                    Use Template
                  </button>
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
                </div>

                {useTemplatePath === doc.path && (
                  <UseTemplateForm
                    templatePath={doc.path}
                    existingPaths={existingPaths}
                    onCancel={() => setUseTemplatePath(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Itineraries Section ── */}
      <div
        style={{
          background: "#fefce8",
          border: "1px solid #fde68a",
          borderRadius: 12,
          padding: "24px 24px 28px",
        }}
      >
        <SectionHeader
          icon={<FileText size={18} style={{ color: "#d97706" }} />}
          title="Itineraries"
          count={itineraries.length}
        />

        {itineraries.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}
          >
            <FileText size={36} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p style={{ fontSize: 14, margin: 0 }}>
              No itineraries yet. Use a template to create one.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {itineraries.map((doc) => (
              <div
                key={doc.path}
                style={{
                  background: "var(--ts-bg-card)",
                  border: "1px solid var(--ts-border-default)",
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
                      color: "var(--ts-text-primary)",
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
                      background: "#fef3c7",
                      color: "#92400e",
                      fontWeight: 500,
                    }}
                  >
                    Itinerary
                  </span>
                  {doc.source === "saved" && doc.version > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "#f0fdf4",
                        color: "#065f46",
                        fontWeight: 500,
                      }}
                    >
                      v{doc.version}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <a
                    href={`${doc.path}/edit`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      background: "var(--ts-accent-blue)",
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
        )}
      </div>
    </div>
  );
}
