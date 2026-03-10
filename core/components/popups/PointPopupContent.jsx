import React from "react";
import PopupCloseButton from "./PopupCloseButton.jsx";
import { STATUS } from "@utils/subjectStatus.js";
import styles from "./PointPopupContent.module.css";

const STATUS_MESSAGE = {
  [STATUS.DEACTIVATED]:
    "This subject is no longer being tracked, but you can still browse it's historical locations.",
};

/* eslint-disable react/prop-types */
export default function PointPopupContent({
  idx,
  date,
  time,
  timezone,
  status,
  onClose
}) {
  const dateLine = date || "";
  const timeLine = [time, timezone].filter(Boolean).join(" ");
  const statusMessage = status ? STATUS_MESSAGE[status] : null;

  return (
    <div className={styles.popUp}>
      <PopupCloseButton
        closeClass={styles.closePopupContent}
        onClose={onClose}
      />
      <div className={styles.popUpHeaderContainer}>
        <h2 className={styles.popUpHeading}>
          {`Location #${idx ?? ""}`.trim()}
        </h2>
      </div>
      <div className={styles.popUpBody}>
        <div className={styles.popUpBodyContent}>
          <h3 className={`map-heading ${styles.dateTimeHeading}`}>Details:</h3>
          <p className={`map-body ${styles.dateTimeText}`}>
            <strong>Date: </strong> {dateLine && dateLine}
            <br />
            <strong>Time: </strong>
            {dateLine && timeLine && " "}
            {timeLine && timeLine}
            {!dateLine && !timeLine && "Time: unknown"}
          </p>
          {statusMessage && (
            <p className={`map-body ${styles.statusMessage}`}>
              <em>{statusMessage}</em>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
