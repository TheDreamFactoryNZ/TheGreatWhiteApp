import React from 'react';
import { TrackButton, StoryButton } from '../buttons/index.js';
import LastSeenInfo from '../LastSeenInfo.jsx';
import { getSubjectStatusInfo } from '@utils/subjectStatus.js';
import { getFormattedAttributes } from '@utils/attributeDefs.js';

import styles from './SubjectPopupContent.module.css';

/* eslint-disable react/prop-types */
const SubjectPopup = (props) => {
  // TODO: detailed handling of missing data fields
  const data = props.subjectData;
  const subject = props.subject;
  const { legendOpen, onLegendStateToggle } = props;

  // Merge API fields into config attributes (config takes precedence, API is fallback)
  const apiSex = subject?.sex
    ? subject.sex.charAt(0).toUpperCase() + subject.sex.slice(1)
    : null;

  const mergedData = {
    ...data,
    attributes: {
      // API fallbacks first (will be overwritten by config if present)
      ...(apiSex && { sex: apiSex }),
      // Config takes precedence (spread last = wins)
      ...data?.attributes,
    },
  };

  let featuredAttributes = [];
  try {
    featuredAttributes = getFormattedAttributes(mergedData, true);
  } catch (err) {
    console.error('Failed to parse subject attributes:', err);
  }

  let speciesSource = subject.common_name ?? subject.subject_subtype;

  let species = speciesSource
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const { status } = getSubjectStatusInfo(subject, data);

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
              {featuredAttributes.map((attribute) => (
                <React.Fragment key={attribute.key}>
                  <strong>{attribute.label}: </strong>{attribute.value}<br />
                </React.Fragment>
              ))}
            </p>
            {data && data.fun_fact && <p><i>{data.fun_fact}</i><br />
            </p>}
            <LastSeenInfo
              isoDate={subject?.last_position?.properties?.DateTime}
              timezone="Etc/UTC"
              timezoneLabel="UTC"
              expandable={true}
              noLayoutShift={true}
              status={status}
              className={`${'map-body'} ${styles.summaryText}`}
            />
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
