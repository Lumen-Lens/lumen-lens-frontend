import type { ContractSpec } from "./spec";

export type Language = "typescript" | "go" | "python" | "dart";

export interface GenerateRequest {
  /** Base64-encoded WASM binary. */
  wasm_base64: string;
  language: Language;
  include_mocks: boolean;
  contract_name?: string;
}

export interface GenerateResponse {
  files: { path: string; content: string }[];
  spec: ContractSpec;
}

export interface DiffRequest {
  old_wasm_base64: string;
  new_wasm_base64: string;
}

export interface DiffResponse {
  contract_name: string;
  old_version: string | null;
  new_version: string | null;
  changes: DiffChange[];
  has_breaking_changes: boolean;
}

export interface DiffChange {
  kind: string;
  breaking: boolean;
  description: string;
}

export interface InspectRequest {
  wasm_base64: string;
}

export interface InspectResponse {
  spec: ContractSpec;
}
