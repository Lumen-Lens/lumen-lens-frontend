"use client";

import { useState } from "react";
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

  const downloadAll = () => {
    // Simple individual file download — a real impl would zip them.
    data.files.forEach((f) => {
      const blob = new Blob([f.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.path.split("/").pop() ?? f.path;
      a.click();
      URL.revokeObjectURL(url);
    });
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
        <button onClick={downloadAll} className="btn-ghost text-sm flex items-center gap-1">
          <Download className="w-4 h-4" />
          Download all
        </button>
      </div>

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
