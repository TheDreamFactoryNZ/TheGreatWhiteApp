import React from 'react';
import Arrow from '@images/button_icons/arrow.svg?component';
import styles from './LastSeenInfo.module.css';

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

// Normalize status, supporting "auto" => inactive after N months (default 3)
function normalizeStatusWithAuto(rawStatus, date, autoMonths = 3) {
  const s = typeof rawStatus === 'string' ? rawStatus.trim().toLowerCase() : '';
  if (s === 'auto') {
    if (!date) return 'inactive'; // unknown date ⇒ treat as inactive
    const now = new Date();
    const months = diffMonthsUtc(date, now);
    return months >= autoMonths ? 'inactive' : 'active';
  }
  if (s === 'active' || s === 'inactive' || s === 'deactivated') return s;
  return 'active'; // default
}

export default function LastSeenInfo({
  isoDate,
  timezoneLabel = 'UTC',
  status,
  expandable = false,
  className,
  thresholds = defaultThresholds,
  renderFullDate,
  noLayoutShift = false,
  withBullet = false,
  statusClassName = '',
}) {
  const detailsRef = React.useRef(null);
  // Parse once; Step 2 will compute relative thresholds.
  const date = parseUtc(isoDate);
  const now = new Date();

  // Compute summary per Step 2 rules
  let dateSummaryText = 'Last seen: unknown';
  if (date) {
    const timeStr = formatTimeUtc(date);

    // Treat future dates as same-day
    const sameDay = isSameUtcDay(date, now) || date.getTime() > now.getTime();
    if (sameDay) {
      dateSummaryText = timeStr ? `Last seen at ${timeStr} ${timezoneLabel}` : 'Last seen: unknown';
    } else {
      const days = diffDaysUtc(date, now);
      if (days <= 13) {
        const unit = days === 1 ? 'day' : 'days';
        dateSummaryText = timeStr ? `Last seen ${days} ${unit} ago` : `Last seen ${days} ${unit} ago`;
      } else if (days >= thresholds.daysToWeeks && days < thresholds.weeksToMonths) {
        const weeks = Math.floor(days / 7);
        const unit = weeks === 1 ? 'week' : 'weeks';
        dateSummaryText = `Last seen ${weeks} ${unit} ago`;
      } else {
        const months = diffMonthsUtc(date, now);
        if (months < thresholds.monthsToShortDate) {
          const unit = months === 1 ? 'month' : 'months';
          dateSummaryText = `Last seen ${months} ${unit} ago`;
        } else {
          // Short date only
          dateSummaryText = `Last seen ${formatShortDateUtc(date)}`;
        }
      }
    }
  }

  // Details: full date (expanded UI only), using override if provided.
  const fullDateStr = date
    ? (renderFullDate ? renderFullDate(date, { timezoneLabel }) : defaultRenderFullDate(date, { timezoneLabel }))
    : 'Unknown date';

  // Status handling (expanded only) with auto support
  const normalizedStatus = normalizeStatusWithAuto(status, date, 3);
  const showInactive = normalizedStatus === 'inactive';
  const showDeactivated = normalizedStatus === 'deactivated';

  // Optional: status bullet class
  const statusClass =
    normalizedStatus === 'active' ? styles.statusActive :
      normalizedStatus === 'inactive' ? styles.statusInactive :
        normalizedStatus === 'deactivated' ? styles.statusDeactivated :
          styles.statusUnknown;

  if (expandable) {
    return (
      <details
        ref={detailsRef}
        className={`${className || ''} ${noLayoutShift ? styles.overlayDetails : ''}`}
      >
        <summary>
          <span
            className={`${styles.statusBullet} ${statusClass} ${statusClassName}`}
            aria-hidden="true"
          />
          <span className={styles.dateSummaryText}>{dateSummaryText}</span>
          <Arrow className={styles.summaryArrow} />
        </summary>
        <div className={styles.fullDateContainer}>
          <p className={`${'map-body'} ${styles.fullDate}`}>{fullDateStr}</p>
          {(showInactive || showDeactivated) && (
            <p className={`${'map-body'}`}>
              {showInactive
                ? 'This shark has not provided a location for an extended period of time and may be inactive.'
                : 'This shark has lost its tag and is no longer providing locations.'}
            </p>
          )}
          <button
            type="button"
            className={styles.closeFullDate}
            aria-label="Close last seen details"
            onClick={() => {
              if (detailsRef.current) {
                detailsRef.current.open = false;
                const summary = detailsRef.current.querySelector('summary');
                if (summary && typeof summary.focus === 'function') summary.focus();
              }
            }}
          >
            Close
          </button>
        </div>
      </details>
    );
  }

  // Non-expandable: print summary only (no full date shown here), show .
  return (
    <p className={className}>
      {withBullet && (
        <span
          className={`${styles.statusBullet} ${statusClass} ${statusClassName}`}
          aria-hidden="true"
        />
      )}
      {dateSummaryText}
    </p>
  );
}
