/** @module TodoItem */

import React, { useEffect, useState } from "react";
import "./TodoItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ref, getBlob } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import db, { storage } from "../../firebase";
import {
  faCircleCheck,
  faPen,
  faTrashCan,
  faCircleExclamation,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../Spinner/Spinner";


/**
 * @component
 * @param {{id: string, data: {title: string, description: string, date: string, isDone: boolean, file: {fileName: string, fileURL: string}}}} todo object with todo info
 * 
 * @description render todo item
 */
const TodoItem = (props) => {
  const [todo, setTodo] = useState(props.todo);
  const [isLoad, setIsLoad] = useState(false);
  const [isDone, setIsDone] = useState(todo.data.isDone);

  /**
   * Hook for update todo when props changed
   */
  useEffect(() => setTodo(props.todo), [props]);

  /** Fills updating fields and scroll up
   * @param {event} e event press icon "change"
   */
  const changeTodo = (e) => {
    window.scrollTo(0, 0);
    props.setUpdatedFileName(todo.data.file.fileName);
    props.setUpdate(todo);
  };

  /**
   * Downloads file and opens if .pdf
   * @param {event} e - event click on download button
   */
  const handleDownload = async (e) => {
    setIsLoad(true);
    const id = props.todo.id;
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
   * @param {event} e - event press mark in todo
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
   * @param {event} e - event press delete on todo
   */
  const deleteTodo = async (e) => {
    let documentId = todo.id;
    let fileURL = todo.data.file?.fileURL;

    if (fileURL) {
      await props.deleteFile(fileURL);
      await props.deleteTodoDoc(documentId);
      props.fetchPost();
    } else {
      props.deleteTodoDoc(documentId).then(() => props.fetchPost());
    }
  };

  /**
   * Return name of download file, if length of name > 8 letters, return lette...
   */
  const getFileName = () => {
    let fileName = props.todo.data.file.fileName
      ? props.todo.data.file.fileName
      : "";
    if (fileName.length >= 8) {
      return fileName.slice(0, 8) + "...";
    }
    return fileName;
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
              <Spinner
                className={isLoad ? "spinner" : "spinner spinner--disactive"}
              />
              <div className={isLoad ? "icon icon--disactive" : "icon"}>
                <span className="item__file-name">{getFileName()}</span>
                <FontAwesomeIcon icon={faFileArrowDown} />
              </div>
              <span className="tooltip-text tooltip-text__fileName">
                {props.todo?.data?.file?.fileName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
