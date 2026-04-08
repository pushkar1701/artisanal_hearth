/** Earliest allowed delivery date: next calendar day (no same-day). */

export function tomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateStringLocal(d);
}

export function todayDateString(): string {
  return toDateStringLocal(new Date());
}

function toDateStringLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDayDelivery(dateStr: string): boolean {
  return dateStr === todayDateString();
}
