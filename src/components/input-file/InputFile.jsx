/**@module InputFile */
import React from "react";
import "./InputFile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faXmark } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../Spinner/Spinner";

/**
 * @component
 * @param {string} inputId id of input field
 * @param {name} name name of field
 * @param {funct} inputOnChange function starts when input was changed
 * @param {string} downloadFileInfoClassName name of div block
 * @param {boolean} isLoading if is file loading: true
 * @param {string} selectedFileName name of new selected file
 * @param {string} cancelIconClassName name of icon: defines if icon is visible
 * @param {funct} cancelIconOnClick cancel changings
 * @param {string} abelClassName me of label: defines if icon is visible
 * 
 * 
 * @description block for input file field
 */
const InputFile = (props) => {
  return (
    <>
      <input
        type="file"
        id={props.inputId}
        name={props.name}
        style={{ display: "none" }}
        onChange={props.inputOnChange}
      />
      <div className={props.downloadFileInfoClassName}>
        <Spinner
          className={props.isLoading ? "spinner" : "spinner spinner--disactive"}
        />
        <FontAwesomeIcon icon={faPaperclip} />
        <div className="fileSelector">{props.selectedFileName}</div>
        <div
          className={props.cancelIconClassName}
          onClick={props.cancelIconOnClick}
        >
          <FontAwesomeIcon
            icon={faXmark}
            style={{ color: "red", fontSize: "22px", fontWeight: "600" }}
          />
        </div>
      </div>
      <label htmlFor={props.name} className={props.labelClassName}>
        Attach file
      </label>
    </>
  );
};

export default InputFile;
