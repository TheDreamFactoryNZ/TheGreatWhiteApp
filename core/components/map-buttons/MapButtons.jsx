import React from "react";
import HelpButton from "./HelpButton.jsx";
import LeaveReviewButton from "./LeaveReviewButton.jsx";
import RefreshMapButton from "./RefreshMapButton.jsx";
import styles from "./MapButtons.module.css";

const MapButtons = ({ softStyleReload, hardRefreshMap }) => {
  return (
    <div className={styles.mapButtonsContainer}>
      <HelpButton />
      <LeaveReviewButton />
      <RefreshMapButton onClick={softStyleReload} onLongPress={hardRefreshMap} />
    </div>
  );
};

export default MapButtons;