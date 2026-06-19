import { Navbar } from "@/components/layout/Navbar";
import { InspectView } from "@/components/inspect/InspectView";

export default function InspectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 space-y-8">
        <section>
          <h1 className="text-3xl font-bold text-white mb-2">
            Contract Inspector
          </h1>
          <p className="text-gray-400">
            Explore the parsed spec of any Soroban contract WASM.
          </p>
        </section>
        <InspectView />
      </main>
    </div>
  );
}
