import React from 'react';
import styles from './Legend.module.css';
import Animal from './Animal.jsx';
import sanitizeHtml from '../utils/sanitizeHtml.js';

import doubleCaret from '@images/button_icons/double-caret.svg';
import tdfLogo from '@images/the-dream-factory-n-slogan-white.svg';
import erLogo from '@images/LogoEarthRanger.png';
import BackArrow from '@images/button_icons/back-arrow.svg?component';

/* eslint-disable react/prop-types */
const Legend = ({
  subs, subjectData, onLocClick, legSub, onReturnClick, onStoryClick,
  legendOpen, onLegendStateToggle, title
}) => {
  const doubleCaretIcon = doubleCaret;

  function toggleLegend() {
    onLegendStateToggle();
  }

  function display() {
    if (legSub === undefined) {
      return (
        <div className={styles.legendContent}>
          <div className={styles.title}>
            <div className={styles.tracker}>
              <h1 className={styles.mapTitle}>{title !== null ? title : 'Animal Tracker'}</h1>
            </div>
            <div className={styles.developerLogo}>
              <span className={styles.developerText}>Developed by</span>
              <div className={styles.developerContainer}>
                <div className={styles.developerItem}>
                  <a href='https://thedreamfactory.nz/' rel='noreferrer' target='_blank'>
                    <img draggable='false' src={tdfLogo} />
                  </a>
                </div>
                <div className={`${styles.developerItem} ${styles.dividerbox}`} />
                <div className={styles.developerItem}>
                  <a href='https://earthranger.com/' rel='noreferrer' target='_blank'>
                    <img draggable='false' src={erLogo} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.subs}>
            {subs === undefined ? <div />
              : subs.map((s) => (
                <div key={s.id} className={styles.subjectDiv}>
                  <Animal
                    animal={s} configData={subjectData}
                    key={s.id}
                    animalOnLocClicked={onLocClick} onNameClick={onStoryClick}
                    displayStory={s.display_story}
                  />
                </div>
              ))}
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className={styles.legendContent}>
            <div className={styles.title}>
              <div className={styles.tracker}>
                <h1 className={styles.mapTitle}>{title !== null ? title : 'Animal Tracker'}</h1>
              </div>
              <div className={styles.developerLogo}>
                <span className={styles.developerText}>Developed by</span>
                <div className={styles.developerContainer}>
                  <div className={styles.developerItem}>
                    <a href='https://thedreamfactory.nz/' rel='noreferrer' target='_blank'>
                      <img draggable='false' src={tdfLogo} />
                    </a>
                  </div>
                  <div className={`${styles.developerItem} ${styles.dividerbox}`} />
                  <div className={styles.developerItem}>
                    <a href='https://earthranger.com/' rel='noreferrer' target='_blank'>
                      <img draggable='false' src={erLogo} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={() => onReturnClick(undefined)} className={styles.return}>
              <BackArrow draggable='false' width="7px" height="10px" className={styles.backArrow} />
              <p className="map-body">Back</p>
            </div>
            <div className={styles.animalStory}>
              <div className={styles.subjectDiv}>
                <Animal
                  animal={legSub[0]}
                  key={legSub[0].id}
                  configData={subjectData}
                  isStoryView={true}
                  animalOnLocClicked={onLocClick}
                />
              </div>
              {legSub[1].pictures.map((pic) => {
                return <img draggable='false' className={styles.subImage} key={pic} src={pic.path} alt='picture' />;
              })}
              <div className={styles.subContentContainer}>
                <h2 className="map-heading">About {legSub[0].name}</h2>
                <div className={styles.subContentBody} dangerouslySetInnerHTML={{ __html: sanitizeHtml(legSub[1].detail_description || '') }} />
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className={`${styles.legend} ${legendOpen ? styles.legendOpen : styles.legendClose}`}>
        <div className={styles.legendOpenButton} onClick={() => toggleLegend()}>
          <img draggable='false' src={doubleCaretIcon} />
        </div>
        {display()}
      </div>
    </>
  );
};

export default Legend;
