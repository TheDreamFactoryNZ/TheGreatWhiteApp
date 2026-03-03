import React, { useContext } from "react";
import TrackContext from "../../contexts/TrackContext.js";
import styles from "./IconButton.module.css";

import TracksIcon from "@images/button_icons/subjectTracks.svg?component";

/* eslint-disable react/prop-types */
const TrackButton = ({
  subject,
  trackButtonClass,
  iconText,
  iconTextClassName,
  width,
  height,
}) => {
  const label = subject?.name
    ? `View ${subject.name}'s journey`
    : "View this shark's journey";

  const { displayTracks, setTracks, tracks } = useContext(TrackContext);

  const vis = !!tracks[subject.id];
  //  const imgSrc = vis ? tracksOn : tracksOff;

  const onTrackButtonClick = () => {
    const nextVis = !vis;
    const update = [subject.id, nextVis];
    // Functional update to avoid stale overwrites; ensures both buttons stay in sync
    setTracks((prev) => ({ ...prev, [subject.id]: nextVis }));
    displayTracks(update);
  };

  // Resolve dimensions: "auto" → undefined (no attribute), falsy → default "24px"
  const resolvedWidth = width === "auto" ? undefined : width || "24px";
  const resolvedHeight = height === "auto" ? undefined : height || "24px";

  return (
    <>
      <button
        id="subject-track-button"
        className={[styles.iconButton, trackButtonClass]
          .filter(Boolean)
          .join(" ")}
        type="button"
        aria-label={label}
        title={label}
        aria-pressed={vis}
        data-active={vis}
        onClick={onTrackButtonClick}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <TracksIcon
          width={resolvedWidth}
          height={resolvedHeight}
          className={`${styles.iconSvg} ${styles.trackIconSvg}`}
          aria-hidden="true"
        />
        {iconText ? (
          <span className={`${styles.iconText} ${iconTextClassName || ""}`}>
            {iconText}
          </span>
        ) : null}
      </button>
    </>
  );
};

export default TrackButton;
