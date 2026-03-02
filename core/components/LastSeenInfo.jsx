import React from "react";
import Arrow from "@images/button_icons/arrow.svg?component";
import TipModal from "./buttons/TipModal.jsx";
import styles from "./LastSeenInfo.module.css";
import {
  STATUS,
  ACTIVITY_MESSAGES,
  normalizeStatus,
  AUTO_INACTIVE_MONTHS,
} from "@core/utils/subjectStatus.js";

/* eslint-disable react/prop-types */
// LastSeenInfo: shared component for rendering "Last seen" information.
// Step 1: Define the component API and skeleton; Step 2 will implement
// the relative date rules and thresholds.

// Helper: parse an ISO string as UTC. Returns Date or null.
function parseUtc(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return null;
  const d = new Date(isoDate);
  // NaN check
  return Number.isNaN(d.getTime()) ? null : d;
}

// Helper: extract date parts in a specific IANA timezone
function getDatePartsInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return { year, month, day };
}

// Helper: format time as HH:MM (24h) in a specific timezone.
function formatTime(date, timeZone) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

// Helper: full date (for expanded details) using Intl.DateTimeFormat
function defaultRenderFullDate(date, ctx) {
  if (!date) return "Unknown date";
  const timeZone = ctx && ctx.timezone ? ctx.timezone : "UTC";
  const timezoneLabel = ctx && ctx.timezoneLabel ? ctx.timezoneLabel : timeZone;
  try {
    const dateStr = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    }).format(date);
    const timeStr = new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(date);
    return `${dateStr} at ${timeStr} ${timezoneLabel}`;
  } catch (_) {
    // Fallback: build from timezone-aware parts
    const parts = getDatePartsInTimeZone(date, timeZone);
    const timeStr = formatTime(date, timeZone);
    return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(
      parts.day,
    ).padStart(2, "0")} ${timeStr} ${timezoneLabel}`;
  }
}

// Provided here for API completeness.
const defaultThresholds = {
  daysToWeeks: 14, // use "days ago" until 13 days; switch to weeks at 14
  weeksToMonths: 28, // switch to months at 28 days
  monthsToShortDate: 4, // summary prints DD/MM/YYYY at >= 4 months
};

// Helper: compare year-month-day equality in a timezone
function isSameDayInTimeZone(a, b, timeZone) {
  const pa = getDatePartsInTimeZone(a, timeZone);
  const pb = getDatePartsInTimeZone(b, timeZone);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

// Helper: whole-day diff using a timezone; negative -> 0
function diffDays(from, to, timeZone) {
  const fromParts = getDatePartsInTimeZone(from, timeZone);
  const toParts = getDatePartsInTimeZone(to, timeZone);
  const fromMidnight = Date.UTC(
    fromParts.year,
    fromParts.month - 1,
    fromParts.day,
  );
  const toMidnight = Date.UTC(toParts.year, toParts.month - 1, toParts.day);
  const ms = toMidnight - fromMidnight;
  const days = Math.floor(ms / 86400000);
  return days < 0 ? 0 : days;
}

// Helper: calendar month diff in a timezone (approximate, adjusts by day-of-month)
function diffMonths(from, to, timeZone) {
  const fromParts = getDatePartsInTimeZone(from, timeZone);
  const toParts = getDatePartsInTimeZone(to, timeZone);
  let months =
    (toParts.year - fromParts.year) * 12 + (toParts.month - fromParts.month);
  if (toParts.day < fromParts.day) months -= 1;
  return months < 0 ? 0 : months;
}

// Helper: short date DD/MM/YYYY in a timezone
function formatShortDate(date, timeZone) {
  const parts = getDatePartsInTimeZone(date, timeZone);
  const dd = String(parts.day).padStart(2, "0");
  const mm = String(parts.month).padStart(2, "0");
  const yyyy = String(parts.year);
  return `${dd}/${mm}/${yyyy}`;
}

// Status → CSS class mapping
const STATUS_CLASS_MAP = {
  [STATUS.ACTIVE]: styles.statusActive,
  [STATUS.INACTIVE]: styles.statusInactive,
  [STATUS.DEACTIVATED]: styles.statusDeactivated,
  [STATUS.UNKNOWN]: styles.statusUnknown,
};

export default function LastSeenInfo({
  isoDate,
  timezoneLabel,
  status,
  className,
  renderFullDate,
  showFullDate = false,
  showActivityText = false,
  timezone = "UTC",
  expandable = false,
  thresholds = defaultThresholds,
  noLayoutShift = false,
  withBullet = false,
  statusClassName = "",
}) {
  const detailsRef = React.useRef(null);
  const resolvedTimezone = timezone || "UTC";
  const resolvedTimezoneLabel = timezoneLabel || resolvedTimezone;
  // Parse once; Step 2 will compute relative thresholds.
  const date = parseUtc(isoDate);
  const now = new Date();

  // Use centralized status normalization (with timezone support)
  const normalizedStatus = normalizeStatus(
    status,
    isoDate,
    AUTO_INACTIVE_MONTHS,
    resolvedTimezone
  );

  // Derive booleans from normalized status
  const showActive = normalizedStatus === STATUS.ACTIVE;
  const showInactive = normalizedStatus === STATUS.INACTIVE;
  const showDeactivated = normalizedStatus === STATUS.DEACTIVATED;
  const showUnknown = normalizedStatus === STATUS.UNKNOWN;

  // Get activity message from centralized source
  const activityMessage = ACTIVITY_MESSAGES[normalizedStatus] || null;

  // Status CSS class
  const statusClass = STATUS_CLASS_MAP[normalizedStatus] || styles.statusUnknown;
  let dateSummaryText = "Last seen: unknown";
  if (date) {
    const timeStr = formatTime(date, resolvedTimezone);

    // Treat future dates as same-day
    const sameDay =
      isSameDayInTimeZone(date, now, resolvedTimezone) ||
      date.getTime() > now.getTime();
    if (sameDay) {
      dateSummaryText = timeStr
        ? `Last seen at ${timeStr} ${resolvedTimezoneLabel}`
        : "Last seen: unknown";
    } else {
      const days = diffDays(date, now, resolvedTimezone);
      if (days <= 13) {
        const unit = days === 1 ? "day" : "days";
        dateSummaryText = timeStr
          ? `Last seen ${days} ${unit} ago`
          : `Last seen ${days} ${unit} ago`;
      } else if (
        days >= thresholds.daysToWeeks &&
        days < thresholds.weeksToMonths
      ) {
        const weeks = Math.floor(days / 7);
        const unit = weeks === 1 ? "week" : "weeks";
        dateSummaryText = `Last seen ${weeks} ${unit} ago`;
      } else {
        const months = diffMonths(date, now, resolvedTimezone);
        // If months is 0 but we're past weeksToMonths threshold, show weeks instead
        if (months === 0) {
          const weeks = Math.floor(days / 7);
          const unit = weeks === 1 ? "week" : "weeks";
          dateSummaryText = `Last seen ${weeks} ${unit} ago`;
        } else if (months < thresholds.monthsToShortDate) {
          const unit = months === 1 ? "month" : "months";
          dateSummaryText = `Last seen ${months} ${unit} ago`;
        } else {
          // Short date only
          dateSummaryText = `Last seen on ${formatShortDate(
            date,
            resolvedTimezone,
          )}`;
        }
      }
    }
  }

  // Details: full date (expanded UI only), using override if provided.
  const fullDateStr = date
    ? renderFullDate
      ? renderFullDate(date, {
          timezone: resolvedTimezone,
          timezoneLabel: resolvedTimezoneLabel,
        })
      : defaultRenderFullDate(date, {
          timezone: resolvedTimezone,
          timezoneLabel: resolvedTimezoneLabel,
        })
    : "Unknown date";

  if (expandable) {
    return (
      <details
        ref={detailsRef}
        className={`${className || ""} ${
          noLayoutShift ? styles.overlayDetails : ""
        }`}
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
          <span className={`${"map-body"} ${styles.fullDateText}`}>
            {fullDateStr}
            {!showDeactivated && (
              <>
                &nbsp;&nbsp;
                <TipModal
                  className={styles.lastSeenTip}
                  portalIntoId="gw-modal-root"
                  modalTitle="No recent location update?"
                  modalBody="<p>Locations are obtained via a tag attached to the dorsal fin of the shark, which then transmits to orbiting satellites. For the satellites to receive a location, the shark must be near or at the surface of the water.</p><p>Being marine animals, sharks can spend <strong>months</strong> underwater, therefore it's not unusual to see long periods of inactivity.</p><p><strong>Rest assured, this is <em>not</em> an issue with the app - it is simply the harsh reality of tagging and tracking marine animals</strong></p>"
                  initialOpen={false}
                />
              </>
            )}
          </span>
          {activityMessage && (showInactive || showDeactivated || showUnknown) && (
            <p className={`${"map-body"} ${styles.tagStatusText}`}>
              <em>{activityMessage}</em>
            </p>
          )}
          <button
            type="button"
            className={styles.closeFullDate}
            aria-label="Close last seen details"
            onClick={() => {
              if (detailsRef.current) {
                detailsRef.current.open = false;
                const summary = detailsRef.current.querySelector("summary");
                if (summary && typeof summary.focus === "function")
                  summary.focus();
              }
            }}
          >
            Close
          </button>
        </div>
      </details>
    );
  }
  // Non-expandable
  return (
    <div className={className}>
      <div className={styles.dateSummaryContainer}>
        <span className={`${styles.dateSummaryText}`}>
          {withBullet && (
            <span
              className={`${styles.statusBullet} ${statusClass} ${statusClassName}`}
              aria-hidden="true"
            />
          )}
          {showFullDate && (
            <span className={styles.dateSummaryText}>
              {fullDateStr}&nbsp;&nbsp;
            </span>
          )}
          {showFullDate == false && (
            <span className={styles.dateSummaryText}>
              {dateSummaryText}&nbsp;&nbsp;
            </span>
          )}
          <TipModal
            className={styles.lastSeenTip}
            portalIntoId="gw-modal-root"
            modalTitle="No recent location update?"
            modalBody="<p>Locations are obtained via a tag attached to the dorsal fin of the shark, which then transmits to orbiting satellites. For the satellites to receive a location, the shark must be near or at the surface of the water.</p><p>Being marine animals, sharks can spend <strong>months</strong> underwater, therefore it's not unusual to see long periods of inactivity.</p><p><strong>Rest assured, this is <em>not</em> an issue with the app - it is simply the harsh reality of tagging and tracking marine animals</strong></p>"
            initialOpen={false}
          />
          {showActivityText && activityMessage && (
            <p className={`${"map-body"} ${styles.tagStatusText}`}>
              <em>{activityMessage}</em>
            </p>
          )}
        </span>
      </div>
    </div>
  );
}
