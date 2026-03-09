export function parseTimeToMinutes(time?: string): number {
  if (!time) return Infinity;
  const m = time.match(/^(\d+)(m|h|d)$/);
  if (!m) return Infinity;
  const n = Number(m[1]);
  if (m[2] === "m") return n;
  if (m[2] === "h") return n * 60;
  return n * 1440;
}

export function parsePriceToCents(price?: string): number {
  if (!price) return Infinity;
  const lower = price.toLowerCase();
  if (lower === "free") return 0;
  if (lower === "contact" || lower === "free consult") return Infinity;
  const first = lower.split("–")[0].split("—")[0];
  const stripped = first.replace(/[^0-9.]/g, "");
  const num = parseFloat(stripped);
  if (Number.isNaN(num)) return Infinity;
  if (lower.includes("k")) return num * 1000;
  return num;
}

export function parseDistanceOption(option: string): number {
  const n = parseFloat(option);
  return Number.isNaN(n) ? Infinity : n;
}
