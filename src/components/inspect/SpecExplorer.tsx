"use client";

import type { ContractSpec } from "@/types/spec";
import { typeSpecToString } from "@/types/spec";

interface Props {
  spec: ContractSpec;
}

export function SpecExplorer({ spec }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card space-y-1">
        <h3 className="font-semibold text-white text-lg">{spec.name}</h3>
        {spec.version && (
          <p className="text-gray-400 text-sm">Version: {spec.version}</p>
        )}
        <div className="flex gap-4 text-sm text-gray-500 pt-1">
          <span>{spec.functions.length} function{spec.functions.length !== 1 ? "s" : ""}</span>
          <span>{spec.structs.length} struct{spec.structs.length !== 1 ? "s" : ""}</span>
          <span>{spec.enums.length} enum{spec.enums.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Functions */}
      {spec.functions.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Functions
          </h4>
          {spec.functions.map((fn) => (
            <div key={fn.name} className="card space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-brand-400 font-semibold">
                  {fn.name}
                </span>
                {fn.outputs.length > 0 && (
                  <span className="text-xs text-gray-500">
                    → {typeSpecToString(fn.outputs[0])}
                  </span>
                )}
              </div>
              {fn.doc && (
                <p className="text-gray-400 text-sm">{fn.doc}</p>
              )}
              {fn.inputs.length > 0 && (
                <ul className="space-y-0.5 pl-3 border-l border-gray-700">
                  {fn.inputs.map((p) => (
                    <li key={p.name} className="text-sm">
                      <span className="font-mono text-gray-300">{p.name}</span>
                      <span className="text-gray-600">: </span>
                      <span className="text-gray-400 font-mono">
                        {typeSpecToString(p.type_spec)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Structs */}
      {spec.structs.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Structs
          </h4>
          {spec.structs.map((s) => (
            <div key={s.name} className="card space-y-2">
              <span className="font-mono text-purple-400 font-semibold">{s.name}</span>
              <ul className="space-y-0.5 pl-3 border-l border-gray-700">
                {s.fields.map((f) => (
                  <li key={f.name} className="text-sm">
                    <span className="font-mono text-gray-300">{f.name}</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-gray-400 font-mono">
                      {typeSpecToString(f.type_spec)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Enums */}
      {spec.enums.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Enums
          </h4>
          {spec.enums.map((e) => (
            <div key={e.name} className="card space-y-2">
              <span className="font-mono text-yellow-400 font-semibold">{e.name}</span>
              <ul className="flex flex-wrap gap-2">
                {e.cases.map((c) => (
                  <li key={c.name} className="badge bg-gray-800 text-gray-300">
                    {c.name} = {c.value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
