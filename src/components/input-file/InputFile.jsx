/**@module InputFile */
import React from "react";
import './InputFile.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faXmark } from "@fortawesome/free-solid-svg-icons";

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
      <div
        className={props.downloadFileInfoClassName}
      >
        <FontAwesomeIcon icon={faPaperclip} />
        <div className="fileSelector">{props.selectedFileName}</div>
        <div className={props.cancelIconClassName} onClick={props.cancelIconOnClick}>
          <FontAwesomeIcon
            icon={faXmark}
            style={{ color: "red", fontSize: "22px", fontWeight: "600" }}
          />
        </div>
      </div>
      <label
        htmlFor={props.name}
        className={props.labelClassName}
      >
        Загрузить файл
      </label>
    </>
  );
};

export default InputFile;
