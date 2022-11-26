/**@module InputDescription */

import React from "react";
import './InputDescription.css'

/**Component InputDescription
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
