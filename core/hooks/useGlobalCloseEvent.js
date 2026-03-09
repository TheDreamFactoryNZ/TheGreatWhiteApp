import { useEffect } from "react";

/**
 * Custom hook to handle global close events.
 * @param {string} eventName - The name of the event to listen for (e.g., "gw:close-all-popups").
 * @param {function} closeFn - The function to call when the event fires.
 */

export function useGlobalCloseEvent(eventName, closeFn) {
  useEffect(() => {
    window.addEventListener(eventName, closeFn);
    return () => window.removeEventListener(eventName, closeFn);
  }, [eventName, closeFn]);
}