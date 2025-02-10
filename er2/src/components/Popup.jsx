import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types'; // Import PropTypes

/* Renderless wrapper for React-ified Mapbox GL popups to ensure content updates stay in sync with app state */
const Popup = ({ children, coordinates, onClose }) => {
  const popup = useRef(new mapboxgl.Popup({ closeButton: false }));

  useEffect(() => {
    const currentPopupRefValue = popup.current;
    currentPopupRefValue.addTo(window.GlobalMap);

    return () => currentPopupRefValue.remove();
  }, []);

  useEffect(() => {
    popup.current.setLngLat(coordinates);
  }, [coordinates]); // No need to include `popup` in dependencies

  useEffect(() => {
    const currentPopupRefValue = popup.current;
    currentPopupRefValue.on('close', onClose);

    return () => currentPopupRefValue.off('close', onClose);
  }, [onClose]); // No need to include `popup` in dependencies

  useEffect(() => {
    const container = document.createElement('div');
    ReactDOM.render(children, container);
    popup.current.setDOMContent(container);
  }, [children]); // No need to include `popup` in dependencies

  return null;
};

// Add PropTypes validation
Popup.propTypes = {
  children: PropTypes.node.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired, // Expects [lng, lat]
  onClose: PropTypes.func
};

// Set default props (optional)
Popup.defaultProps = {
  onClose: () => {}
};

export default Popup;
