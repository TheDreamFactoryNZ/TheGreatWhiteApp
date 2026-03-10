import React, { useContext } from 'react';
import styles from './IconButton.module.css';

import StoryIcon from '@images/button_icons/subject-story.svg?component';

const StoryButton = (props) => {
  const {
    subject,
    subjectData: data,
    legendOpen,
    onLegendStateToggle,
    storyButtonClass,
    iconText,
    iconTextClassName,
    width,
    height,
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

  // Resolve dimensions: "auto" → undefined (no attribute), falsy → default "24px"
  const resolvedWidth = width === "auto" ? undefined : width || "24px";
  const resolvedHeight = height === "auto" ? undefined : height || "24px";

  const button = (
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
      <StoryIcon width={resolvedWidth} height={resolvedHeight} className={styles.iconSvg} aria-hidden="true" />
      {iconText ? <span className={`${styles.iconText} ${iconTextClassName || ''}`}>{iconText}</span> : null}
      </button>
  );

  return iconText
  ? <div className={styles.iconTextContainer}>{button}</div>
  : button;
};

export default StoryButton;
