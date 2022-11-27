/** @module Form */

import React from "react";
import FormUpdate from "../form-update/FormUpdate";
import FormMain from "../form-main/FormMain";

/**
 * @component
 * @description Common block for adding and updating forms
 * render block, holding two form: form for adding and form for updating
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
