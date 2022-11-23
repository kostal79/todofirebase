/** @module TodoItem */

import React, { useEffect, useState } from "react";
import "./TodoItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ref, getBlob } from "firebase/storage";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import db, { storage } from "../../firebase";
import {
  faCircleCheck,
  faPen,
  faTrashCan,
  faCircleExclamation,
  faFileArrowDown,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const TodoItem = (props) => {
  const [todo, setTodo] = useState(props.todo);
  const [isLoad, setIsLoad] = useState(false);
  const [isDone, setIsDone] = useState(todo.data.isDone);

  useEffect(() => setTodo(props.todo), [props]);

  /** fills updating fields
   * @param {event} e press icon "change"
   */
  const changeTodo = (e) => {
    window.scrollTo(0, 0);
    props.setUpdate(todo);
  };

  /**
   * Downloads file and opens if .pdf
   * @param {event} e click on download button
   */
  const handleDownload = async (e) => {
    setIsLoad(true);
    const id = props.todo.id;
    console.log(id);
    const data = await props.getDocument(id);
    const fileName = await data.file.fileName;
    const fileURL = await data.file.fileURL;
    await getBlob(ref(storage, fileURL))
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoad(false);
      });
  };

  /**
   * Marks if is done
   * @param {event} e - target tasc
   */
  const markTodo = async (e) => {
    setIsDone(!isDone);
    const documentId = props.todo.id;
    const document = doc(db, "todos", documentId);
    await updateDoc(document, {
      isDone: !isDone,
    });
    console.log(`document id${documentId} updated`);
  };

  /**
   * Deletes tasc
   * @param {event} e - target tasc
   */
  const deleteTodo = async (e) => {
    let documentId = todo.id;
    await deleteDoc(doc(db, "todos", documentId)).then(() => props.fetchPost());
  };

  return (
    <div
      id={props.todo.id}
      className={isDone ? "todo__item todo__item--done" : "todo__item"}
    >
      <div className="item__field">
        <div className="item__title">
          <span className="item__number">{props.i + 1}</span>
          <h4 className="item__text">{todo.data.title}</h4>
          <div className="item__buttons">
            <div
              className={
                props.todo.data.todoDate < props.currentDate
                  ? "item__button item__button--change item__button--disactive"
                  : "item__button item__button--change"
              }
              onClick={changeTodo}
            >
              <div className="tooltip">
                <FontAwesomeIcon icon={faPen} />
                <span className="tooltip-text">edit</span>
              </div>
            </div>
            <div
              className={(() => {
                if (todo.data.todoDate < props.currentDate) {
                  if (!isDone) {
                    return "item__button item__button--mark item__button--disactive";
                  } else {
                    return "item__button item__button--mark item__button--done";
                  }
                } else {
                  if (isDone) {
                    return "item__button item__button--mark item__button--done";
                  } else {
                    return "item__button item__button--mark";
                  }
                }
              })()}
              onClick={markTodo}
            >
              <div className="tooltip">
                <FontAwesomeIcon icon={faCircleCheck} />
                <span className="tooltip-text">done</span>
              </div>
            </div>
            <div
              className="item__button item__button--delete"
              onClick={deleteTodo}
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
        <p className="item__description">{todo.data.description}</p>
        <div className="item__bottom-container">
          <div className="item__todoDate">{todo.data.todoDate}</div>
          <div
            className={
              todo.data.file?.fileURL
                ? "item__button item__button--download"
                : "item__button item__button--download item__button--disactive"
            }
            onClick={handleDownload}
          >
            <div className="tooltip">
              <div
                className={isLoad ? "spinner" : "spinner spinner--disactive"}
              >
                <FontAwesomeIcon icon={faSpinner} />
              </div>
              <div className={isLoad ? "icon icon--disactive" : "icon"}>
                <FontAwesomeIcon icon={faFileArrowDown} />
              </div>
              <span className="tooltip-text">download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
