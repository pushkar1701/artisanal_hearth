"use server";

import { revalidatePath } from "next/cache";
import type { Dish } from "@/lib/menu-store";
import { DAILY_MENU_MAX_DISHES } from "@/lib/menu-constants";
import { writeMenu } from "@/lib/menu-store";

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
  await writeMenu({ dishes });
  revalidatePath("/menu");
  return { ok: true as const };
}
