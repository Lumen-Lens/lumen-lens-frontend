import axios from "axios";
import type {
  DiffRequest,
  DiffResponse,
  GenerateRequest,
  GenerateResponse,
  InspectRequest,
  InspectResponse,
} from "@/types/api";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

export const api = {
  generate: (req: GenerateRequest) =>
    client.post<GenerateResponse>("/generate", req).then((r) => r.data),

  diff: (req: DiffRequest) =>
    client.post<DiffResponse>("/diff", req).then((r) => r.data),

  inspect: (req: InspectRequest) =>
    client.post<InspectResponse>("/inspect", req).then((r) => r.data),
};

/** Convert a File (browser File API) to a base64 string. */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix
      resolve(result.split(",")[1] ?? result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
