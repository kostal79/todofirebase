/** @module Todo */

import "./Todo.css";
import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import db, { storage } from "../firebase";
import Forms from "./forms/Forms";
import DateForm from "../utils/DateForm";
import TodoContent from "./todo-content/TodoContent";
import TodoItem from "./todo-item/TodoItem";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import renameFile from "../utils/Rename";

/** 
 * Component of Todo module 
 * Consist all main logic and render main page
 * 
 * @component
*/
const Todo = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const currentDate = DateForm(new Date());
  const [todoDate, setTodoDate] = useState(currentDate);
  const [update, setUpdate] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [updatedFileName, setUpdatedFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false)

 /**
 * Sets default values in sets (except todos)
 */
  const setDefaultValues = () => {
    setTitle("");
    setDescription("");
    setTodoDate(currentDate);
    setUpdate("");
    clearSelectedFile();
  };

/**
 * Handler of title state
 * @param {event} e - input area
 */
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  /**
   * Handler of updating descriprion state
   * @param {event} e - text area
   */
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  /**
   * Handler of updating date state
   * @param {object} e - input date
   */
  const handleDate = (e) => {
    setTodoDate(e.target.value);
  };

  /**
   * Gets document by ID from firestore
   * @param {string} documentID id docunent in firebase
   * @description Get document from firestore by ID
   */
  const getDocument = async (documentID) => {
    const docRef = doc(db, "todos", documentID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  /**
   *Add new todo
   * @param {string} title - title of todo
   * @param {string} description - description of todo
   * @param {string} todoDate - date, when todo must be finished
   * @param {boolean} isDone - if todo is finished, isDone === true
   * @param {string} fileURL - URL of attached file
   * @param {string} fileName - name of attached file
   */
  const addData = async (
    title,
    description,
    todoDate,
    isDone,
    fileURL,
    fileName
  ) => {
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        title: title,
        description: description,
        todoDate: todoDate,
        isDone: isDone,
        file: { fileURL: fileURL, fileName: fileName },
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error("Error adding document: ", err);
    } finally {
      fetchPost();
      setDefaultValues();
    }
  };

  /**
   * Update todo in firestore
   * @param {string} documentId id document which need to be updated.
   * @param {object} newData  object. Consistance: title, description, isDone, file: file name and file URL.
   */
  const updateData = async (documentId, newData) => {
    setDoc(doc(db, "todos", documentId), newData)
      .then(console.log("Document updated with ID:", documentId))
      .catch((err) => console.error("ERROR IN UPDATE DATA"))
      .finally(() => fetchPost());
  };

  /**
   * Sumbit additing new todo, adds document and attaches file
   * @param {event} e - event press button Submit
   */
  const submitTodo = async (e) => {
    e.preventDefault();

    if (title && todoDate) {
      if (isFilePicked) {
        setIsLoading(true)
        const fileName = renameFile(selectedFile.name);
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, selectedFile).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((fileURL) =>
            addData(title, description, todoDate, false, fileURL, fileName)
          );
        });
        setIsLoading(false)
      } else {
        addData(title, description, todoDate, false, null, null);
      }
    } else {
      console.log("one or more fields are empty");
    }
  };

  /**
   * Submits update task. Rerendering all list, because list must be sorted,
   * when date will be updated.
   * @param {event} e - event press button "Submit"
   */
  const submitUpdate = async (e) => {
    e.preventDefault();
    const documentId = update.id && update.id;
    let newData = update.data && update.data;
    if (newData && newData.title && newData.todoDate) {
      //if no attached file or attached file was not changed
      if (
        (!update.data.file.fileName && !updatedFileName) ||
        updatedFileName === update.data.file.fileName
      ) {
        updateData(documentId, newData);

        //if was attached file but now deleted
      } else if (update.data.file.fileName && !updatedFileName) {
        newData = { ...newData, file: { fileName: null, fileURL: null } };

        updateData(documentId, newData);
        deleteFile(update.data.file.fileURL);

        //if was attached but now is other file
      } else if (
        update.data.file.fileName &&
        update.data.file.fileName !== updatedFileName
      ) {
        setIsLoading(true)
        const fileName = renameFile(selectedFile.name);
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, selectedFile).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((fileURL) =>
            updateData(documentId, {
              ...newData,
              file: { fileName: fileName, fileURL: fileURL },
            })
          );
        });
        setIsLoading(false)
        deleteFile(update.data.file.fileURL);

        //if was no file but now is attached
      } else {
        setIsLoading(true)
        const fileName = renameFile(selectedFile.name);
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, selectedFile).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((fileURL) =>
            updateData(documentId, {
              ...newData,
              file: { fileName: fileName, fileURL: fileURL },
            })
          );
        });
        setIsLoading(false)
      }
    } else {
      alert("Title and date is mandatory");
    }
    setDefaultValues();
  };

  /**
   * updates title in state update
   * @param {event} e - title field
   */
  const handleUpdateTitle = (e) => {
    setUpdate({ ...update, data: { ...update.data, title: e.target.value } });
  };

  /**
   * Update description in update satate 
   * @param {event} e - description field
   */
  const handleUpdateDescription = (e) => {
    setUpdate({
      ...update,
      data: { ...update.data, description: e.target.value },
    });
  };

  /**
   * Update date in update state 
   * @param {event} e input field date
   */
  const handleUpdateDate = (e) => {
    setUpdate({
      ...update,
      data: { ...update.data, todoDate: e.target.value },
    });
  };

  /**
   * Cancels update task and clear fields
   */
  const cancelUpdate = (e) => {
    e.preventDefault();
    setUpdate("");
    setSelectedFile("");
    setIsFilePicked(false);
  };

  /**
   * deletes attached file
   * @param {string} fileURL - URL of deliting file
   */
  const deleteFile = async (fileURL) => {
    const desertRef = ref(storage, fileURL);
    deleteObject(desertRef)
      .then(() => console.log("attached file was deleted"))
      .catch((err) =>
        console.error("an error occurred, attanched file was not deleted")
      );
  };

  /**
   * Deletes todo from firestore
   * @param {string} documentId - id of document in firestore
   */
  const deleteTodoDoc = async (documentId) => {
    deleteDoc(doc(db, "todos", documentId))
      .then(() => console.log("document was deleted"))
      .catch((err) => console.error("error occured, document was not deleted"));
  };

  /**
   * Puts file's object to state and
   * marks that file was selected
   * @param {event} e - event input field type file
   */
  const loadFileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setUpdatedFileName(e.target.files[0].name);
    setIsFilePicked(true);
  };

  /**
   * Clears choosed file object in state and
   * marks that file is not selected
   */
  const clearSelectedFile = () => {
    setSelectedFile("");
    setIsFilePicked(false);
    setUpdatedFileName("");
  };

  /**
   * Make list of all todo
   * @param {array} todos - array of objects
   * @returns array of todoItem components for rendering
   */
  const todoList = useMemo(
    () => {
      console.log("rendering list");
      const sortedData = todos?.sort(
        (a, b) => Date.parse(a.data.todoDate) - Date.parse(b.data.todoDate)
      );

      let list = sortedData?.map((todo, i) => {
        return (
          <div key={todo.id}>
            <TodoItem
              todo={todo}
              i={i}
              currentDate={currentDate}
              getDocument={getDocument}
              setUpdate={setUpdate}
              fetchPost={fetchPost}
              deleteFile={deleteFile}
              deleteTodoDoc={deleteTodoDoc}
              setUpdatedFileName={setUpdatedFileName}
            />
          </div>
        );
      });
      if (list.length > 0) {
        return list;
      } else {
        return "TODO list is empty";
      }
    }, // eslint-disable-next-line
    [todos]
  );

  /**
   * Read all todos if firestore and make array of objects, sorted by date of todo
   */
  async function fetchPost() {
    console.log("fetch...");
    const querySnapshot = await getDocs(collection(db, "todos"));
    let newData = [];
    querySnapshot.forEach((doc) => {
      if (doc) {
        newData.push({ data: doc.data(), id: doc.id });
      }
    });
    setTodos(newData);
  }

  /**
   * Feth new data after changings
   */
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="todo__container">
      <div className="todo">
        <h1 className="header">Todo-App</h1>
        <div className="form form__new-data-form">
          <Forms
            submitTodo={submitTodo}
            handleTitle={handleTitle}
            title={title}
            todoDate={todoDate}
            currentDate={currentDate}
            handleDate={handleDate}
            handleDescription={handleDescription}
            description={description}
            submitUpdate={submitUpdate}
            handleUpdateTitle={handleUpdateTitle}
            handleUpdateDescription={handleUpdateDescription}
            handleUpdateDate={handleUpdateDate}
            update={update}
            selectedFile={selectedFile}
            loadFileHandler={loadFileHandler}
            isFilePicked={isFilePicked}
            clearSelectedFile={clearSelectedFile}
            updatedFileName={updatedFileName}
            cancelUpdate={cancelUpdate}
            isLoading={isLoading}
          />
        </div>
        <div className="form form__change-data-form"></div>
        <TodoContent todoList={todoList} />
      </div>
    </div>
  );
};

export default Todo;
