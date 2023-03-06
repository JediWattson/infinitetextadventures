"use client";

import { Ref, useState } from "react";
import style from "./style.module.css";

export default function Input({
  inputRef,
  label,
  textArea,
  type
}: {
  inputRef: Ref<HTMLTextAreaElement & HTMLInputElement>;
  textArea?: boolean;
  label: string;
  type?: string;
}) {

  const [levitateLabel, setLevitateLabel] = useState('');
  const handleChange = (e: any) => {    
    if (e.target.value !== '') {
      setLevitateLabel(style.nonEmpty)
    } else if (levitateLabel !== "") {
      setLevitateLabel("")
    }
  }

  const props = {
    onChange: handleChange,
    ref: inputRef,
    className: `${levitateLabel} ${style.input} ${textArea ? style.textArea : ""}`
  }

  return (
    <div className={style.inputContainer}>
      {textArea ? (
        <textarea {...props} />
      ): (
        <input {...props} type={type || "text"} />
      )}
      <label className={style.label}>{label}</label>
    </div>
  );
}
