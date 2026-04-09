"use server";

import { revalidatePath } from "next/cache";
import type { Dish } from "@/lib/menu-store";
import type { MealPlan } from "@/lib/meal-plan-store";
import { DAILY_MENU_MAX_DISHES } from "@/lib/menu-constants";
import { writeMenu } from "@/lib/menu-store";
import { writeMealPlans } from "@/lib/meal-plan-store";

export async function saveMenuAction(password: string, dishes: Dish[]) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return { ok: false as const, error: "ADMIN_SECRET is not set on the server." };
  }
  if (password !== expected) {
    return { ok: false as const, error: "Invalid admin password." };
  }
  if (dishes.length > DAILY_MENU_MAX_DISHES) {
    return {
      ok: false as const,
      error: `Daily menu allows at most ${DAILY_MENU_MAX_DISHES} dishes. Remove some rows, then save again.`,
    };
  }
  try {
    await writeMenu({ dishes });
    revalidatePath("/menu");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error:
        "Save failed: this deployment cannot write to local files. On Vercel, store menu data in a database or blob storage instead of data/menu.json.",
    };
  }
}

export async function saveMealPlansAction(password: string, plans: MealPlan[]) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return { ok: false as const, error: "ADMIN_SECRET is not set on the server." };
  }
  if (password !== expected) {
    return { ok: false as const, error: "Invalid admin password." };
  }

  try {
    await writeMealPlans({ plans });
    revalidatePath("/meal-plans");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error:
        "Save failed: this deployment cannot write to local files. On Vercel, connect Upstash Redis and set KV_REST_API_URL / KV_REST_API_TOKEN.",
    };
  }
}
