"use client";

import { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  label?: string;
  onFile: (file: File) => void;
}

export function WasmDropzone({ label = "Drop WASM here", onFile }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors",
        dragging
          ? "border-brand-500 bg-brand-900/20"
          : "border-gray-700 hover:border-gray-500 bg-gray-900/40"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <UploadCloud className="w-8 h-8 text-gray-500" />
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-xs text-gray-600">or click to browse</span>
      <input
        type="file"
        accept=".wasm"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </label>
  );
}
