/**@Module TodoContent */
import React from "react";

/**
 * @component
 * @param {array} todoList list of todos
 * @description render list of all todos
 */
const TodoContent = (props) => {
    
  return <div className="todo-content">{props.todoList}</div>;
};

export default TodoContent;
