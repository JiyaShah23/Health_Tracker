/**
 * Returns today's date key in YYYY-MM-DD format
 * correctly adjusted for the user's local timezone.
 */
export function getTodayKey() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
}

/**
 * Returns a date key for N days ago.
 */
export function getDateKey(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
}

/**
 * Calculates sleep hours from sleepStart and sleepEnd strings (HH:MM format).
 * Handles overnight sleep correctly.
 */
export function calcSleepHours(sleepStart, sleepEnd) {
  if (!sleepStart || !sleepEnd) return null;
  const [sh, sm] = sleepStart.split(':').map(Number);
  const [eh, em] = sleepEnd.split(':').map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  const diff = endMins < startMins
    ? (1440 - startMins + endMins)
    : (endMins - startMins);
  return parseFloat((diff / 60).toFixed(1));
}

/**
 * Formats sleep hours into a readable string like "7h 30m"
 */
export function formatSleepHours(hours) {
  if (hours == null) return '—';
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
}
