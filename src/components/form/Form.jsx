/** @module Form */

import React from "react";
import "./Form.css";

const Form = (props) => {
  return (
    <>
      <form
        onSubmit={props.submitTodo}
        className={props.update ? "form form--disactive" : "form form--active"}
      >
        <div className="form__container">
          <section className="upper-form">
            <input
              type="text"
              placeholder="Input title"
              onChange={props.handleTitle}
              value={props.title}
              className="input input__title"
            />
            <input
              name="date"
              type="date"
              min={props.currentDate}
              className="input input__date"
              onChange={props.handleDate}
              value={props.todoDate}
            />
          </section>
          <textarea
            name="description"
            placeholder="What do you have to do?"
            onChange={props.handleDescription}
            value={props.description}
            className="input input__description"
          />

          <input
            type="file"
            id="fileElem"
            style={{ display: "none" }}
            ref={props.selectedFile}
          />
          <label htmlFor="fileElem" className="download">
            Загрузить файл
          </label>
        </div>

        <div className="btn__container">
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>
      <form
        onSubmit={props.submitUpdate}
        className={
          props.update
            ? "form form__update form__update--active"
            : "form form__update form__update--disactive"
        }
      >
        <input
          type="textUpdate"
          value={props.update ? props.update.data.title : "..."}
          onChange={props.handleUpdateTitle}
          className="update update__title"
        />
        <textarea
          name="descriptionUpdate"
          value={props.update ? props.update.data.description : "..."}
          onChange={props.handleUpdateDescribtion}
          className="update update__description"
        />
        <input
          type="date"
          min={props.currentDate}
          className="update update__date"
          onChange={props.handleUpdateDate}
          value={props.update ? props.update.data.todoDate : ""}
        />
        <div className="btn__container">
          <button type="submit" className="btn btn__update">
            Update
          </button>
          <button className="btn btn__cancel">Cancel</button>
        </div>
      </form>
      <img id="download" />
    </>
  );
};

export default Form;
