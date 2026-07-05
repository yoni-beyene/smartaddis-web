export const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export function getTodayHours(
  openingHours: Record<string, string> | undefined,
  date: Date = new Date(),
): string | null {
  if (!openingHours) return null;
  const dayName = DAY_NAMES[date.getDay()];
  const entry = Object.entries(openingHours).find(([key]) => key.toLowerCase() === dayName);
  return entry ? entry[1] : null;
}
