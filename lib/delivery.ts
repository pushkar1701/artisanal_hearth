/**
 * Delivery pricing from kitchen (Ghaziabad / Noida Sector 62 area).
 * Rules:
 * - 0–5 km: free · 5–10 km: ₹40 · 10–15 km: ₹100 (standard orders)
 * - Non-bulk orders: only accepted within 15 km
 * - 15–20 km: bulk orders only, ₹100
 * - Beyond 20 km: bulk only; fee = Porter/third-party quote (entered at checkout)
 */

export const MAX_KM_NON_BULK = 15;
export const KM_TIER_5 = 5;
export const KM_TIER_10 = 10;
export const KM_TIER_15 = 15;
export const KM_TIER_20 = 20;

export type DeliveryQuote =
  | {
      ok: true;
      distanceKm: number;
      feeInr: number;
      tier: string;
      requiresPorterQuote: false;
    }
  | {
      ok: true;
      distanceKm: number;
      feeInr: null;
      tier: "porter_quote";
      requiresPorterQuote: true;
    }
  | {
      ok: false;
      distanceKm: number;
      reason: "outside_non_bulk" | "too_far" | "invalid";
      message: string;
    };

export function quoteDelivery(distanceKm: number, isBulk: boolean, porterQuoteInr?: number | null): DeliveryQuote {
  if (distanceKm < 0 || Number.isNaN(distanceKm)) {
    return {
      ok: false,
      distanceKm,
      reason: "invalid",
      message: "Invalid distance.",
    };
  }

  if (!isBulk && distanceKm > MAX_KM_NON_BULK) {
    return {
      ok: false,
      distanceKm,
      reason: "outside_non_bulk",
      message: `We accept regular orders only within ${MAX_KM_NON_BULK} km. Enable “Bulk / extended delivery” for farther drops or Porter-assisted delivery.`,
    };
  }

  if (distanceKm <= KM_TIER_5) {
    return { ok: true, distanceKm, feeInr: 0, tier: "0–5 km (free)", requiresPorterQuote: false };
  }
  if (distanceKm <= KM_TIER_10) {
    return { ok: true, distanceKm, feeInr: 40, tier: "5–10 km", requiresPorterQuote: false };
  }
  if (distanceKm <= KM_TIER_15) {
    return { ok: true, distanceKm, feeInr: 100, tier: "10–15 km", requiresPorterQuote: false };
  }

  if (distanceKm <= KM_TIER_20) {
    if (!isBulk) {
      return {
        ok: false,
        distanceKm,
        reason: "outside_non_bulk",
        message: "15–20 km delivery requires a bulk / extended order.",
      };
    }
    return { ok: true, distanceKm, feeInr: 100, tier: "15–20 km (bulk)", requiresPorterQuote: false };
  }

  if (!isBulk) {
    return {
      ok: false,
      distanceKm,
      reason: "too_far",
      message: "Beyond 20 km requires a bulk order with Porter or partner delivery.",
    };
  }

  const fee =
    porterQuoteInr != null && porterQuoteInr > 0
      ? Math.round(porterQuoteInr)
      : null;

  if (fee == null) {
    return {
      ok: true,
      distanceKm,
      feeInr: null,
      tier: "porter_quote",
      requiresPorterQuote: true,
    };
  }

  return { ok: true, distanceKm, feeInr: fee, tier: "20+ km (Porter / partner)", requiresPorterQuote: false };
}

/** Haversine distance in km */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function getKitchenCoords(): { lat: number; lng: number } {
  const lat = Number(process.env.NEXT_PUBLIC_KITCHEN_LAT ?? "28.6219");
  const lng = Number(process.env.NEXT_PUBLIC_KITCHEN_LNG ?? "77.3639");
  return { lat, lng };
}
