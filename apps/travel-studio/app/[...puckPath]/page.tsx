import { Metadata } from "next";
import { resolvePath } from "../../lib/resolve-path";
import { getDocument } from "../../lib/get-document";
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
  const { puckPath } = await params;
  const { isEdit, path } = resolvePath(puckPath);
  const data = getDocument(path) || {};

  return <Client isEdit={isEdit} path={path} data={data} />;
}

export const dynamic = "force-dynamic";
