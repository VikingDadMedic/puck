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
import { color, fontFamily, radius } from "../config/tokens";

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
        background: color.bg.card,
        border: `1px solid ${color.border.default}`,
        borderRadius: radius.xl,
        padding: 24,
        maxWidth: 480,
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
        New Template
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label
          style={{ fontSize: 13, fontWeight: 500, color: color.text.secondary }}
        >
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
              border: `1px solid ${
                isDuplicate ? color.border.red : color.border.muted
              }`,
              borderRadius: radius.sm,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
          {isDuplicate ? (
            <span style={{ fontSize: 12, color: color.accent.red }}>
              A document already exists at {normalizedPath} -- it will be opened
              for editing.
            </span>
          ) : (
            <span style={{ fontSize: 12, color: color.text.faint }}>
              Will create: {normalizedPath}
            </span>
          )}
        </label>
        <label
          style={{ fontSize: 13, fontWeight: 500, color: color.text.secondary }}
        >
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
              border: `1px solid ${color.border.muted}`,
              borderRadius: radius.sm,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </label>
        <label
          style={{ fontSize: 13, fontWeight: 500, color: color.text.secondary }}
        >
          Document mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
              padding: "8px 12px",
              border: `1px solid ${color.border.muted}`,
              borderRadius: radius.sm,
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
            border: `1px solid ${color.border.muted}`,
            borderRadius: radius.sm,
            background: color.bg.card,
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
            borderRadius: radius.sm,
            background: isDuplicate ? color.bg.blueSubtle : color.accent.blue,
            color: color.text.inverse,
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
        background: color.bg.page,
        border: `1px solid ${color.border.subtle}`,
        borderRadius: radius.md,
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 12,
          fontWeight: 600,
          color: color.text.tertiary,
        }}
      >
        Create itinerary from this template
      </p>
      <label
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: color.text.secondary,
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
            border: `1px solid ${
              isDuplicate ? color.border.red : color.border.muted
            }`,
            borderRadius: radius.sm,
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
            color: isDuplicate ? color.accent.red : color.text.faint,
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
            border: `1px solid ${color.border.muted}`,
            borderRadius: radius.sm,
            background: color.bg.card,
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
            borderRadius: radius.sm,
            background:
              !name.trim() || isDuplicate ? color.bg.blueSubtle : "#7c3aed",
            color: color.text.inverse,
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
          color: color.text.faint,
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
        fontFamily,
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
              color: color.text.muted,
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
            background: color.accent.blue,
            color: color.text.inverse,
            border: "none",
            borderRadius: radius.md,
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
            background: color.bg.redLight,
            border: `1px solid ${color.border.red}`,
            borderRadius: radius.md,
            fontSize: 13,
            color: color.accent.red,
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
              color: color.accent.red,
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
          background: color.bg.page,
          border: `1px solid ${color.border.subtle}`,
          borderRadius: radius.xl,
          padding: "24px 24px 28px",
          marginBottom: 32,
        }}
      >
        <SectionHeader
          icon={<Layout size={18} style={{ color: color.accent.blue }} />}
          title="Templates"
          count={templates.length}
        />

        {templates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: color.text.faint,
            }}
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
                  background: color.bg.card,
                  border: `1px solid ${color.border.default}`,
                  borderRadius: radius.lg,
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
                      color: color.text.primary,
                    }}
                  >
                    {doc.name}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: color.text.faint,
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
                        borderRadius: radius.pill,
                        background: color.bg.blueLight,
                        color: color.accent.blueDark,
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
                      borderRadius: radius.pill,
                      background:
                        doc.source === "seed"
                          ? color.bg.amberLight
                          : color.bg.greenLight,
                      color:
                        doc.source === "seed"
                          ? color.accent.amberDeep
                          : color.accent.greenDark,
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
                      background: color.accent.blue,
                      color: color.text.inverse,
                      borderRadius: radius.sm,
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
                      borderRadius: radius.sm,
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
                      background: color.bg.subtle,
                      border: `1px solid ${color.border.strong}`,
                      borderRadius: radius.sm,
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
          background: color.bg.amberPale,
          border: `1px solid ${color.border.amber}`,
          borderRadius: radius.xl,
          padding: "24px 24px 28px",
        }}
      >
        <SectionHeader
          icon={
            <FileText size={18} style={{ color: color.accent.amberDark }} />
          }
          title="Itineraries"
          count={itineraries.length}
        />

        {itineraries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: color.text.faint,
            }}
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
                  background: color.bg.card,
                  border: `1px solid ${color.border.default}`,
                  borderRadius: radius.lg,
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
                      color: color.text.primary,
                    }}
                  >
                    {doc.name}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: color.text.faint,
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
                        borderRadius: radius.pill,
                        background: color.bg.blueLight,
                        color: color.accent.blueDark,
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
                      borderRadius: radius.pill,
                      background: color.bg.amberLight,
                      color: color.accent.amberDeep,
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
                        borderRadius: radius.pill,
                        background: color.bg.greenLight,
                        color: color.accent.greenDark,
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
                      background: color.accent.blue,
                      color: color.text.inverse,
                      borderRadius: radius.sm,
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
                      background: color.bg.subtle,
                      border: `1px solid ${color.border.strong}`,
                      borderRadius: radius.sm,
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
                        background: color.bg.redLight,
                        border: `1px solid ${color.border.red}`,
                        borderRadius: radius.sm,
                        fontSize: 12,
                        cursor: "pointer",
                        color: color.accent.red,
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
