"use client";

import type { Data } from "@/core";
import { Puck, Render, createUsePuck } from "@/core";
import config from "../../config";
import {
  Save,
  Eye,
  Check,
  AlertTriangle,
  Loader2,
  X,
  Home,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { travelStudioApiHeaders } from "../../config/travel-studio-fetch";

const usePuck = createUsePuck();

type SaveStatus = "idle" | "saving" | "saved" | "dirty" | "error" | "conflict";

type ToastMessage = {
  id: number;
  text: string;
  variant: "success" | "error" | "warning";
};

let toastIdCounter = 0;

function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (text: string, variant: ToastMessage["variant"] = "success") => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, text, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  const colors: Record<
    ToastMessage["variant"],
    { bg: string; border: string }
  > = {
    success: { bg: "#f0fdf4", border: "#86efac" },
    error: { bg: "#fef2f2", border: "#fca5a5" },
    warning: { bg: "#fffbeb", border: "#fcd34d" },
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 360,
      }}
    >
      {toasts.map((t) => {
        const c = colors[t.variant];
        return (
          <div
            key={t.id}
            style={{
              padding: "10px 14px",
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ flex: 1 }}>{t.text}</span>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                lineHeight: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ConflictModal({
  onReload,
  onForceSave,
  onDismiss,
}: {
  onReload: () => void;
  onForceSave: () => void;
  onDismiss: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      aria-describedby="conflict-modal-desc"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onDismiss();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <AlertTriangle size={20} style={{ color: "#d97706" }} />
          <h3
            id="conflict-modal-title"
            style={{ margin: 0, fontSize: 16, fontWeight: 600 }}
          >
            Save Conflict
          </h3>
        </div>
        <p
          id="conflict-modal-desc"
          style={{ margin: "0 0 20px", fontSize: 14, color: "#4b5563" }}
        >
          This document was modified elsewhere since you last loaded it. You can
          reload the latest version (your unsaved changes will be lost) or force
          save to overwrite the remote version.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            ref={cancelRef}
            type="button"
            onClick={onDismiss}
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
            onClick={onReload}
            style={{
              padding: "8px 16px",
              border: "1px solid #2563eb",
              borderRadius: 6,
              background: "#eff6ff",
              color: "#1d4ed8",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Reload Latest
          </button>
          <button
            type="button"
            onClick={onForceSave}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              background: "#dc2626",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Force Save
          </button>
        </div>
      </div>
    </div>
  );
}

function SaveStatusBadge({ status }: { status: SaveStatus }) {
  const map: Record<
    SaveStatus,
    { label: string; icon: ReactNode; color: string }
  > = {
    idle: { label: "", icon: null, color: "transparent" },
    saving: {
      label: "Saving...",
      icon: (
        <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
      ),
      color: "#6b7280",
    },
    saved: {
      label: "Saved",
      icon: <Check size={12} />,
      color: "#059669",
    },
    dirty: {
      label: "Unsaved changes",
      icon: <AlertTriangle size={12} />,
      color: "#d97706",
    },
    error: {
      label: "Save failed",
      icon: <AlertTriangle size={12} />,
      color: "#dc2626",
    },
    conflict: {
      label: "Conflict",
      icon: <AlertTriangle size={12} />,
      color: "#dc2626",
    },
  };

  const entry = map[status];
  if (!entry.label) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        color: entry.color,
        fontWeight: 500,
      }}
    >
      {entry.icon}
      {entry.label}
    </span>
  );
}

const AUTOSAVE_DELAY_MS = 4000;

function dataFingerprint(data: unknown): string {
  return JSON.stringify(data);
}

function HeaderActions({
  path,
  version,
  setVersion,
  saveStatus,
  setSaveStatus,
  addToast,
  setShowConflict,
  doSaveRef,
}: {
  path: string;
  version: number;
  setVersion: (v: number) => void;
  saveStatus: SaveStatus;
  setSaveStatus: (s: SaveStatus) => void;
  addToast: (text: string, variant: ToastMessage["variant"]) => void;
  setShowConflict: (v: boolean) => void;
  doSaveRef: React.MutableRefObject<(forceVersion?: number) => Promise<void>>;
}) {
  const appState = usePuck((s) => s.appState);
  const lastSavedRef = useRef<string>(dataFingerprint(appState.data));
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const doSave = useCallback(
    async (forceVersion?: number) => {
      if (!isMountedRef.current) return;
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...travelStudioApiHeaders(),
          },
          body: JSON.stringify({
            data: appState.data,
            path,
            expectedVersion: forceVersion ?? version,
          }),
        });
        if (!isMountedRef.current) return;

        if (res.status === 409) {
          setSaveStatus("conflict");
          setShowConflict(true);
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg =
            (body as { error?: { message?: string } })?.error?.message ||
            "Save failed";
          setSaveStatus("error");
          addToast(msg, "error");
          return;
        }

        const body = (await res.json()) as { version?: number };
        if (typeof body.version === "number") setVersion(body.version);
        lastSavedRef.current = dataFingerprint(appState.data);
        setSaveStatus("saved");
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus("idle");
          }
        }, 2000);
      } catch {
        if (!isMountedRef.current) return;
        setSaveStatus("error");
        addToast("Network error while saving", "error");
      }
    },
    [
      appState.data,
      path,
      version,
      setVersion,
      setSaveStatus,
      addToast,
      setShowConflict,
    ]
  );

  useEffect(() => {
    doSaveRef.current = doSave;
  }, [doSave, doSaveRef]);

  useEffect(() => {
    const current = dataFingerprint(appState.data);
    if (current !== lastSavedRef.current) {
      if (saveStatus !== "saving" && saveStatus !== "conflict") {
        setSaveStatus("dirty");
      }

      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        if (isMountedRef.current && saveStatus !== "saving") {
          doSave();
        }
      }, AUTOSAVE_DELAY_MS);
    }

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [appState.data, doSave, saveStatus, setSaveStatus]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <a
        href="/"
        title="Back to Dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          borderRadius: 6,
          color: "#6b7280",
          textDecoration: "none",
        }}
      >
        <Home size={16} />
      </a>
      <SaveStatusBadge status={saveStatus} />
      <button
        type="button"
        onClick={() => doSave()}
        disabled={saveStatus === "saving"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 12px",
          background: "#f1f5f9",
          border: "1px solid #cbd5e1",
          borderRadius: 6,
          cursor: saveStatus === "saving" ? "default" : "pointer",
          fontSize: 13,
          opacity: saveStatus === "saving" ? 0.6 : 1,
        }}
      >
        <Save size={14} />
        {saveStatus === "saving" ? "Saving..." : "Save"}
      </button>
      <a
        href={path}
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
          cursor: "pointer",
          fontSize: 13,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Eye size={14} />
        Preview
      </a>
    </div>
  );
}

