import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';

const Popup = ({ children, coordinates, onClose }) => {
  const popup = useRef(new mapboxgl.Popup({ closeButton: false }));
  const [container] = useState(() => document.createElement('div')); // Create a container once

  useEffect(() => {
    const currentPopup = popup.current;
    currentPopup.addTo(window.GlobalMap);
    return () => currentPopup.remove();
  }, []);

  useEffect(() => {
    popup.current.setLngLat(coordinates);
  }, [coordinates]);

  useEffect(() => {
    popup.current.on('close', onClose);
    return () => popup.current.off('close', onClose);
  }, [onClose]);

  useEffect(() => {
    popup.current.setDOMContent(container); // Attach the container
  }, [container]);

  return createPortal(children, container);
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClose: PropTypes.func
};

Popup.defaultProps = {
  onClose: () => {}
};

export default Popup;
