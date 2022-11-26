/** @module Form */

import React from "react";
import FormUpdate from "../form-update/FormUpdate";
import FormMain from "../form-main/FormMain";

/**
 * Component Form
 * @param {*} props comes from Todo
 * @description common block for adding and updating forms
 */
const Forms = (props) => {
  return (
    <>
      <FormMain {...props} />
      <FormUpdate {...props}/>
    </>
  );
};

export default Forms;
