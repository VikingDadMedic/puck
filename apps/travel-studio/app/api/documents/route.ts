import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "travel-data.json");

export async function POST(request: Request) {
  const payload = await request.json();

  const existingData = fs.existsSync(DB_PATH)
    ? JSON.parse(fs.readFileSync(DB_PATH, "utf-8"))
    : {};

  const updatedData = {
    ...existingData,
    [payload.path]: payload.data,
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(updatedData, null, 2));

  revalidatePath(payload.path);

  return NextResponse.json({ status: "ok" });
}
