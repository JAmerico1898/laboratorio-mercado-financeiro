"use client";

import { useState } from "react";
import type { DetailTable } from "@/data/gestao-credito-cenarios/types";

function StatementTable({ statement }: { statement: DetailTable }) {
  return (
    <div className="overflow-x-auto">
      <div className="mb-2 text-sm font-semibold text-primary">{statement.title}</div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {statement.columns.map((c, i) => (
              <th
                key={i}
                className="border border-outline-variant bg-surface-container px-3 py-2 text-left font-semibold text-on-surface"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statement.rows.map((row, ri) => (
            <tr key={ri} className={row.emphasis ? "font-semibold" : ""}>
              <td className="border border-outline-variant px-3 py-2 text-on-surface">{row.label}</td>
              {row.values.map((v, vi) => (
                <td key={vi} className="border border-outline-variant px-3 py-2 text-on-surface-variant">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {statement.note && (
        <p className="mt-2 text-xs text-on-surface-variant">{statement.note}</p>
      )}
    </div>
  );
}

export default function CollapsibleStatements({
  details,
  label,
}: {
  details: DetailTable[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  if (details.length === 0) return null;
  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
          {label}
        </span>
        <span className="material-symbols-outlined text-primary">{open ? "remove" : "add"}</span>
      </button>
      {open && (
        <div className="space-y-6 border-t border-outline-variant px-6 py-5">
          {details.map((s) => (
            <StatementTable key={s.id} statement={s} />
          ))}
        </div>
      )}
    </section>
  );
}
