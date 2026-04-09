import { NextResponse } from "next/server";
import { readMealPlans } from "@/lib/meal-plan-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const mealPlans = await readMealPlans();
  return NextResponse.json(mealPlans);
}
