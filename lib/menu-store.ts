import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getRedis } from "@/lib/kv";

export type Dish = {
  id: string;
  name: string;
  description?: string;
  priceInr: number;
  quantityAvailable: number;
  tags?: string[];
};

export type MenuFile = { dishes: Dish[] };

const MENU_PATH = path.join(process.cwd(), "data", "menu.json");
const MENU_KEY = "artisanal_hearth:menu";

export async function readMenu(): Promise<MenuFile> {
  const redis = getRedis();
  if (redis) {
    const fromKv = await redis.get<MenuFile>(MENU_KEY);
    if (fromKv && Array.isArray(fromKv.dishes)) {
      return fromKv;
    }
  }

  try {
    const raw = await readFile(MENU_PATH, "utf8");
    return JSON.parse(raw) as MenuFile;
  } catch {
    return { dishes: [] };
  }
}

export async function writeMenu(menu: MenuFile): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(MENU_KEY, menu);
    return;
  }

  await writeFile(MENU_PATH, JSON.stringify(menu, null, 2), "utf8");
}
