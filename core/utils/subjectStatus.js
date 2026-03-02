// Set the threshold for when a subject is considered inactive
export const AUTO_INACTIVE_MONTHS = 3;

// Status constants
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DEACTIVATED: 'deactivated',
  UNKNOWN: 'unknown',
};

// Color mapping
export const STATUS_COLORS = {
  [STATUS.ACTIVE]: '#4CBE23',
  [STATUS.INACTIVE]: '#FFC60A',
  [STATUS.DEACTIVATED]: '#B63E4E',
  [STATUS.UNKNOWN]: '#B0B0B0',
};

// Activity messages (used by LastSeenInfo and potentially other components)
export const ACTIVITY_MESSAGES = {
  [STATUS.ACTIVE]: 'This shark is currently providing location updates.',
  [STATUS.INACTIVE]: 'This shark has not surfaced to provide a location for an extended period of time and is inactive.',
  [STATUS.DEACTIVATED]: 'This shark has lost its tag and is no longer providing locations.',
  [STATUS.UNKNOWN]: 'The status of this shark is unknown.',
};

// Icon mapping (import your SVGs in the consuming file, or use paths)
export const STATUS_ICON_KEYS = {
  [STATUS.ACTIVE]: 'active',
  [STATUS.INACTIVE]: 'inactive',
  [STATUS.DEACTIVATED]: 'deactivated',
};

// Helper: extract date parts in a specific IANA timezone
function getDatePartsInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);

  return { year, month, day };
}

// Helper: calendar month diff, timezone-aware
function diffMonths(from, to, timeZone = 'UTC') {
  const fromParts = getDatePartsInTimeZone(from, timeZone);
  const toParts = getDatePartsInTimeZone(to, timeZone);
  let months =
    (toParts.year - fromParts.year) * 12 + (toParts.month - fromParts.month);
  if (toParts.day < fromParts.day) months -= 1;
  return months < 0 ? 0 : months;
}

/**
 * Normalize a subject's status, handling "auto" based on last seen date.
 * 
 * @param {string} rawStatus - The status from config ("active", "inactive", "deactivated", "auto", "unknown")
 * @param {string|Date|null} lastSeenDate - ISO date string or Date object of last position
 * @param {number} autoThresholdMonths - Months after which "auto" becomes "inactive" (default: 3)
 * @param {string} timeZone - IANA timezone for date calculations (default: 'UTC')
 * @returns {"active"|"inactive"|"deactivated"|"unknown"} Normalized status
 */
export function normalizeStatus(
  rawStatus,
  lastSeenDate = null,
  autoThresholdMonths = AUTO_INACTIVE_MONTHS,
  timeZone = 'UTC'
) {
  const s = typeof rawStatus === 'string' ? rawStatus.trim().toLowerCase() : '';

  // Explicit statuses
  if (s === STATUS.ACTIVE) return STATUS.ACTIVE;
  if (s === STATUS.INACTIVE) return STATUS.INACTIVE;
  if (s === STATUS.DEACTIVATED) return STATUS.DEACTIVATED;
  if (s === STATUS.UNKNOWN) return STATUS.UNKNOWN;

  // Auto: determine based on last seen date
  if (s === 'auto') {
    if (!lastSeenDate) return STATUS.INACTIVE; // No date → treat as inactive

    const lastSeen = typeof lastSeenDate === 'string' ? new Date(lastSeenDate) : lastSeenDate;
    if (Number.isNaN(lastSeen.getTime())) return STATUS.INACTIVE;

    const monthsAgo = diffMonths(lastSeen, new Date(), timeZone);
    return monthsAgo >= autoThresholdMonths ? STATUS.INACTIVE : STATUS.ACTIVE;
  }

  // Unknown/missing
  return STATUS.UNKNOWN;
}

/**
 * Get the color for a given status.
 * @param {string} status - Normalized status
 * @returns {string} Hex color
 */
export function getStatusColor(status) {
  return STATUS_COLORS[status] || STATUS_COLORS[STATUS.UNKNOWN];
}

/**
 * Get the activity message for a given status.
 * @param {string} status - Normalized status
 * @returns {string|null} Activity message or null
 */
export function getActivityMessage(status) {
  return ACTIVITY_MESSAGES[status] || null;
}

/**
 * Get status info bundle for a subject.
 * Convenience function that returns normalized status + color.
 * 
 * @param {object} subject - Subject object with last_position
 * @param {object} subjectConfig - Config for this subject (from config.subjects[id])
 * @param {string} timeZone - IANA timezone for date calculations (default: 'UTC')
 * @returns {{ status: string, color: string, message: string|null, isActive: boolean, isInactive: boolean, isDeactivated: boolean, isUnknown: boolean }}
 */
export function getSubjectStatusInfo(subject, subjectConfig, timeZone = 'UTC') {
  const rawStatus = subjectConfig?.status ?? STATUS.UNKNOWN;
  const lastSeenDate = subject?.last_position?.properties?.DateTime ?? null;
  
  const status = normalizeStatus(rawStatus, lastSeenDate, AUTO_INACTIVE_MONTHS, timeZone);
  const color = getStatusColor(status);
  const message = getActivityMessage(status);

  return {
    status,
    color,
    message,
    isActive: status === STATUS.ACTIVE,
    isInactive: status === STATUS.INACTIVE,
    isDeactivated: status === STATUS.DEACTIVATED,
    isUnknown: status === STATUS.UNKNOWN,
  };
}