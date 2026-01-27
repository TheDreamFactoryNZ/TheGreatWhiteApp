import React, { useContext } from 'react';
import TrackButton from './TrackButton.jsx';
import LocButton from './LocButton.jsx';
import './Legend.css';

import storyIcon from '../assets/images/button_icons/story-f.png';
import TrackContext from '../context/TrackContext.js';

/* eslint-disable react/prop-types */
const Animal = ({ animal, configData, animalOnLocClicked, onNameClick, displayStory }) => {
  const { tracks } = useContext(TrackContext);
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
  let hover = 'hover';
  let animalName = 'animal-name ';
  let display = { };
  let truncAnimalName = animal.name;

  if (truncAnimalName.length > 15) {
    truncAnimalName = truncAnimalName.substring(0, 15) + '...';
  }

  const isTrackOn = !!(tracks && tracks[animal.id]);
  const trackState = isTrackOn ? ' bold ' : '';

  if (configData === undefined || !displayStory) {
    hover = 'default';
    animalName = '';
    display = { visibility: 'hidden' };
  }

  return (
    <>
      <div
        className='animal-legend-content' onClick={(e) => {
          const name = document.getElementById(animalId);
          const clicked = e.target;

          if (name.classList.contains('animal-name') && clicked.id !== 'subject-track-button' &&
          clicked.id !== 'subject-location-button') {
            onNameClick([animal, configData.subjects[animal.id]]);
            name.classList.toggle('animal-name');
            name.classList.toggle('hover');
          }
        }}
      >
        <div id='animal-color' style={backgroundColor} />
        <div
          className={'fit-content ' + animalName + hover} id={animalId}
        />
        <div id='animal-color' />
        <div className={'animal-name-bullet ' + animalName + hover} id={animalId}>
          <div id='animal-bullet'><div style={bulletBackgroundStyle} /></div>
          <div
            className={'animal-name-style ' + hover + trackState}
            id={animal.name.replace(' ', '-')}
          >{truncAnimalName}
          </div>
        </div>
        <div id='track-buttons' className={hover}>
          <TrackButton subject={animal} />
          <LocButton
            subject={animal}
            handleOnLocButtonClicked={animalOnLocClicked}
          />
        </div>
        <img id='story-button' className={hover} style={display} width='7px' height='10px' src={storyIcon} />
      </div>
    </>
  );
};

export default Animal;
