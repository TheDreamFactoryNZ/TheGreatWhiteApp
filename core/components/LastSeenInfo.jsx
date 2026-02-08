import React from 'react';

/* eslint-disable react/prop-types */
// LastSeenInfo: shared component for rendering "Last seen" information.
// Step 1: Define the component API and skeleton; Step 2 will implement
// the relative date rules and thresholds.

// Helper: parse an ISO string as UTC. Returns Date or null.
function parseUtc(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return null;
  const d = new Date(isoDate);
  // NaN check
  return Number.isNaN(d.getTime()) ? null : d;
}

// Helper: format time as HH:MM (24h) in UTC context.
function formatTimeUtc(date) {
  if (!date) return null;
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper: full date (for expanded details) using Intl.DateTimeFormat
function defaultRenderFullDate(date, ctx) {
  if (!date) return 'Unknown date';
  try {
    const dateStr = new Intl.DateTimeFormat('en', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(date);
    const timeStr = new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: 'UTC',
    }).format(date);
    const tz = (ctx && ctx.timezoneLabel) ? ctx.timezoneLabel : 'UTC';
    return `${dateStr} at ${timeStr} ${tz}`;
  } catch (_) {
    // Fallback: ISO substring
    const iso = date.toISOString();
    return `${iso.substring(0, 10)} ${iso.substring(11, 16)} ${(ctx && ctx.timezoneLabel) || 'UTC'}`;
  }
}

// Provided here for API completeness.
const defaultThresholds = {
  daysToWeeks: 14, // use "days ago" until 13 days; switch to weeks at 14
  weeksToMonths: 28, // switch to months at 28 days
  monthsToShortDate: 4, // summary prints DD/MM/YYYY at >= 4 months
};

// Helper: compare UTC year-month-day equality
function isSameUtcDay(a, b) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

// Helper: whole-day diff using UTC; negative -> 0
function diffDaysUtc(from, to) {
  const ms = to.getTime() - from.getTime();
  const days = Math.floor(ms / 86400000);
  return days < 0 ? 0 : days;
}

// Helper: calendar month diff in UTC (approximate, adjusts by day-of-month)
function diffMonthsUtc(from, to) {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  return months < 0 ? 0 : months;
}

// Helper: short date DD/MM/YYYY in UTC
function formatShortDateUtc(date) {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getUTCFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

export default function LastSeenInfo({
  isoDate,
  timezoneLabel = 'UTC',
  status,
  expandable = false,
  className,
  thresholds = defaultThresholds,
  renderFullDate,
}) {
  // Parse once; Step 2 will compute relative thresholds.
  const date = parseUtc(isoDate);
  const now = new Date();

  // Compute summary per Step 2 rules
  let summaryText = 'Last seen: unknown';
  if (date) {
    const timeStr = formatTimeUtc(date);

    // Treat future dates as same-day
    const sameDay = isSameUtcDay(date, now) || date.getTime() > now.getTime();
    if (sameDay) {
      summaryText = timeStr ? `Last seen at ${timeStr} ${timezoneLabel}` : 'Last seen: unknown';
    } else {
      const days = diffDaysUtc(date, now);
      if (days <= 13) {
        const unit = days === 1 ? 'day' : 'days';
        summaryText = timeStr ? `Last seen ${days} ${unit} ago at ${timeStr} ${timezoneLabel}` : `Last seen ${days} ${unit} ago`;
      } else if (days >= thresholds.daysToWeeks && days < thresholds.weeksToMonths) {
        const weeks = Math.floor(days / 7);
        const unit = weeks === 1 ? 'week' : 'weeks';
        summaryText = `Last seen ${weeks} ${unit} ago`;
      } else {
        const months = diffMonthsUtc(date, now);
        if (months < thresholds.monthsToShortDate) {
          const unit = months === 1 ? 'month' : 'months';
          summaryText = `Last seen ${months} ${unit} ago`;
        } else {
          // Short date only
          summaryText = formatShortDateUtc(date);
        }
      }
    }
  }

  // Details: full date (expanded UI only), using override if provided.
  const fullDateStr = date
    ? (renderFullDate ? renderFullDate(date, { timezoneLabel }) : defaultRenderFullDate(date, { timezoneLabel }))
    : 'Unknown date';

  // Status messaging (appears only in expanded details as per Step 3).
  const inactiveNote = 'This shark has not provided a location for an extended period of time and may be inactive.';
  const deactivatedNote = 'This shark has lost its tag and is no longer providing locations.';
  const statusLower = typeof status === 'string' ? status.toLowerCase() : undefined;
  const showInactive = statusLower === 'inactive';
  const showDeactivated = statusLower === 'deactivated';

  if (expandable) {
    return (
      <details className={className}>
        <summary>{summaryText}</summary>
        <div>
          {fullDateStr}
          {(showInactive || showDeactivated) && (
            <div style={{ marginTop: 4 }}>
              {showInactive ? inactiveNote : deactivatedNote}
            </div>
          )}
        </div>
      </details>
    );
  }

  // Non-expandable: print summary only (no full date shown here).
  return (
    <div className={className}>
      {summaryText}
    </div>
  );
}
