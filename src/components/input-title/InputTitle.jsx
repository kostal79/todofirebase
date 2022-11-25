/** @module InputTitle */
import React from 'react'
import './InputTitle.css'

/**
 * Component InputTitle
 * @param {*} props 
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