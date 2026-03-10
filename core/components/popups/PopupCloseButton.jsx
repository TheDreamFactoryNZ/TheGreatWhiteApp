import React from "react";
import PropTypes from "prop-types";
import styles from "./PopupCloseButton.module.css"; // Adjust path as needed

const PopupCloseButton = ({ onClose, closeClass }) => (
  <button
    type="button"
    className={`${styles.popUpCloseButton} ${closeClass}`}
    aria-label="Close popup"
    onClick={onClose}
  >
  </button>
);

PopupCloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  closeClass: PropTypes.string,
};

export default PopupCloseButton;