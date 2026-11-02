/** Create an uncompressed POSIX tar archive without browser download dependencies. */
export function createSdkArchive(files: { path: string; content: string }[]) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const paths = new Set<string>();
  for (const file of files) {
    const path = file.path.replace(/\\/g, "/");
    if (!path || path.startsWith("/") || path.includes(":") ||
        path.split("/").some((part) => !part || part === "." || part === "..") ||
        /[\x00-\x1f\x7f]/.test(path) || paths.has(path)) {
      throw new Error("The SDK contains an unsafe or duplicate file path.");
    }
    paths.add(path);
    let name = path;
    let prefix = "";
    if (encoder.encode(name).length > 100) {
      const split = path.lastIndexOf("/");
      prefix = path.slice(0, split);
      name = path.slice(split + 1);
      if (split < 0 || encoder.encode(prefix).length > 155 || encoder.encode(name).length > 100) {
        throw new Error("An SDK file path is too long to archive.");
      }
    }
    const content = encoder.encode(file.content);
    const header = new Uint8Array(512);
    const write = (offset: number, value: string) => header.set(encoder.encode(value), offset);
    const octal = (value: number, width: number) => value.toString(8).padStart(width - 1, "0") + "\0";
    write(0, name);
    write(100, octal(0o644, 8));
    write(108, octal(0, 8));
    write(116, octal(0, 8));
    write(124, octal(content.length, 12));
    write(136, octal(0, 12));
    write(148, "        ");
    write(156, "0");
    write(257, "ustar\0");
    write(263, "00");
    write(345, prefix);
    write(148, header.reduce((sum, byte) => sum + byte, 0).toString(8).padStart(6, "0") + "\0 ");
    chunks.push(header, content, new Uint8Array((512 - content.length % 512) % 512));
  }
  chunks.push(new Uint8Array(1024));
  const archive = new Uint8Array(chunks.reduce((size, chunk) => size + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    archive.set(chunk, offset);
    offset += chunk.length;
  }
  return archive;
}
