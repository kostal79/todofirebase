import React from "react";

/**
 * Component of TodoContent
 * @param {*} props comes from Todo
 * @description render list of all todos
 */
const TodoContent = (props) => {
    
  return <div className="todo-content">{props.todoList}</div>;
};

export default TodoContent;
