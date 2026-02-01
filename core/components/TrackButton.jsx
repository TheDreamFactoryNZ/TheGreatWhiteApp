import React, { useContext } from 'react';
import TrackContext from '../context/TrackContext.js';
import styles from './TrackLocButton.module.css';

import tracksOn from '../assets/images/button_icons/subject-tracks--active.svg?url';
import tracksOff from '../assets/images/button_icons/subject-tracks--inactive.svg?url';

import TracksIcon from '../assets/images/button_icons/subjectTracks.svg?component';

/* eslint-disable react/prop-types */
const TrackButton = ({ subject }) => {
    const label = subject?.name
    ? `View ${subject.name}'s tracks`
    : 'View this shark\'s tracks';

  const { displayTracks, setTracks, tracks } = useContext(TrackContext);

  const vis = !!tracks[subject.id];
//  const imgSrc = vis ? tracksOn : tracksOff;

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
      aria-pressed={vis}
      data-active={vis}
      onClick={onTrackButtonClick}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
    <TracksIcon width="24px" height="24px" className={styles.iconSvg} aria-hidden="true" />
      </button>
    </>
  );
};

export default TrackButton;
