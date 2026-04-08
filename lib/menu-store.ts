import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

export async function readMenu(): Promise<MenuFile> {
  try {
    const raw = await readFile(MENU_PATH, "utf8");
    return JSON.parse(raw) as MenuFile;
  } catch {
    return { dishes: [] };
  }
}

export async function writeMenu(menu: MenuFile): Promise<void> {
  await writeFile(MENU_PATH, JSON.stringify(menu, null, 2), "utf8");
}
