import React from "react";
import HelpButton from "./HelpButton.jsx";
import LeaveReviewButton from "./LeaveReviewButton.jsx";
import RefreshMapButton from "./RefreshMapButton.jsx";
import styles from "./MapButtons.module.css";

const MapButtons = ({ softStyleReload }) => {
  return (
    <div className={styles.mapButtonsContainer}>
      <HelpButton />
      <LeaveReviewButton />
      <RefreshMapButton onClick={softStyleReload} />
    </div>
  );
};

export default MapButtons;