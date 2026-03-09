import React, { useEffect, useRef, useState } from "react";
import styles from "./RefreshMapButton.module.css";

const LONG_PRESS_MS = 600; // Threshold for long press of refresh button
const COOLDOWN_MS = 5000; // Minimum time between refreshes to prevent spamming

/* eslint-disable react/prop-types */
const RefreshMapButton = ({ onClick = () => {}, onLongPress = () => {} }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const timerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const didLongPressRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setIsCoolingDown(true);
    cooldownTimerRef.current = setTimeout(() => {
      setIsCoolingDown(false);
    }, COOLDOWN_MS);
  };

  const clearLongPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePressStart = (e) => {
    if (isCoolingDown) return;
    e.stopPropagation();
    didLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      onLongPress();
      startCooldown();
    }, LONG_PRESS_MS);
  };

  const handlePressEnd = (e) => {
    e.stopPropagation();
    clearLongPressTimer();
    if (isCoolingDown) return;
    if (!didLongPressRef.current) {
      startCooldown();
      onClick();
    }
  };

  const handlePressCancel = () => {
    clearLongPressTimer();
  };

  const isDisabled = !isOnline || isCoolingDown;

  window.dispatchEvent(new CustomEvent("gw:refresh-ui"));

  return (
    <>
      <button
        type="button"
        className={`${styles.refreshMapIcon} ${
          isCoolingDown ? styles.coolingDown : ""
        }`}
        aria-label={
          isCoolingDown
            ? "Please wait before refreshing again..."
            : "Refresh map (hold for full reload)"
        }
        disabled={isDisabled}
        // Mouse events
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        // Touch events
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressCancel}
      />
    </>
  );
};

export default RefreshMapButton;
