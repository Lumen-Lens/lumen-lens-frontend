"use client";

import type { DiffResponse } from "@/types/api";

interface Props {
  report: DiffResponse;
}

export function DiffReport({ report }: Props) {
  return (
    <div className="card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{report.contract_name}</h3>
        <span className="text-xs text-gray-500">
          {report.old_version ?? "?"} → {report.new_version ?? "?"}
        </span>
      </div>

      {report.changes.length === 0 ? (
        <p className="text-green-400 text-sm">✅ No interface changes detected.</p>
      ) : (
        <ul className="space-y-2">
          {report.changes.map((change, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className={change.breaking ? "badge-breaking" : "badge-safe"}>
                {change.breaking ? "BREAKING" : "safe"}
              </span>
              <span className="text-gray-300">{change.description}</span>
            </li>
          ))}
        </ul>
      )}

      {report.has_breaking_changes && (
        <p className="text-yellow-400 text-sm font-medium">
          ⚠️ Breaking changes detected — consider bumping the major version.
        </p>
      )}
    </div>
  );
}
