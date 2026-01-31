import React, { useContext } from 'react';
import TrackButton from './TrackButton.jsx';
import LocButton from './LocButton.jsx';
import styles from './Animal.module.css';

import storyIcon from '../assets/images/button_icons/view-story-arrow.svg';
import TrackContext from '../context/TrackContext.js';

/* eslint-disable react/prop-types */
const Animal = ({ animal, configData, animalOnLocClicked, onNameClick, displayStory, isStoryView: isStoryViewProp }) => {
  const { tracks } = useContext(TrackContext);
  const isStoryView = (isStoryViewProp ?? (configData === undefined));
  const backgroundColor = { backgroundColor: animal.color };
  // Determine bullet color based on subject status in configData
  const statusColorMap = {
    active: '#4CBE23',
    inactive: '#FFC60A',
    deactivated: '#B63E4E'
  };
  const rawStatus = (configData && configData.subjects && configData.subjects[animal.id] && configData.subjects[animal.id].status)
    ? String(configData.subjects[animal.id].status).trim().toLowerCase()
    : '';
  const bulletBackgroundStyle = { backgroundColor: statusColorMap[rawStatus] || '#B0B0B0' };
  const animalId = animal.id + ' animal';
  let animalName = 'animal-name ';
  let display = { };

  const isTrackOn = !!(tracks && tracks[animal.id]);
  const trackState = isTrackOn ? ' tracksActive ' : '';

  if (configData === undefined || !displayStory) {
    animalName = '';
    display = { visibility: 'hidden' };
  }

  return (
    <>
      <div
        className={styles.animalLegendContent} onClick={(e) => {
          const fromButton = e.target.closest('#subject-track-button, #subject-location-button');
          if (fromButton) return;

          const name = document.getElementById(animalId);
          const clicked = e.target;

          if (name.classList.contains('animal-name') && clicked.id !== 'subject-track-button' &&
          clicked.id !== 'subject-location-button') {
            onNameClick([animal, configData.subjects[animal.id]]);
            name.classList.toggle('animal-name');
          }
        }}
      >
        <div className={`${styles.animalNameStatus} ${animalName} ${isStoryView ? styles.animalStoryView : ''}`} id={animalId}>
          <div className={styles.animalStatus}><div style={bulletBackgroundStyle} /></div>
          <div
            className={`${styles.animalNameStyle} ${trackState ? styles.tracksActive : ''}`}
            id={animal.name.replace(' ', '-')}
          >
            <h3 className={`${'map-heading'} ${styles.animalNameText}`} title={animal.name}>
            {animal.name}
            </h3>
          </div>
        </div>
        <div className={styles.trackButtons}>
          <TrackButton subject={animal} />
          <LocButton
            subject={animal}
            handleOnLocButtonClicked={animalOnLocClicked}
          />
          <img className={styles.storyButton} style={display} src={storyIcon} />
        </div>
      </div>
    </>
  );
};

export default Animal;
