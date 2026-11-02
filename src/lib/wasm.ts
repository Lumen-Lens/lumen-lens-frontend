/** Keep uploads bounded before allocating base64 data or sending requests. */
export const MAX_WASM_BYTES = 10 * 1024 * 1024;

export async function validateWasm(file: Pick<File, "name" | "size" | "slice">): Promise<void> {
  if (!file.name.toLowerCase().endsWith(".wasm")) {
    throw new Error("Choose a .wasm contract file.");
  }
  if (file.size > MAX_WASM_BYTES) {
    throw new Error("Contract files must be 10 MiB or smaller.");
  }
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const expected = [0, 97, 115, 109, 1, 0, 0, 0];
  if (header.length !== expected.length || expected.some((byte, i) => header[i] !== byte)) {
    throw new Error("This file is not a supported WebAssembly binary (version 1).");
  }
}
