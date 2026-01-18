import React, { useContext } from 'react';
import TrackContext from '@track-context';
import './Legend.css';

import tracksOn from '../assets/images/button_icons/pin_tracks-green.png';
import tracksOff from '../assets/images/button_icons/pin_tracks-gray.png';

/* eslint-disable react/prop-types */
const TrackButton = ({ subject }) => {
  const { displayTracks, setTracks, tracks } = useContext(TrackContext);

  const vis = !!tracks[subject.id];
  const imgSrc = vis ? tracksOn : tracksOff;

  const onTrackButtonClick = () => {
  const nextVis = !vis;
  const update = [subject.id, nextVis];
    // One-line identity log to confirm unified context source
    try { console.log('[TrackButton] sameSymbol', TrackContext === window.__gw_TrackContext); } catch (e) {}
  // Functional update to avoid stale overwrites; ensures both buttons stay in sync
  setTracks(prev => ({ ...prev, [subject.id]: nextVis }));
  displayTracks(update);
  };

  return <img width='24' height='24' className='hover' src={imgSrc} id='subject-track-button' onClick={onTrackButtonClick} />;
};

export default TrackButton;
