/**@module InputDescription */

import React from "react";
import './InputDescription.css'

/**
 * @component
 * @param {string} name name of textarea field
 * @param {string} placeholder placeholder text
 * @param {funct} onChange function work when value was changed
 * @param {string} value value of textarea
 * @param {string} className name of class
 * @description render field for input Title
 */
const InputDescription = (props) => {
  return (
    <textarea
      name={props.name}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
      className={props.className}
    />
  );
};

export default InputDescription;
