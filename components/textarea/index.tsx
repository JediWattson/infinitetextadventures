import React, { Ref } from "react";

import styles from "./style.module.css";

const Textarea = ({ textValueRef, className = "" }: { textValueRef: Ref<HTMLTextAreaElement>, className: string }) => {
  return (
    <textarea
      ref={textValueRef}
      className={`${className} ${styles.textareaContainer}`}
    />
  );
};

export default Textarea;