export function Client({
  path,
  isEdit,
  data,
  documentVersion,
}: {
  path: string;
  isEdit: boolean;
  data: Partial<Data>;
  documentVersion: number;
}) {
  const [version, setVersion] = useState(documentVersion);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showConflict, setShowConflict] = useState(false);
  const { toasts, addToast, dismissToast } = useToasts();
  const doSaveRef = useRef<(forceVersion?: number) => Promise<void>>(
    async () => {}
  );
  const rootProps = (data?.root as { props?: Record<string, unknown> })?.props;
  const documentMode = (rootProps?.documentMode as string) || "itinerary";
  const metadata = { target: documentMode };

  useEffect(() => {
    if (!isEdit) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === "dirty" || saveStatus === "error") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isEdit, saveStatus]);

  const handleReload = useCallback(() => {
    setShowConflict(false);
    window.location.reload();
  }, []);

  const handleForceSave = useCallback(async () => {
    setShowConflict(false);
    try {
      const res = await fetch(
        `/api/documents?path=${encodeURIComponent(path)}`,
        { headers: travelStudioApiHeaders() }
      );
      if (res.ok) {
        const body = (await res.json()) as {
          documents?: { version?: number }[];
        };
        const serverVersion = body.documents?.[0]?.version ?? version;
        setVersion(serverVersion);
        await doSaveRef.current(serverVersion);
      } else {
        addToast("Could not fetch latest version", "error");
      }
    } catch {
      addToast("Could not fetch latest version", "error");
    }
  }, [path, version, addToast]);

  if (isEdit) {
    return (
      <>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <Puck
          config={config}
          data={data}
          onPublish={async (publishData: Data) => {
            try {
              const res = await fetch("/api/documents", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...travelStudioApiHeaders(),
                },
                body: JSON.stringify({
                  data: publishData,
                  path,
                  expectedVersion: version,
                }),
              });
              if (res.status === 409) {
                setShowConflict(true);
                return;
              }
              if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                const msg =
                  (body as { error?: { message?: string } })?.error?.message ||
                  "Publish failed";
                addToast(msg, "error");
                return;
              }
              const body = (await res.json()) as { version?: number };
              if (typeof body.version === "number") setVersion(body.version);
              addToast("Published successfully", "success");
            } catch {
              addToast("Network error while publishing", "error");
            }
          }}
          overrides={{
            headerActions: () => (
              <HeaderActions
                path={path}
                version={version}
                setVersion={setVersion}
                saveStatus={saveStatus}
                setSaveStatus={setSaveStatus}
                addToast={addToast}
                setShowConflict={setShowConflict}
                doSaveRef={doSaveRef}
              />
            ),
          }}
          headerPath={path}
          metadata={metadata}
        />
        {showConflict && (
          <ConflictModal
            onReload={handleReload}
            onForceSave={handleForceSave}
            onDismiss={() => setShowConflict(false)}
          />
        )}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return <Render config={config} data={data} metadata={metadata} />;
}
