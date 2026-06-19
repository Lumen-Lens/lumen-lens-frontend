import { Navbar } from "@/components/layout/Navbar";
import { GeneratorForm } from "@/components/generator/GeneratorForm";
import { RecentGenerations } from "@/components/generator/RecentGenerations";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-bold text-white mb-2">
            ⚡ Lumen Lens
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Generate idiomatic typed SDKs from any Soroban contract — one
            command, four languages, zero boilerplate.
          </p>
        </section>

        <GeneratorForm />
        <RecentGenerations />
      </main>
    </div>
  );
}
