/** @module FormMain */
import React from "react";
import "./FormMain.css";
import InputTitle from "../input-title/InputTitle";
import InputDescription from "../input-desctription/InputDescription";
import InputDate from "../input-date/InputDate";
import InputFile from "../input-file/InputFile";

/**
 * Component FormMain for showing main page.
 * @component
 * @param {funct} submitTodo function for submiting form
 * @param {object} update use for changing class name, it depends of if update empty or not
 * @param {funct} handleTitle 
 * @param {string} title todo title
 * @param {string} currentDate current date
 * @param {funct} handleDate
 * @param {string} todoDate date when todo must be done
 * @param {funct} handleDescription
 * @param {string} desctription todo description
 * @param {funct} loadFileHandler
 * @param {boolean} isFilePicked true if file is picked
 * @param {object} selectedFile file object
 * @param {boolean} isLoading true when file is loading
 *  
 * @description Make upper block for adding todo 
 */
const FormMain = (props) => {
  return (
    <form
      onSubmit={props.submitTodo}
      className={props.update ? "form form--disactive" : "form form--active"}
    >
      <div className="form__container">
        <section className="upper-form">
          <InputTitle
            onChange={props.handleTitle}
            value={props.title}
            placeholder="Input title"
            className="input input__title"
            name='inputTitle'
          />
          <InputDate
            min={props.currentDate}
            onChange={props.handleDate}
            value={props.todoDate}
            className="input input__date"
            name="inputDate"
          />
        </section>
        <InputDescription
          onChange={props.handleDescription}
          value={props.description}
          name="description"
          placeholder="What do you have to do?"
          className="input input__description"
        />
        <InputFile
          inputId="fileElem"
          name='fileElem'
          inputOnChange={props.loadFileHandler}
          downloadFileInfoClassName={
            props.isFilePicked
              ? "download-file-info"
              : "download-file-info--disactive"
          }
          selectedFileName={props.selectedFile.name}
          cancelIconClassName="cancel-icon"
          cancelIconOnClick={props.clearSelectedFile}
          labelClassName={
            props.isFilePicked ? "download--disactive" : "download"
          }
          isLoading={props.isLoading}
        />
      </div>

      <div className="btn__container">
        <button type="submit" className="btn">
          Submit
        </button>
      </div>
    </form>
  );
};

export default FormMain;
