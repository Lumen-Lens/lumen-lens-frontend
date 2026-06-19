import { Navbar } from "@/components/layout/Navbar";
import { DiffView } from "@/components/diff/DiffView";

export default function DiffPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-bold text-white mb-2">
            Interface Diff
          </h1>
          <p className="text-gray-400">
            Upload two WASM files to see breaking changes between contract versions.
          </p>
        </section>
        <DiffView />
      </main>
    </div>
  );
}
