import React from "react";

import styles from "./style.module.css";

const Textarea = ({ textValueRef, className = "" }) => {
  return (
    <textarea
      ref={textValueRef}
      className={`${className} ${styles.textareaContainer}`}
    />
  );
};

export default Textarea;
