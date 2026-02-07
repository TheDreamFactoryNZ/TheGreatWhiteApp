import React, { useEffect, useState } from 'react';
import styles from './RefreshMapButton.module.css';

/* eslint-disable react/prop-types */
const RefreshMapButton = ({ onClick = () => {} }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={styles.refreshMapContainer}>
      <button
        type="button"
        className={styles.refreshMapIcon}
        aria-label="Refresh map (requires internet connection)"
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default RefreshMapButton;
