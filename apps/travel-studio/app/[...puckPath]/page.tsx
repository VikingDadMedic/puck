import { Metadata } from "next";
import { resolvePath } from "../../lib/resolve-path";
import { getDocumentRecord, cloneAndReId } from "../../lib/get-document";
import { ensureEnvValidated } from "../../lib/api";
import { Client } from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}): Promise<Metadata> {
  const { puckPath } = await params;
  const { isEdit, path } = resolvePath(puckPath);

  return {
    title: isEdit
      ? `Editing: ${path} | Travel Studio`
      : `${path} | Travel Studio`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ puckPath: string[] }>;
  searchParams: Promise<{
    title?: string;
    mode?: string;
    templatePath?: string;
  }>;
}) {
  ensureEnvValidated();

  const { puckPath } = await params;
  const {
    title: initialTitle,
    mode: initialMode,
    templatePath,
  } = await searchParams;
  const { isEdit, path } = resolvePath(puckPath);
  const { puck, version } = getDocumentRecord(path);

  let data = puck;

  if (isEdit && version === 0 && templatePath) {
    const { puck: templateData } = getDocumentRecord(templatePath);
    data = cloneAndReId(templateData, {
      title: initialTitle || undefined,
      documentType: "itinerary",
    });
  } else if (isEdit && version === 0 && (initialTitle || initialMode)) {
    const existingRoot = (data?.root ?? {}) as Record<string, unknown>;
    const existingProps = (existingRoot.props as Record<string, unknown>) ?? {};
    data = {
      ...data,
      root: {
        ...existingRoot,
        props: {
          ...existingProps,
          ...(initialTitle ? { title: initialTitle } : {}),
          ...(initialMode ? { documentMode: initialMode } : {}),
        },
      },
    } as typeof data;
  }

  return (
    <Client isEdit={isEdit} path={path} data={data} documentVersion={version} />
  );
}

export const dynamic = "force-dynamic";
