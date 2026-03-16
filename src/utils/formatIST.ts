export function formatIST(dateString: string | null): string {
  if (!dateString) return "—";
  // Supabase may return timestamptz without offset (e.g. "2026-03-16T08:30:00").
  // Append "Z" so the browser treats it as UTC before converting to IST.
  const normalized = /[Z+\-]\d{2}/.test(dateString) ? dateString : dateString + "Z";
  return new Date(normalized).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
