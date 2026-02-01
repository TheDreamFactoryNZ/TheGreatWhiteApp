import React, { useContext } from 'react';
import styles from './TrackLocButton.module.css';

import storyIcon from '../assets/images/button_icons/subject-story.svg';

const StoryButton = (props) => {
  const data = props.subjectData;
  const subject = props.subject;
  const { legendOpen, onLegendStateToggle } = props;

  const label = subject?.name
    ? `View ${subject.name}'s story`
    : 'View this shark\'s story';

  let display = { display: 'flex' };
  if (!subject.display_story) {
    display = { display: 'none' };
  }

  const handleStoryClick = () => {
    props.onStoryClick([subject, data]);
    if (!legendOpen) {
      onLegendStateToggle();
    }
  };

  return (
    <>
    <button
      id="subject-story-button"
      className={styles.iconButton}
      type="button"
      aria-label={label}
      title={label}
      onClick={handleStoryClick}
      style={display}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <img
        width='24' height='24' className='hover' src={storyIcon}
      />
      </button>
    </>
  );
};

export default StoryButton;
