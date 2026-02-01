import React from 'react';
import styles from './PointPopupContent.module.css';

/* eslint-disable react/prop-types */
export default function PointPopupContent({ idx, date, time, timezone }) {
  const dateLine = date || '';
  const timeLine = [time, timezone].filter(Boolean).join(' ');
  return (
    <div className={styles.popUp}>
      <div className={styles.popUpContent}>
        <div className={styles.popUpHeader}>
          <h2 className={`map-heading ${styles.locationNumber}`}>{`Location #${idx ?? ''}`.trim()}</h2>
        </div>
      </div>
      <div className={styles.popUpBody}>
        <h3 className={`map-heading ${styles.dateTimeHeading}`}>Details:</h3>
        <p className={`map-body ${styles.dateTimeText}`}>
          <strong>Date: </strong> {dateLine && dateLine}<br/>
          <strong>Time: </strong>{dateLine && timeLine && ' '}
          {timeLine && timeLine}
          {!dateLine && !timeLine && 'Time: unknown'}
        </p>
      </div>
    </div>
  );
}