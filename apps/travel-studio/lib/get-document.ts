import { Data } from "@/core";
import fs from "fs";
import path from "path";
import { seedData } from "../config/seed-data";

const DB_PATH = path.join(process.cwd(), "travel-data.json");

export function getDocument(docPath: string): Partial<Data> {
  if (fs.existsSync(DB_PATH)) {
    const allData: Record<string, Data> = JSON.parse(
      fs.readFileSync(DB_PATH, "utf-8")
    );
    if (allData[docPath]) return allData[docPath];
  }

  return seedData[docPath] || {};
}
