import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const ButtonHide = ({ inputId, className }) => {
  const [isHidden, setIsHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setIsHidden(!isHidden);
    const input = document.getElementById(inputId);
    if (input) {
      input.type = isHidden ? "text" : "password";
    }
  };

  return (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className={className}
    >
      <FontAwesomeIcon icon={isHidden ? faEyeSlash : faEye} />
    </button>
  );
};

// Menambahkan validasi PropTypes
ButtonHide.propTypes = {
  className: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
};

export default ButtonHide;
