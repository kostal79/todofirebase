/**@Module Spinner */
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import './Spinner.css'

/**
 * Spinner component
 * @param {*} props - ClassName
 * @description spin when file is uploading or downloading
 */
const Spinner = (props) => {
    return (
        <div
        className={props.className}
      >
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    );
};

export default Spinner