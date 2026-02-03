import React, { useState } from 'react';
import styles from './RefreshMapButton.module.css';

import refresh from '@images/button_icons/refresh.svg';

/* eslint-disable react/prop-types */
const RefreshMapButton = () => {

  return (
    <div className={styles.refreshMapContainer}>
      <button
        type="button"
        className={styles.refreshMapIcon}
        onClick={null}
        aria-label="Refresh map (requires internet connection)"
      />
    </div>
  );
};

export default RefreshMapButton;
