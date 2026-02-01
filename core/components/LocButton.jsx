import React from 'react';
import styles from './TrackLocButton.module.css';

import pin from '../assets/images/button_icons/map-pin.svg?url';

/* eslint-disable react/prop-types */
const LocButton = ({ subject, handleOnLocButtonClicked, iconText, iconTextClassName }) => {
  const label = subject?.name
    ? `Fly to ${subject.name}'s last location`
    : 'Fly to subject location';
  
  function flyTo () {
    handleOnLocButtonClicked(subject.last_position.geometry.coordinates);
  }

  return (
    <>
    <button
      id="subject-location-button"
      className={styles.iconButton}
      type="button"
      aria-label={label}
      title={label}
      onClick={() =>flyTo()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <img
        width='24' height='24' className='hover' src={pin}
      />
      {iconText ? <span className={`${styles.iconText} ${iconTextClassName || ''}`}>{iconText}</span> : null}
      </button>
    </>
  );
};

export default LocButton;
