"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { WasmDropzone } from "@/components/ui/WasmDropzone";
import { SpecExplorer } from "./SpecExplorer";
import { api, fileToBase64 } from "@/lib/api";
import type { InspectResponse } from "@/types/api";

export function InspectView() {
  const [wasmFile, setWasmFile] = useState<File | null>(null);

  const mutation = useMutation<InspectResponse, Error>({
    mutationFn: async () => {
      if (!wasmFile) throw new Error("No WASM file selected");
      const wasm_base64 = await fileToBase64(wasmFile);
      return api.inspect({ wasm_base64 });
    },
  });

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <WasmDropzone
          label={wasmFile ? wasmFile.name : "Drop .wasm to inspect"}
          onFile={setWasmFile}
        />
        <button
          className="btn-primary flex items-center gap-2"
          disabled={!wasmFile || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Inspect
        </button>
      </div>

      {mutation.isError && (
        <p className="text-red-400 text-sm">{mutation.error.message}</p>
      )}
      {mutation.data && <SpecExplorer spec={mutation.data.spec} />}
    </div>
  );
}
