import React, { KeyboardEventHandler, Ref, SyntheticEvent } from "react";

import styles from "./style.module.css";

const Textarea = ({
  textValueRef,
  className = "",
  handleKeyUp,
}: {
  textValueRef: Ref<HTMLTextAreaElement>;
  className: string;
  handleKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>;
}) => {
  return (
    <textarea
      ref={textValueRef}
      onKeyUp={handleKeyUp && handleKeyUp}
      className={`${className} ${styles.textareaContainer}`}
    />
  );
};

export default Textarea;
