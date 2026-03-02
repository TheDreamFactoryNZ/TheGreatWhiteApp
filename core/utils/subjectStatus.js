// Set the threshold for when a subject is considered inactive
const AUTO_INACTIVE_MONTHS = 3;

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

// Icon mapping (import your SVGs in the consuming file, or use paths)
export const STATUS_ICON_KEYS = {
  [STATUS.ACTIVE]: 'active',
  [STATUS.INACTIVE]: 'inactive',
  [STATUS.DEACTIVATED]: 'deactivated',
};

// Helper: calendar month diff
function diffMonths(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return months < 0 ? 0 : months;
}

/**
 * Normalize a subject's status, handling "auto" based on last seen date.
 * 
 * @param {string} rawStatus - The status from config ("active", "inactive", "deactivated", "auto")
 * @param {string|Date|null} lastSeenDate - ISO date string or Date object of last position
 * @param {number} autoThresholdMonths - Months after which "auto" becomes "inactive" (default: 3)
 * @returns {"active"|"inactive"|"deactivated"|"unknown"} Normalized status
 */
export function normalizeStatus(rawStatus, lastSeenDate = null, autoThresholdMonths = AUTO_INACTIVE_MONTHS) {
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

    const monthsAgo = diffMonths(lastSeen, new Date());
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
  return STATUS_COLORS[status] || STATUS_COLORS.unknown;
}

/**
 * Get status info bundle for a subject.
 * Convenience function that returns normalized status + color.
 * 
 * @param {object} subject - Subject object with last_position
 * @param {object} subjectConfig - Config for this subject (from config.subjects[id])
 * @returns {{ status: string, color: string, isActive: boolean, isInactive: boolean, isDeactivated: boolean, isUnknown: boolean }}
 */
export function getSubjectStatusInfo(subject, subjectConfig) {
  const rawStatus = subjectConfig?.status ?? STATUS.UNKNOWN;
  const lastSeenDate = subject?.last_position?.properties?.DateTime ?? null;
  
  const status = normalizeStatus(rawStatus, lastSeenDate);
  const color = getStatusColor(status);

  return {
    status,
    color,
    isActive: status === STATUS.ACTIVE,
    isInactive: status === STATUS.INACTIVE,
    isDeactivated: status === STATUS.DEACTIVATED,
    isUnknown: status === STATUS.UNKNOWN,
  };
}