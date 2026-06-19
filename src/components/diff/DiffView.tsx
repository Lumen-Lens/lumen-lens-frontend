"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { WasmDropzone } from "@/components/ui/WasmDropzone";
import { DiffReport } from "./DiffReport";
import { api, fileToBase64 } from "@/lib/api";
import type { DiffResponse } from "@/types/api";

export function DiffView() {
  const [oldFile, setOldFile] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  const mutation = useMutation<DiffResponse, Error>({
    mutationFn: async () => {
      if (!oldFile || !newFile) throw new Error("Both WASM files are required");
      const [old_wasm_base64, new_wasm_base64] = await Promise.all([
        fileToBase64(oldFile),
        fileToBase64(newFile),
      ]);
      return api.diff({ old_wasm_base64, new_wasm_base64 });
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="card space-y-3">
          <p className="text-sm text-gray-400 font-medium">Old version</p>
          <WasmDropzone
            label={oldFile ? oldFile.name : "Old .wasm"}
            onFile={setOldFile}
          />
        </div>
        <div className="card space-y-3">
          <p className="text-sm text-gray-400 font-medium">New version</p>
          <WasmDropzone
            label={newFile ? newFile.name : "New .wasm"}
            onFile={setNewFile}
          />
        </div>
      </div>

      <button
        className="btn-primary flex items-center gap-2"
        disabled={!oldFile || !newFile || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        Compare
      </button>

      {mutation.isError && (
        <p className="text-red-400 text-sm">{mutation.error.message}</p>
      )}
      {mutation.data && <DiffReport report={mutation.data} />}
    </div>
  );
}
