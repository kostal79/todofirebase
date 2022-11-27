/** @module FormUpdate */

import React from "react";
import InputDate from "../input-date/InputDate";
import InputDescription from "../input-desctription/InputDescription";
import InputFile from "../input-file/InputFile";
import InputTitle from "../input-title/InputTitle";
import "./FormUpdate.css";

/**
 * Component FormUpdate
 * @component
 * @param {funct} submitUpdate submit form function
 * @param {object} update use for changing class name
 * @param {funct} handleUpdateTitle handler for updating title
 * @param {string} currentDate current date
 * @param {funct} handleUpdateDate update date handler
 * @param {funct} handleUpdateDescription update desctiption handler
 * @param {funct} loadFileHandler load file handler
 * @param {string} updatedFileName name of new upload file
 * @param {funct} clearSelectedFile function clear name
 * @param {boolean} isLoading true when file is loading
 * @param {funct} cancelUpdate function canceled updating
 * 
 * @description Makes form for updating todo
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
      <div className="form__container">
        <section className="upper-form">
          <InputTitle
            value={props.update ? props.update.data.title : "..."}
            onChange={props.handleUpdateTitle}
            className="update update__title"
            name="updateInputTitle"
          />
          <InputDate
            min={props.currentDate}
            className="update update__date"
            onChange={props.handleUpdateDate}
            value={props.update ? props.update.data.todoDate : ""}
            name="updateDate"
          />
        </section>
        <InputDescription
          name="descriptionUpdate"
          value={props.update ? props.update.data.description : "..."}
          onChange={props.handleUpdateDescription}
          className="update update__description"
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
              props.updatedFileName ? "download--disactive" : "download"
            }
            isLoading={props.isLoading}
          />
      </div>
      <div className="btn__container">
        <button type="submit" className="btn btn__update">
          Update
        </button>
        <button className="btn btn__cancel" onClick={props.cancelUpdate}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FormUpdate;
