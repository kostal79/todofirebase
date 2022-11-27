/** @module InputTitle */
import React from 'react'
import './InputTitle.css'

/**
 * @component
 * @param {string} placeholder placeholder text
 * @param {funct} onChange on-change function
 * @param {string} value value of field
 * @param {string} className name of class
 * @param {name} name name of inpunt tag
 * @description render field for title 
 */
const InputTitle = (props) => {
    return (
        <input
        type='text'
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        className={props.className}
        name={props.name}
      />
    );
};

export default InputTitle