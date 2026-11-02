"use client";

import { useEffect, useState } from "react";
import { HISTORY_EVENT, HISTORY_KEY, readHistory, type GenerationRecord } from "@/lib/history";

export function RecentGenerations() {
  const [records, setRecords] = useState<GenerationRecord[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => {
      try { setRecords(readHistory(window.localStorage)); }
      catch { setError("Generation history is unavailable in this browser."); }
    };
    refresh();
    window.addEventListener(HISTORY_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HISTORY_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const clear = () => {
    try {
      window.localStorage.removeItem(HISTORY_KEY);
      setRecords([]);
      window.dispatchEvent(new Event(HISTORY_EVENT));
    } catch { setError("Unable to clear browser history."); }
  };

  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-white text-lg">Recent Generations</h2>
        {records.length > 0 && <button className="btn-ghost text-sm" onClick={clear}>Clear history</button>}
      </div>
      <p className="text-gray-500 text-sm">Last 20 successful generations on this browser. Only metadata is saved; contract binaries and SDK source are never stored in history.</p>
      {error && <p role="status" className="text-amber-400 text-sm">{error}</p>}
      {records.length === 0 ? <p className="text-gray-400 text-sm">No SDKs generated yet. Upload a Soroban contract to get started.</p> : (
        <ul className="divide-y divide-gray-800">
          {records.map((record) => (
            <li key={record.id} className="py-3 flex flex-wrap justify-between gap-2 text-sm">
              <div><p className="text-white break-all">{record.filename}</p><p className="text-gray-400">{record.contractName} · {record.language} · {record.fileCount} files</p></div>
              <time className="text-gray-500" dateTime={record.createdAt}>{new Date(record.createdAt).toLocaleString()}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
