/** @module FormUpdate */

import React from "react";
import InputDate from "../input-date/InputDate";
import InputDescription from "../input-desctription/InputDescription";
import InputFile from "../input-file/InputFile";
import InputTitle from "../input-title/InputTitle";
import "./FormUpdate.css";

/**
 * Component FormUpdate
 * @param {*} props 
 * @description makes form for updating todo 
 */
const FormUpdate = (props) => {
  return (
    <form
      onSubmit={props.submitUpdate}
      className={
        props.update
          ? "form form__update form__update--active"
          : "form form__update form__update--disactive"
      }
    >
      <InputTitle
        value={props.update ? props.update.data.title : "..."}
        onChange={props.handleUpdateTitle}
        className="update update__title"
        name="updateInputTitle"
      />
      <InputDescription
        name="descriptionUpdate"
        value={props.update ? props.update.data.description : "..."}
        onChange={props.handleUpdateDescription}
        className="update update__description"
      />
      <InputDate
        min={props.currentDate}
        className="update update__date"
        onChange={props.handleUpdateDate}
        value={props.update ? props.update.data.todoDate : ""}
        name="updateDate"
      />
      <InputFile
        inputId="fileUpdateElement"
        name="fileUpdateElement"
        inputOnChange={props.loadFileHandler}
        downloadFileInfoClassName={
          props.updatedFileName
            ? "download-file-info"
            : "download-file-info--disactive"
        }
        selectedFileName={props.updatedFileName}
        cancelIconClassName="cancel-icon"
        cancelIconOnClick={props.clearSelectedFile}
        labelClassName={
          props.updatedFileName
            ? "download--disactive"
            : "download"
        }
      />

      <div className="btn__container">
        <button type="submit" className="btn btn__update">
          Update
        </button>
        <button className="btn btn__cancel" onClick={props.cancelUpdate}>Cancel</button>
      </div>
    </form>
  );
};

export default FormUpdate;
