"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { WasmDropzone } from "@/components/ui/WasmDropzone";
import { SdkResult } from "./SdkResult";
import { api, fileToBase64 } from "@/lib/api";
import type { Language } from "@/types/api";
import type { GenerateResponse } from "@/types/api";

const LANGUAGES: Language[] = ["typescript", "go", "python", "dart"];

export function GeneratorForm() {
  const [wasmFile, setWasmFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<Language>("typescript");
  const [includeMocks, setIncludeMocks] = useState(false);

  const mutation = useMutation<GenerateResponse, Error>({
    mutationFn: async () => {
      if (!wasmFile) throw new Error("No WASM file selected");
      const wasm_base64 = await fileToBase64(wasmFile);
      return api.generate({ wasm_base64, language, include_mocks: includeMocks });
    },
  });

  return (
    <div className="card space-y-6">
      <h2 className="font-semibold text-white text-lg">Generate SDK</h2>

      <WasmDropzone
        label={wasmFile ? wasmFile.name : "Drop your .wasm file here"}
        onFile={setWasmFile}
      />

      <div className="flex flex-wrap gap-4 items-end">
        {/* Language picker */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Target language
          </label>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  language === l
                    ? "bg-brand-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Mock toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeMocks}
            onChange={(e) => setIncludeMocks(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-brand-500"
          />
          Include mock client
        </label>

        <button
          className="btn-primary ml-auto flex items-center gap-2"
          disabled={!wasmFile || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Generate
        </button>
      </div>

      {mutation.isError && (
        <p className="text-red-400 text-sm">{mutation.error.message}</p>
      )}

      {mutation.data && <SdkResult data={mutation.data} language={language} />}
    </div>
  );
}
