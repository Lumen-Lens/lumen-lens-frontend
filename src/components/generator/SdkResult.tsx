"use client";

import { useState } from "react";
import { createSdkArchive } from "@/lib/archive";
import { Download } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import type { GenerateResponse } from "@/types/api";
import type { Language } from "@/types/api";

interface Props {
  data: GenerateResponse;
  language: Language;
}

const LANGUAGE_HIGHLIGHT_MAP: Record<Language, string> = {
  typescript: "typescript",
  go: "go",
  python: "python",
  dart: "dart",
};

export function SdkResult({ data, language }: Props) {
  const [selectedFile, setSelectedFile] = useState(0);
  const file = data.files[selectedFile];

  const [error, setError] = useState("");
  const downloadAll = () => {
    setError("");
    try {
      const archive = createSdkArchive(data.files);
      const blob = new Blob([archive], { type: "application/x-tar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = data.spec.name.replace(/[^a-zA-Z0-9_-]/g, "_") || "contract";
      a.download = `${name}-${language}-sdk.tar`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to download the SDK.");
    }
  };

  return (
    <div className="space-y-4 border-t border-gray-800 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">
          Generated {language} SDK
          <span className="ml-2 text-sm text-gray-400">
            ({data.files.length} file{data.files.length !== 1 ? "s" : ""})
          </span>
        </h3>
        <button disabled={data.files.length === 0} onClick={downloadAll} className="btn-ghost text-sm flex items-center gap-1">
          <Download className="w-4 h-4" />
          Download SDK (.tar)
        </button>
      </div>

      {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
      {data.files.length === 0 && <p role="status" className="text-gray-400 text-sm">The server returned no SDK files.</p>}
      {/* File tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {data.files.map((f, i) => (
          <button
            key={f.path}
            onClick={() => setSelectedFile(i)}
            className={`text-xs px-3 py-1.5 rounded-md font-mono whitespace-nowrap transition-colors ${
              i === selectedFile
                ? "bg-gray-700 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f.path}
          </button>
        ))}
      </div>

      {file && (
        <CodeBlock
          code={file.content}
          language={LANGUAGE_HIGHLIGHT_MAP[language]}
          filename={file.path}
        />
      )}
    </div>
  );
}
