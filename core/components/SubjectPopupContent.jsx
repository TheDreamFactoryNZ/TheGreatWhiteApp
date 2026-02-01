import React from 'react';
import { TrackButton, StoryButton } from './buttons';

import styles from './SubjectPopupContent.module.css';

/* eslint-disable react/prop-types */
const SubjectPopup = (props) => {
  // TODO: detailed handling of missing data fields
  const data = props.subjectData;
  const subject = props.subject;
  const { legendOpen, onLegendStateToggle } = props;

  let sex = '';
  if (subject.sex !== undefined) {
    sex = subject.sex.charAt(0).toUpperCase() + subject.sex.slice(1);
  }

  let age = '';
  if (data !== undefined && data.age !== undefined) {
    age = data.age;
  }

  let speciesSource = subject.common_name ?? subject.subject_subtype;

  let species = speciesSource
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  let date = subject.last_position.properties.DateTime;
  date = date.substring(0, 10) + ' ' + date.substring(11, 16);

  let display = { display: 'flex' };
  if (!subject.display_story) {
    display = { display: 'none' };
  }

  function returnImage() {
    if (data !== undefined && data.pictures !== undefined && data.pictures.length > 0) {
      return <img className={styles.popUpImage} src={data.pictures[0].path} alt='picture' />;
    }
  }

  return (
    <div className={styles.popUp}>
      <div className={styles.imageContainer}>
        {returnImage()}
      </div>
      <div className={styles.popUpContent}>
        <div className={styles.popUpHeader}>
          <h2 className={`${'map-heading'} ${styles.subjectName}`}>{subject.name}</h2>
          <p className={`${styles.species}`}>{species}</p>
        </div>
        <div className={styles.popUpBody}>
          <div className={styles.subjectSummary}>
            <h3 className={`${'map-heading'} ${styles.summaryHeading}`}>Info:</h3>
            <p className={`${'map-body'} ${styles.summaryText}`}>
              <strong>Sex: </strong>{sex}<br />
              <strong>Total Length: </strong>{age}<br />
              {/*<strong>Tag Sponsor: </strong>{tagSponsor}*/}</p>
            {data && data.fun_fact && <p><i>{data.fun_fact}</i><br />
            </p>}
            <p className={`${'map-body'} ${styles.summaryText}`}><strong>Last seen:</strong><br />{date} UTC<br /><em>No recent location? This shark's probably deep underwater, yet to surface.</em></p>
          </div>
          <div className={styles.popUpButtonsContainer}>
              <TrackButton
              trackButtonClass={styles.popUpButton}
              iconTextClassName={styles.popUpButtonText}
              subject={subject}
              iconText={`See ${subject.name}'s journey`}/>
              
              <StoryButton
              storyButtonClass={styles.popUpButton}
              iconTextClassName={styles.popUpButtonText}
              subject={subject}
              subjectData={data}
              legendOpen={legendOpen}
              onLegendStateToggle={onLegendStateToggle}
              onStoryClick={props.onStoryClick}
              iconText={`See ${subject.name}'s factsheet`}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPopup;
