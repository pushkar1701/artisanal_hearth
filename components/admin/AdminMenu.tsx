"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dish } from "@/lib/menu-store";
import { DAILY_MENU_MAX_DISHES } from "@/lib/menu-constants";
import { saveMenuAction } from "@/app/admin/actions";

function newId() {
  return `d_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Split tags on comma only when saving — keeps raw typing (commas) in the field */
function tagsStringToArray(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function AdminMenu() {
  const [password, setPassword] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
  /** Parallel to dishes — free text so commas can be typed; parsed on save */
  const [tagsInput, setTagsInput] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/menu");
    const data = await r.json();
    const list: Dish[] = data.dishes ?? [];
    setDishes(list);
    setTagsInput(list.map((d) => (d.tags ?? []).join(", ")));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  function update(i: number, patch: Partial<Dish>) {
    setDishes((prev) => prev.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  }

  function remove(i: number) {
    setDishes((prev) => prev.filter((_, j) => j !== i));
    setTagsInput((prev) => prev.filter((_, j) => j !== i));
  }

  function add() {
    if (dishes.length >= DAILY_MENU_MAX_DISHES) return;
    setDishes((prev) => [
      ...prev,
      {
        id: newId(),
        name: "New dish",
        priceInr: 199,
        quantityAvailable: 10,
        tags: [],
        description: "",
      },
    ]);
    setTagsInput((prev) => [...prev, ""]);
  }

  function setTagsAt(index: number, value: string) {
    setTagsInput((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function save() {
    setMessage(null);
    const payload: Dish[] = dishes.map((d, i) => ({
      ...d,
      priceInr: Number.isFinite(d.priceInr) ? d.priceInr : 0,
      quantityAvailable: Number.isFinite(d.quantityAvailable) ? d.quantityAvailable : 0,
      tags: tagsStringToArray(tagsInput[i] ?? ""),
    }));
    try {
      const res = await saveMenuAction(password, payload);
      if (res.ok) {
        setMessage({ kind: "ok", text: "Saved. Daily menu is updated for customers." });
        await load();
      } else {
        setMessage({ kind: "err", text: res.error ?? "Save failed." });
      }
    } catch {
      setMessage({ kind: "err", text: "Save failed (network or server error)." });
    }
  }

  if (loading) {
    return <p className="text-ah-on-surface-variant">Loading menu…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
        <strong>Admin password</strong> is set via <code className="rounded bg-white px-1">ADMIN_SECRET</code>{" "}
        in your environment. On Vercel, connect Upstash Redis so admin saves persist across deployments.
        Without KV env vars, it falls back to local <code className="mx-1 rounded bg-white px-1">data/menu.json</code>.
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
            Admin password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block rounded-t-md border-none bg-ah-surface-high px-4 py-2"
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-gradient-to-r from-ah-primary to-ah-primary-container px-6 py-2.5 font-bold text-white"
        >
          Save all dishes
        </button>
      </div>
      {message && (
        <p
          role="alert"
          className={`text-sm font-medium ${message.kind === "ok" ? "text-emerald-800" : "text-ah-error"}`}
        >
          {message.text}
        </p>
      )}

      <p className="text-sm text-ah-on-surface-variant">
        Daily menu: <strong>{dishes.length}</strong> / {DAILY_MENU_MAX_DISHES} dishes (maximum customers can
        choose from per day).
      </p>

      <div className="overflow-x-auto rounded-xl border border-ah-outline-variant/40">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ah-surface-low text-xs uppercase tracking-wider text-ah-on-surface-variant">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Price ₹</th>
              <th className="px-3 py-3">Qty</th>
              <th className="px-3 py-3 min-w-[280px]">Tags (comma-separated)</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {dishes.map((d, i) => (
              <tr key={d.id} className="border-t border-ah-outline-variant/30">
                <td className="px-3 py-2">
                  <input
                    value={d.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    className="w-full rounded border border-transparent bg-white px-2 py-1 focus:border-ah-primary"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={d.priceInr}
                    onChange={(e) => update(i, { priceInr: Number(e.target.value) })}
                    className="w-24 rounded border border-transparent bg-white px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={d.quantityAvailable}
                    onChange={(e) => update(i, { quantityAvailable: Number(e.target.value) })}
                    className="w-20 rounded border border-transparent bg-white px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={tagsInput[i] ?? ""}
                    onChange={(e) => setTagsAt(i, e.target.value)}
                    className="w-full min-w-[280px] rounded border border-transparent bg-white px-2 py-2 text-sm"
                    spellCheck={false}
                    autoComplete="off"
                    placeholder="e.g. High protein, Less oil, Veg"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={d.description ?? ""}
                    onChange={(e) => update(i, { description: e.target.value })}
                    className="w-full min-w-[200px] rounded border border-transparent bg-white px-2 py-2 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => remove(i)} className="text-ah-error hover:underline">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={add}
        disabled={dishes.length >= DAILY_MENU_MAX_DISHES}
        className="rounded-xl border-2 border-dashed border-ah-outline-variant px-4 py-3 font-semibold text-ah-primary hover:bg-ah-surface-low disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dishes.length >= DAILY_MENU_MAX_DISHES
          ? `Daily menu full (${DAILY_MENU_MAX_DISHES} dishes)`
          : "+ Add dish"}
      </button>
    </div>
  );
}
