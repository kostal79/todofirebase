/** @module TodoItem */

import React from "react";
import "./TodoItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faPen,
  faTrashCan,
  faCircleExclamation,
  faFileArrowDown,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const TodoItem = (props) => {
  return (
    <div
      id={props.todo.id}
      className={
        props.todo.data.isDone ? "todo__item todo__item--done" : "todo__item"
      }
    >
      <div className="item__field">
        <div className="item__title">
          <span className="item__number">{props.i + 1}</span>
          <h4 className="item__text">{props.todo.data.title}</h4>
          <div className="item__buttons">
            <div
              className={
                props.todo.data.todoDate < props.currentDate
                  ? "item__button item__button--change item__button--disactive"
                  : "item__button item__button--change"
              }
              onClick={props.changeTodo}
            >
              <div className="tooltip">
                <FontAwesomeIcon icon={faPen} />
                <span className="tooltip-text">edit</span>
              </div>
            </div>
            <div
              className={(() => {
                if (props.todo.data.todoDate < props.currentDate) {
                  if (!props.todo.data.isDone) {
                    return "item__button item__button--mark item__button--disactive";
                  } else {
                    return "item__button item__button--mark item__button--done";
                  }
                } else {
                  if (props.todo.data.isDone) {
                    return "item__button item__button--mark item__button--done";
                  } else {
                    return "item__button item__button--mark";
                  }
                }
              })()}
              onClick={props.markTodo}
            >
              <div className="tooltip">
                <FontAwesomeIcon icon={faCircleCheck} />
                <span className="tooltip-text">done</span>
              </div>
            </div>
            <div
              className="item__button item__button--delete"
              onClick={props.deleteTodo}
            >
              <div className="tooltip">
                <FontAwesomeIcon icon={faTrashCan} />
                <span className="tooltip-text">delete</span>
              </div>
            </div>
            <div
              className={(() => {
                if (
                  props.todo.data.todoDate < props.currentDate &&
                  !props.todo.data.isDone
                ) {
                  return "item__button item__button--exclamation";
                } else {
                  return "item__button item__button--exclamation item__button--disactive";
                }
              })()}
            >
              <div className="tooltip">
                <FontAwesomeIcon icon={faCircleExclamation} />
                <span className="tooltip-text">failed</span>
              </div>
            </div>
          </div>
        </div>
        <p className="item__description">{props.todo.data.description}</p>
        <div className="item__bottom-container">
          <div className="item__todoDate">{props.todo.data.todoDate}</div>
          <div
            className={
              props.todo.data.file
                ? "item__button item__button--download"
                : "item__button item__button--download item__button--disactive"
            }
            onClick={props.handleDownload}
          >
            <div className="tooltip">
              <div className={`spinner spinner--disactive`}><FontAwesomeIcon icon={faSpinner} /></div>
              <FontAwesomeIcon icon={faFileArrowDown} />
              <span className="tooltip-text">download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
