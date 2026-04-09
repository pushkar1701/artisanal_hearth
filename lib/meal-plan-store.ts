import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getRedis } from "@/lib/kv";

export type MealPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  highlighted: boolean;
};

export type MealPlansFile = { plans: MealPlan[] };

const MEAL_PLANS_PATH = path.join(process.cwd(), "data", "meal-plans.json");
const MEAL_PLANS_KEY = "artisanal_hearth:meal_plans";

const DEFAULT_PLANS: MealPlan[] = [
  {
    id: "lunch_week",
    name: "Lunch week",
    price: "₹1,890",
    period: "/ week",
    blurb: "5 weekday lunches, one delivery address. Pause or skip anytime.",
    features: ["Seasonal menu rotation", "Nutrition highlights on every label", "WhatsApp support"],
    highlighted: false,
  },
  {
    id: "full_hearth",
    name: "Full hearth",
    price: "₹3,450",
    period: "/ week",
    blurb: "Lunch + dinner, seven days. Best for busy households.",
    features: ["Priority delivery window", "Chef notes & reheating tips", "Birthday dessert add-on"],
    highlighted: true,
  },
  {
    id: "weekend_ease",
    name: "Weekend ease",
    price: "₹980",
    period: "/ weekend",
    blurb: "Sat-Sun lunch & dinner when you want to log off from cooking.",
    features: ["Flexible pickup", "Party-size upgrade available", "Kid-friendly spice"],
    highlighted: false,
  },
];

function sanitizePlans(plans: MealPlan[]): MealPlan[] {
  return plans.map((p, index) => ({
    id: p.id?.trim() || `plan_${index + 1}`,
    name: p.name?.trim() || "Untitled plan",
    price: p.price?.trim() || "₹0",
    period: p.period?.trim() || "",
    blurb: p.blurb?.trim() || "",
    features: Array.isArray(p.features) ? p.features.map((f) => f.trim()).filter(Boolean) : [],
    highlighted: Boolean(p.highlighted),
  }));
}

export async function readMealPlans(): Promise<MealPlansFile> {
  const redis = getRedis();
  if (redis) {
    const fromKv = await redis.get<MealPlansFile>(MEAL_PLANS_KEY);
    if (fromKv && Array.isArray(fromKv.plans)) {
      return { plans: sanitizePlans(fromKv.plans) };
    }
  }

  try {
    const raw = await readFile(MEAL_PLANS_PATH, "utf8");
    const parsed = JSON.parse(raw) as MealPlansFile;
    return { plans: sanitizePlans(parsed.plans ?? []) };
  } catch {
    return { plans: DEFAULT_PLANS };
  }
}

export async function writeMealPlans(mealPlans: MealPlansFile): Promise<void> {
  const normalized = { plans: sanitizePlans(mealPlans.plans ?? []) };
  const redis = getRedis();
  if (redis) {
    await redis.set(MEAL_PLANS_KEY, normalized);
    return;
  }

  await writeFile(MEAL_PLANS_PATH, JSON.stringify(normalized, null, 2), "utf8");
}
