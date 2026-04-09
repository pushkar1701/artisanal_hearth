"use client";

import { useCallback, useEffect, useState } from "react";
import type { MealPlan } from "@/lib/meal-plan-store";
import { saveMealPlansAction } from "@/app/admin/actions";

function newPlanId() {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function featuresToText(features: string[]): string {
  return features.join(", ");
}

function textToFeatures(text: string): string[] {
  return text
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0);
}

export function AdminMealPlans() {
  const [password, setPassword] = useState("");
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [featuresInput, setFeaturesInput] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/meal-plans");
    const data = await response.json();
    const nextPlans: MealPlan[] = data.plans ?? [];
    setPlans(nextPlans);
    setFeaturesInput(nextPlans.map((plan) => featuresToText(plan.features ?? [])));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  function update(index: number, patch: Partial<MealPlan>) {
    setPlans((prev) => prev.map((plan, i) => (i === index ? { ...plan, ...patch } : plan)));
  }

  function setFeaturesAt(index: number, value: string) {
    setFeaturesInput((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function add() {
    setPlans((prev) => [
      ...prev,
      {
        id: newPlanId(),
        name: "New plan",
        price: "₹0",
        period: "/ week",
        blurb: "",
        features: [],
        highlighted: false,
      },
    ]);
    setFeaturesInput((prev) => [...prev, ""]);
  }

  function remove(index: number) {
    setPlans((prev) => prev.filter((_, i) => i !== index));
    setFeaturesInput((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setMessage(null);
    const payload = plans.map((plan, i) => ({
      ...plan,
      features: textToFeatures(featuresInput[i] ?? ""),
    }));

    try {
      const result = await saveMealPlansAction(password, payload);
      if (result.ok) {
        setMessage({ kind: "ok", text: "Saved. Meal plans page is updated." });
        await load();
      } else {
        setMessage({ kind: "err", text: result.error ?? "Save failed." });
      }
    } catch {
      setMessage({ kind: "err", text: "Save failed (network or server error)." });
    }
  }

  if (loading) return <p className="text-ah-on-surface-variant">Loading meal plans...</p>;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-serif-display text-3xl text-ah-on-bg">Meal plans admin</h2>
        <p className="text-sm text-ah-on-surface-variant">
          Use the same admin password to update subscription tiers shown on the Meal Plans page.
        </p>
      </header>

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
          Save meal plans
        </button>
        <button
          type="button"
          onClick={add}
          className="rounded-xl border border-ah-outline-variant px-4 py-2.5 text-sm font-semibold text-ah-primary"
        >
          + Add plan
        </button>
      </div>

      {message && (
        <p role="alert" className={`text-sm font-medium ${message.kind === "ok" ? "text-emerald-800" : "text-ah-error"}`}>
          {message.text}
        </p>
      )}

      <div className="space-y-4">
        {plans.map((plan, index) => (
          <article key={plan.id} className="space-y-4 rounded-2xl border border-ah-outline-variant/40 bg-white p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ah-on-surface-variant">Name</span>
                <input
                  value={plan.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  className="w-full rounded border border-transparent bg-ah-surface-low px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ah-on-surface-variant">Price</span>
                <input
                  value={plan.price}
                  onChange={(e) => update(index, { price: e.target.value })}
                  className="w-full rounded border border-transparent bg-ah-surface-low px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ah-on-surface-variant">Period</span>
                <input
                  value={plan.period}
                  onChange={(e) => update(index, { period: e.target.value })}
                  className="w-full rounded border border-transparent bg-ah-surface-low px-3 py-2"
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ah-on-surface-variant">Description</span>
              <textarea
                value={plan.blurb}
                onChange={(e) => update(index, { blurb: e.target.value })}
                className="min-h-20 w-full rounded border border-transparent bg-ah-surface-low px-3 py-2"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ah-on-surface-variant">
                Features (comma-separated)
              </span>
              <input
                value={featuresInput[index] ?? ""}
                onChange={(e) => setFeaturesAt(index, e.target.value)}
                className="w-full rounded border border-transparent bg-ah-surface-low px-3 py-2"
                placeholder="Priority delivery, Nutrition labels, WhatsApp support"
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-ah-on-surface-variant">
                <input
                  type="checkbox"
                  checked={plan.highlighted}
                  onChange={(e) => update(index, { highlighted: e.target.checked })}
                />
                Mark as highlighted
              </label>
              <button type="button" onClick={() => remove(index)} className="text-sm font-semibold text-ah-error hover:underline">
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
