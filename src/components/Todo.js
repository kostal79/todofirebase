/** @module Todo */

import "./Todo.css";
import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import db, { storage } from "../firebase";
import Form from "./form/Form";
import DateForm from "../utils/DateForm";
import TodoContent from "./form/todo-content/TodoContent";
import TodoItem from "./todo-item/TodoItem";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


/** Component of Todo module */
const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);

    const currentDate = DateForm(new Date());
    const [todoDate, setTodoDate] = useState(currentDate);
    const [update, setUpdate] = useState('');
    const selectedFile = React.createRef();


    const setDefaultValues = () => {
        setTitle('')
        setDescription('')
        setTodoDate(currentDate)
        setUpdate('')
        document.getElementById("fileElem").value = "";
    }

    /**
     * State of title handler
     * @param {object} e - input area
     */
    const handleTitle = (e) => {
        setTitle(e.target.value)
    }

    /**
     * State of description handler
     * @param {object} e - text area
     */
    const handleDescription = (e) => {
        setDescription(e.target.value)
    }


    /**
 * State of todoDate handler
 * @param {object} e - input date
 */
    const handleDate = (e) => {
        setTodoDate(e.target.value)
    }

    /**
     * Gets document by ID
     * @param {string} documentID 
     * @returns {object} data
     */
    const getDocument = async (documentID) => {
        const docRef = doc(db, "todos", documentID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data()
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }



    const addData = async (title, description, todoDate, isDone, fileURL, fileName) => {
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
            fetchPost()
            setDefaultValues()
        }
    }

    /**
     * Sumbit additing new todo
     * @param {event} e - press button Submit
     */
    const submitTodo = async (e) => {
        e.preventDefault();
        if (title && todoDate) {
            if (selectedFile.current.files.length > 0) {
                const fileName = selectedFile.current.files[0].name;
                console.log(fileName)
                const storageRef = ref(storage, fileName);

                uploadBytes(storageRef, selectedFile.current.files[0]).then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                        .then((fileURL) => addData(title, description, todoDate, false, fileURL, fileName));
                });

            } else { addData(title, description, todoDate, false, null, null) }

        } else {
            console.log('one or more fields are empty')
        }
    }


    /**
    * Submits update task
    * @param {event} e - press button "Submit"
    */
    const submitUpdate = async (e) => {
        e.preventDefault();
        const documentId = update.id && update.id;
        const newData = update.data && update.data;
        if (newData && newData.title && newData.todoDate) {
            try {
                await setDoc(doc(db, "todos", documentId), newData)
                    .then(() => console.log("Document updated with ID: ", documentId));
            } catch (err) {
                console.error("Error adding document: ", err)
            } finally {
                setDefaultValues();
            }
        } else {
            alert('Title and date is mandatory')
        }
        fetchPost();
    }

    /**
     * update title in document
     * @param {event} e - title field
     */
    const handleUpdateTitle = (e) => {
        setUpdate({ ...update, data: { ...update.data, title: e.target.value } })
        console.log(update)
    }

    /**
     * update description in document
     * @param {event} e - description field
     */
    const handleUpdateDescribtion = (e) => {
        setUpdate({ ...update, data: { ...update.data, description: e.target.value } })
    }

    /**
     * date updating handler
     * @param {event} e input field date
     */
    const handleUpdateDate = (e) => {
        setUpdate({ ...update, data: { ...update.data, todoDate: e.target.value } })
    }

    /**
     * Cancels update task
     */
    const cancelUpdate = (e) => {
        setUpdate('')
    }

    /**
     * Make list of all todo
     * @param {array} todos - array of objects
     * @returns array of components
     */
    const todoList = useMemo(() => {
        let list = todos?.map((todo, i) => {
            console.log('rendering todo item')
            return (
                <div key={todo.id}>
                    <TodoItem
                        todo={todo}
                        i={i}
                        cancelUpdate={cancelUpdate}
                        currentDate={currentDate}
                        getDocument={getDocument}
                        setUpdate={setUpdate}
                        fetchPost={fetchPost}
                    />
                </div>
            )
        });
        if (list.length > 0) {
            console.log('rendering finished')
            return list
        } else {
            console.log('todolist is empty')
            return ('TODO list is empty')
        }
    }, // eslint-disable-next-line
        [todos])


    /**
     * Read collection and make array of objects, sorted by date of todo
     */
    async function fetchPost() {
        console.log('start make new array...')
        const querySnapshot = await getDocs(collection(db, "todos"));
        let newData = []
        querySnapshot.forEach((doc) => {
            if (doc) {
                newData.push({ data: doc.data(), id: doc.id })
            };
        });
        const sortedData = newData.sort((a, b) => Date.parse(a.data.todoDate) - Date.parse(b.data.todoDate))
        setTodos(sortedData)
        console.log("array is updated")
    }


    /**
     * Render after submit
     */
    useEffect(() => {
        fetchPost();
    }, [])


    return (
        <div className="todo__container">
            <div className="todo">
                <h1 className="header">
                    Todo-App
                </h1>
                <div className="form form__new-data-form">
                    <Form
                        submitTodo={submitTodo}
                        handleTitle={handleTitle}
                        todos={todos}
                        title={title}
                        todoDate={todoDate}
                        currentDate={currentDate}
                        handleDate={handleDate}
                        handleDescription={handleDescription}
                        description={description}
                        submitUpdate={submitUpdate}
                        handleUpdateTitle={handleUpdateTitle}
                        handleUpdateDescribtion={handleUpdateDescribtion}
                        handleUpdateDate={handleUpdateDate}
                        update={update}
                        selectedFile={selectedFile}
                    />
                </div>
                <div className="form form__change-data-form">

                </div>
                <TodoContent
                    todoList={todoList}
                />
            </div>
        </div>
    )
}

export default Todo