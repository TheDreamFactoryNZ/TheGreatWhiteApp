import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGlobalCloseEvent } from "@hooks/useGlobalCloseEvent";
import mapboxgl from "mapbox-gl";
import PropTypes from "prop-types";

const Popup = ({ children, coordinates, onClose }) => {
  const popup = useRef(new mapboxgl.Popup({ closeButton: false }));
  const disposedRef = useRef(false);
  const [container] = useState(() => document.createElement("div"));

  // Mount: attach to map and set initial DOM/content
  useEffect(() => {
    try {
      if (window.GlobalMap) {
        popup.current.addTo(window.GlobalMap);
        popup.current.setDOMContent(container);
        popup.current.setLngLat(coordinates);
      }
    } catch (e) {
      // ignore attach errors
    }
    return () => {
      // Cleanup: detach events and remove popup from map safely
      try {
        disposedRef.current = true;
        popup.current.off("close", onClose);
        popup.current.remove();
      } catch (err) {
        // ignore remove errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update coordinates
  useEffect(() => {
    try {
      if (!disposedRef.current) popup.current.setLngLat(coordinates);
    } catch (e) {
      // ignore update errors
    }
  }, [coordinates]);

  // Close handler lifecycle
  useEffect(() => {
    try {
      popup.current.on("close", onClose);
    } catch (e) {}
    return () => {
      try {
        popup.current.off("close", onClose);
      } catch (e) {}
    };
  }, [onClose]);

  // Container updates (rare, but guard anyway)
  useEffect(() => {
    try {
      if (!disposedRef.current) popup.current.setDOMContent(container);
    } catch (e) {}
  }, [container]);

  // Close on map refresh
  useGlobalCloseEvent("gw:refresh-ui", () => popup.current.remove());

  return createPortal(children, container);
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClose: PropTypes.func,
};

Popup.defaultProps = {
  onClose: () => {},
};

export default Popup;
