import { Metadata } from "next";
import { resolvePath } from "../../lib/resolve-path";
import { getDocumentRecord } from "../../lib/get-document";
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
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  ensureEnvValidated();

  const { puckPath } = await params;
  const { isEdit, path } = resolvePath(puckPath);
  const { puck, version } = getDocumentRecord(path);

  return (
    <Client isEdit={isEdit} path={path} data={puck} documentVersion={version} />
  );
}

export const dynamic = "force-dynamic";
