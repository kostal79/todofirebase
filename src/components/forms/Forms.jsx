/** @module Form */

import React from "react";
import FormUpdate from "../form-update/FormUpdate";
import FormMain from "../form-main/FormMain";

const Forms = (props) => {
  return (
    <>
      <FormMain {...props} />
      <FormUpdate {...props}/>
    </>
  );
};

export default Forms;
