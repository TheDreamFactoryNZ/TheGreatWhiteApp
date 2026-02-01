import React, { useState } from 'react';
import styles from './HelpButton.module.css';

import close from '../assets/images/button_icons/close.svg';
import zoom from '../assets/images/button_icons/help-zoom.svg';
import reset from '../assets/images/button_icons/help-pitch-reset.svg';
import control from '../assets/images/button_icons/control-key.svg';
import animalIcon from '../assets/images/button_icons/shark-icon-default-tip.svg';
import activeAnimalIcon from '../assets/images/button_icons/shark-icon-active-tip.svg';
import inactiveAnimalIcon from '../assets/images/button_icons/shark-icon-inactive-tip.svg';
import deactivatedAnimalIcon from '../assets/images/button_icons/shark-icon-deactivated-tip.svg';
import pin from '../assets/images/button_icons/map-pin.svg';
import tracks from '../assets/images/button_icons/subject-tracks--inactive.svg';
import story from '../assets/images/button_icons/subject-story.svg';
import refresh from '../assets/images/button_icons/refresh.svg';

/* eslint-disable react/prop-types */
const HelpButton = () => {

  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <div className={styles.tipsContainer}>
      <button
        type="button"
        className={styles.tipsToggleIcon}
        onClick={() => setTipsOpen(o => !o)}
        aria-expanded={tipsOpen}
        aria-label="Toggle help tips"
      />


      <div
        className={[
          styles.tipsContentContainer,
          !tipsOpen && styles.hidden,
          styles.popupContainer,
        ].filter(Boolean).join(' ')}
      >
        <div className={styles.tipsHeaderContainer}>
          <h2 className={styles.tipsHeader}>Interacting With the Map</h2>
          <img
            src={close}
            draggable={false}
            className={styles.closeIcon}
            onClick={() => setTipsOpen(false)}
          />
        </div>
        <div className={styles.tipItemsContainer}>
          <div className={styles.tipItem}>
            <div className={`${styles.tipIconContainer} ${styles['tipIconVertical']}`}><img className={styles.tipIcon} width='20' height='40' src={zoom} /></div>
            <div className={styles.tipTextContainer}><p>Zoom in and out with the + and - buttons.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={reset} /></div>
            <div className={styles.tipTextContainer}><p>Press to reset map orientation, hold and drag to adjust pitch.</p></div>
          </div>
          <div className={`${styles.tipItem} desktopItem`}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={control} /></div>
            <div className={styles.tipTextContainer}><p>Hold Ctrl / control key and drag left to right with mouse to rotate view, up and down to adjust pitch.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={animalIcon} /></div>
            <div className={styles.tipTextContainer}><p>Choose a shark icon on the map to view summary and date of last known location.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={activeAnimalIcon} /></div>
            <div className={styles.tipTextContainer}><p>A green light means the tag on the shark is active and transmitting location data.</p><p><strong>No recent updates?</strong> This is because the shark hasn't surfaced high enough to transmit a location to satellites.</p></div>
          </div>
          {/* vvv This tip will be restored when automatic status updates are implemented vvv */}
          <div className={styles.tipItem} style={{ display: 'none' }}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={inactiveAnimalIcon} /></div>
            <div className={styles.tipTextContainer}><p>These sharks have not transmitted a location for an extended period of time and are inactive.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={deactivatedAnimalIcon} /></div>
            <div className={styles.tipTextContainer}><p>These sharks have lost their tags and are confirmed no longer transmitting.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={pin} /></div>
            <div className={styles.tipTextContainer}><p>Jump to a shark's location.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={tracks} /></div>
            <div className={styles.tipTextContainer}><p>Display a shark's track.</p></div>
          </div>
          <div className={styles.tipItem} style={{ display: 'none' }}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='24' height='24' src={refresh} /></div>
            <div className={styles.tipTextContainer}><p>Refresh and update locations (internet connection required)</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipIconContainer}><img className={styles.tipIcon} width='7' height='10' src={story} /></div>
            <div className={styles.tipTextContainer}><p>Display a shark's story.</p></div>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipTextContainer}><p><strong>Why hasn't there been an update?</strong> A shark needs to breach the surface of the ocean to transmit its location to satellites.</p><p>These majestic creatures can spend <em><strong>months</strong></em> underwater, so it is not unusual for there to be periods of inactivity.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpButton;
