const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "just now" / "5m ago" / "3h ago" / "2d ago", then falls back to a date. */
export const relativeTime = (value: string | null): string => {
  if (!value) return "";

  const elapsed = Date.now() - new Date(value).getTime();

  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d ago`;

  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric" });
};

/** Clock time for a message bubble. */
export const clockTime = (value: string): string =>
  new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Sidebar timestamp: time for today, otherwise a short date. */
export const listTime = (value: string | null): string => {
  if (!value) return "";

  const date = new Date(value);
  return isSameDay(date, new Date())
    ? clockTime(value)
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** "Today" / "Yesterday" / "Monday" / "12 March 2025" for chat date dividers. */
export const dayLabel = (value: string): string => {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  const withinWeek = Date.now() - date.getTime() < 7 * DAY;
  return withinWeek
    ? date.toLocaleDateString([], { weekday: "long" })
    : date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
};

/** "12 KB" / "3.4 MB" for attachment labels. */
export const formatBytes = (bytes: number | null): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
