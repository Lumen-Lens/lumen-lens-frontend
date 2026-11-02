"use client";

import { useRef, useId, useState } from "react";
import { UploadCloud } from "lucide-react";
import { validateWasm } from "@/lib/wasm";
import { clsx } from "clsx";

interface Props {
  label?: string;
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function WasmDropzone({ label = "Drop WASM here", onFile, disabled = false }: Props) {
  const [dragging, setDragging] = useState(false);

  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const selection = useRef(0);
  const messageId = useId();

  const selectFiles = async (files: FileList | null) => {
    const current = ++selection.current;
    if (disabled || !files?.length) return;
    setError("");
    setValidating(true);
    try {
      if (files.length !== 1) throw new Error("Choose one contract file at a time.");
      const file = files[0];
      await validateWasm(file);
      if (current === selection.current) onFile(file);
    } catch (cause) {
      if (current === selection.current) setError(cause instanceof Error ? cause.message : "Unable to read this file.");
    } finally {
      if (current === selection.current) setValidating(false);
    }
  };

  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors",
        dragging
          ? "border-brand-500 bg-brand-900/20"
          : "border-gray-700 hover:border-gray-500 bg-gray-900/40 focus-within:ring-2 focus-within:ring-brand-500"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void selectFiles(e.dataTransfer.files);
      }}
    >
      <UploadCloud className="w-8 h-8 text-gray-500" />
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-xs text-gray-600">{validating ? "Checking file…" : "or click to browse · .wasm · up to 10 MiB"}</span>
      <span id={messageId} role="status" className="text-sm text-red-400">{error}</span>
      <input
        type="file"
        disabled={disabled}
        aria-label="Choose a WebAssembly contract"
        aria-describedby={messageId}
        aria-invalid={Boolean(error)}
        accept=".wasm"
        className="sr-only"
        onChange={(e) => {
          void selectFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </label>
  );
}
