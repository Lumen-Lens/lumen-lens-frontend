import type { Language } from "../types/api";

export interface GenerationRecord {
  id: string;
  filename: string;
  contractName: string;
  language: Language;
  fileCount: number;
  createdAt: string;
}

export const HISTORY_KEY = "lumen-lens:generations:v1";
export const HISTORY_EVENT = "lumen-lens:history-changed";
export const HISTORY_LIMIT = 20;

/** Store metadata only: uploaded contracts and generated source stay out of storage. */
export function readHistory(storage: Pick<Storage, "getItem">): GenerationRecord[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(HISTORY_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is GenerationRecord =>
      item !== null && typeof item === "object" &&
      typeof item.id === "string" && typeof item.filename === "string" &&
      typeof item.contractName === "string" &&
      ["typescript", "go", "python", "dart"].includes(item.language) &&
      Number.isInteger(item.fileCount) && item.fileCount >= 0 &&
      typeof item.createdAt === "string" && Number.isFinite(Date.parse(item.createdAt))
    ).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveGeneration(storage: Pick<Storage, "getItem" | "setItem">, record: GenerationRecord): boolean {
  try {
    storage.setItem(HISTORY_KEY, JSON.stringify([record, ...readHistory(storage)].slice(0, HISTORY_LIMIT)));
    return true;
  } catch {
    return false;
  }
}
