/** @module Todo */

import "./Todo.css";
import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
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
     * Deletes tasc
     * @param {event} e - target tasc
     */
    const deleteTodo = async (e) => {
        let documentId = e.target.closest('.todo__item').id;
        await deleteDoc(doc(db, "todos", documentId)).then(() => fetchPost());
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

    /**
     * Marks if is done
     * @param {event} e - target tasc
     */
    const markTodo = async (e) => {
        const documentId = e.target.closest('.todo__item').id;
        const document = doc(db, 'todos', documentId);
        const isDone = await getDocument(document.id).then((data) => data.isDone)
        console.log(isDone)
        await updateDoc(document, {
            isDone: !isDone
        }).then(() => fetchPost());
    }

    const addData = async (title, description, todoDate, isDone, file) => {
        try {
            const docRef = await addDoc(collection(db, "todos"), {
                title: title,
                description: description,
                todoDate: todoDate,
                isDone: isDone,
                file: file,
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
                const storageRef = ref(storage, selectedFile.current.files[0].name);

                uploadBytes(storageRef, selectedFile.current.files[0]).then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                        .then((downloadURL) => addData(title, description, todoDate, false, downloadURL));
                });

            }
            addData(title, description, todoDate, false, null)

        } else {
            console.log('one or more fields are empty')
        }
    }

    /** fills updating fields 
    * @param {event} e press icon "change"
    */
    const changeTodo = async (e) => {
        window.scrollTo(0, 0);
        const documentId = e.target.closest('.todo__item').id;
        const document = doc(db, 'todos', documentId);
        await getDocument(document.id)
            .then((content) => setUpdate({ data: { ...content }, id: documentId }))
    }

    /**
     * return updating document
     * @returns {object} new document
     */
    const getUpdatingDocument = () => {
        const updatingDocument = update ? update.data : null;
        return updatingDocument;
    }


    /**
    * Submits update task
    */
    const submitUpdate = async (e) => {
        e.preventDefault();
        const documentId = update.id;
        const newData = getUpdatingDocument();
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
     * Downloads file and opens if .pdf
     * @param {event} e click on download button
     */
    const handleDownload = async (e) => {
        const id = e.target.closest('.todo__item').id;
        const fileName = await getDocument(id).then((data) => data.file)
        const starsRef = ref(storage, fileName);
        getDownloadURL(starsRef)
            .then((url) => {
                const link = document.createElement('a');
                link.href = url;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => console.error(err))
    }


    /**
     * Make list of all todo
     * @param {array} todos - array of objects
     * @returns array of components
     */
    const todoList = useMemo(() => {
        console.log('todoList start')
        let list = todos?.map((todo, i) => {
            return (
                <div key={todo.id}>
                    <TodoItem
                        todo={todo}
                        i={i}
                        deleteTodo={deleteTodo}
                        markTodo={markTodo}
                        changeTodo={changeTodo}
                        cancelUpdate={cancelUpdate}
                        currentDate={currentDate}
                        handleDownload={handleDownload}
                    />
                </div>
            )
        });
        return list
    }, [todos])


    /**
     * Read collection and make array of objects, sorted by date of todo
     */
    async function fetchPost() {
        console.log('fetch')
        const querySnapshot = await getDocs(collection(db, "todos"));
        let newData = []
        querySnapshot.forEach((doc) => {
            if (doc) {
                newData.push({ data: doc.data(), id: doc.id })
            };
        });
        const sortedData = newData.sort((a, b) => Date.parse(a.data.todoDate) - Date.parse(b.data.todoDate))
        setTodos(sortedData)
        console.log("sortedData: ", sortedData)
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
                        changeTodo={changeTodo}
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
                    todos={todos}
                    todoList={todoList}
                />
            </div>
        </div>
    )
}

export default Todo