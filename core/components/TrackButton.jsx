import React, { useContext } from 'react';
import TrackContext from '../context/TrackContext.js';
import styles from './TrackLocButton.module.css';

import tracksOn from '../assets/images/button_icons/subject-tracks--active.svg';
import tracksOff from '../assets/images/button_icons/subject-tracks--inactive.svg';

/* eslint-disable react/prop-types */
const TrackButton = ({ subject }) => {
    const label = subject?.name
    ? `View ${subject.name}'s tracks`
    : 'View this shark\'s tracks';

  const { displayTracks, setTracks, tracks } = useContext(TrackContext);

  const vis = !!tracks[subject.id];
  const imgSrc = vis ? tracksOn : tracksOff;

  const onTrackButtonClick = () => {
    const nextVis = !vis;
    const update = [subject.id, nextVis];
    // Functional update to avoid stale overwrites; ensures both buttons stay in sync
    setTracks(prev => ({ ...prev, [subject.id]: nextVis }));
    displayTracks(update);
  };

  return (
    <>
    <button
      id='subject-track-button'
      className={styles.iconButton}
      type="button"
      aria-label={label}
      title={label}
      onClick={onTrackButtonClick}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <img
        width='24'
        height='24'
        src={imgSrc}
      />
      </button>
    </>
  );
};

export default TrackButton;
