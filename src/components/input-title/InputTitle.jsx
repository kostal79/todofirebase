/** @module InputTitle */
import React from 'react'
import './InputTitle.css'

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