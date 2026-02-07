import React, { useEffect, useState } from 'react';
import styles from './LeaveReviewButton.module.css';

/* eslint-disable react/prop-types */
const LeaveReviewButton = () => {

  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className={styles.leaveReviewContainer}>
      <button
        type="button"
        className={styles.leaveReviewIcon}
        onClick={() => setReviewOpen(o => !o)}
        aria-expanded={reviewOpen}
        aria-label="Submit feedback and leave a review"
      />


      <div
        className={[
          styles.supportContentContainer,
          !reviewOpen && styles.hidden,
          styles.popupContainer,
        ].filter(Boolean).join(' ')}
      >
        <div className={styles.supportHeaderContainer}>
          <h2 className={styles.supportHeader}>Showing Your Support</h2>
          <img
            src={close}
            draggable={false}
            className={styles.closeIcon}
            onClick={() => setReviewOpen(false)}
          />
        </div>
        <div className={styles.supportItemsContainer}>
          <div className={styles.supportItem}>
            <div className={styles.supportTextContainer}><p><strong>By purchasing this mobile app, you're doing your part to support the conservation and study of Great White Sharks.</strong></p><p>Enjoying the app? Want to see more sharks and locations? The support of the public is what makes this app possible.</p><p>For the first time in New Zealand, supporting a conservation study of Great White Sharks is made easy and accessible for the general public via this interactive app.</p><p><strong>The more support the app gets, the better resourced we are to improve it and tag more sharks (meaning even more locations).</strong></p><p>Now that you've purchased the app, leaving a review will help make this a reality. <em>Already left a review?</em> Thank you for your support!</p><p>Interested in sponsoring a tag? e-mail <a href="mailto:sustainableoceansociety@gmail.com">sustainableoceansociety@gmail.com</a> for further details.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewButton;
