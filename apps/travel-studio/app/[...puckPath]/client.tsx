"use client";

import type { Data } from "@/core";
import { Puck, Render, usePuck } from "@/core";
import config from "../../config";
import { Save, Eye } from "lucide-react";
import { useCallback, useState } from "react";

function HeaderActions({ path }: { path: string }) {
  const appState = usePuck((s) => s.appState);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    await fetch("/api/documents", {
      method: "POST",
      body: JSON.stringify({ data: appState.data, path }),
    });
    setSaving(false);
  }, [appState.data, path]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        type="button"
        onClick={handleSave}
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
        }}
      >
        <Save size={14} />
        {saving ? "Saving..." : "Save Draft"}
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
}: {
  path: string;
  isEdit: boolean;
  data: Partial<Data>;
}) {
  const rootProps = (data?.root as { props?: Record<string, unknown> })?.props;
  const documentMode = (rootProps?.documentMode as string) || "itinerary";
  const metadata = { target: documentMode };

  if (isEdit) {
    return (
      <Puck
        config={config}
        data={data}
        onPublish={async (publishData: Data) => {
          await fetch("/api/documents", {
            method: "POST",
            body: JSON.stringify({ data: publishData, path }),
          });
        }}
        overrides={{
          headerActions: () => <HeaderActions path={path} />,
        }}
        headerPath={path}
        metadata={metadata}
      />
    );
  }

  return <Render config={config} data={data} metadata={metadata} />;
}
