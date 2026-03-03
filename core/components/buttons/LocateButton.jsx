import React from "react";
import styles from "./IconButton.module.css";

import pin from "@images/button_icons/map-pin.svg?url";

/* eslint-disable react/prop-types */
const LocateButton = ({
  subject,
  locButtonClass,
  handleOnLocButtonClicked,
  iconText,
  iconTextClassName,
  width,
  height,
}) => {
  const label = subject?.name
    ? `Fly to ${subject.name}'s last location`
    : "Fly to subject location";

  function flyTo() {
    handleOnLocButtonClicked(subject.last_position.geometry.coordinates);
  }

  // Resolve dimensions: "auto" → undefined (no attribute), falsy → default "24px"
  const resolvedWidth = width === "auto" ? undefined : width || "24px";
  const resolvedHeight = height === "auto" ? undefined : height || "24px";

  return (
    <>
      <button
        id="subject-location-button"
        className={[styles.iconButton, locButtonClass]
          .filter(Boolean)
          .join(" ")}
        type="button"
        aria-label={label}
        title={label}
        onClick={() => flyTo()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <img
          width={resolvedWidth}
          height={resolvedHeight}
          className="hover"
          src={pin}
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

export default LocateButton;
