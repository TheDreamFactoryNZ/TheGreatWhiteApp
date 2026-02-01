import React, { useContext } from 'react';
import styles from './IconButton.module.css';

import storyIcon from '@images/button_icons/subject-story.svg';

const StoryButton = (props) => {
  const {
    subject,
    subjectData: data,
    legendOpen,
    onLegendStateToggle,
    storyButtonClass,
    iconText,
    iconTextClassName
  } = props;

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
      className={[styles.iconButton, storyButtonClass].filter(Boolean).join(' ')}
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
      {iconText ? <span className={`${styles.iconText} ${iconTextClassName || ''}`}>{iconText}</span> : null}
      </button>
    </>
  );
};

export default StoryButton;
