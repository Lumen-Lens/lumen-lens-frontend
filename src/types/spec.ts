/**
 * Mirror of the wasm-parser IR types — kept in sync manually or generated
 * via `lumenlens inspect` + a JSON-to-TypeScript schema tool.
 */

export interface ContractSpec {
  name: string;
  version: string | null;
  functions: FunctionSpec[];
  structs: StructSpec[];
  enums: EnumSpec[];
  error_enums: ErrorEnumSpec[];
}

export interface FunctionSpec {
  name: string;
  doc: string | null;
  inputs: ParamSpec[];
  outputs: TypeSpec[];
}

export interface ParamSpec {
  name: string;
  doc: string | null;
  type_spec: TypeSpec;
}

export interface StructSpec {
  name: string;
  doc: string | null;
  fields: FieldSpec[];
}

export interface FieldSpec {
  name: string;
  doc: string | null;
  type_spec: TypeSpec;
}

export interface EnumSpec {
  name: string;
  doc: string | null;
  cases: EnumCase[];
}

export interface EnumCase {
  name: string;
  doc: string | null;
  value: number;
}

export interface ErrorEnumSpec {
  name: string;
  doc: string | null;
  cases: ErrorCase[];
}

export interface ErrorCase {
  name: string;
  doc: string | null;
  value: number;
}

export type TypeSpec =
  | { kind: "void" }
  | { kind: "bool" }
  | { kind: "u32" }
  | { kind: "i32" }
  | { kind: "u64" }
  | { kind: "i64" }
  | { kind: "u128" }
  | { kind: "i128" }
  | { kind: "bytes" }
  | { kind: "bytes_n"; n: number }
  | { kind: "string" }
  | { kind: "symbol" }
  | { kind: "address" }
  | { kind: "vec"; element: TypeSpec }
  | { kind: "map"; key: TypeSpec; value: TypeSpec }
  | { kind: "option"; inner: TypeSpec }
  | { kind: "result"; ok: TypeSpec; err: TypeSpec }
  | { kind: "named"; name: string }
  | { kind: "unknown"; raw: string };

/** Human-readable string for a TypeSpec. */
export function typeSpecToString(t: TypeSpec): string {
  switch (t.kind) {
    case "void": return "void";
    case "bool": return "bool";
    case "u32": return "u32";
    case "i32": return "i32";
    case "u64": return "u64";
    case "i64": return "i64";
    case "u128": return "u128";
    case "i128": return "i128";
    case "bytes": return "Bytes";
    case "bytes_n": return `BytesN<${t.n}>`;
    case "string": return "String";
    case "symbol": return "Symbol";
    case "address": return "Address";
    case "vec": return `Vec<${typeSpecToString(t.element)}>`;
    case "map": return `Map<${typeSpecToString(t.key)}, ${typeSpecToString(t.value)}>`;
    case "option": return `Option<${typeSpecToString(t.inner)}>`;
    case "result": return `Result<${typeSpecToString(t.ok)}, ${typeSpecToString(t.err)}>`;
    case "named": return t.name;
    case "unknown": return t.raw;
    default: return "?";
  }
}
