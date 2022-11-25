/**@Module InputDate */

import React from 'react'
import './InputDate.css'

/**
 * Component for input field for date
 * @param {*} props 
 * @returns 
 */
const InputDate = (props) => {
    return (
        <input
        name={props.name}
        type="date"
        min={props.min}
        className={props.className}
        onChange={props.onChange}
        value={props.value}
      />
    );
};

export default InputDate