/**@Module InputDate */

import React from 'react'
import './InputDate.css'

/**
 * Component for input field for date
 * @component
 * @param {string} name name of input field
 * @param {strig} min minimal possible date
 * @param {string} className class name
 * @param {funct} onChange function for changing input field
 * @param {string} value value of input field
 * @describtion renders field for input date
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