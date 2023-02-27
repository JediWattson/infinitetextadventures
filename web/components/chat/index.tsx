'use client';

import React, { useEffect, useRef, useState } from "react";
import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";

const postOracle = async (text?: string[]) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text }),
  });
  
  if (res.status >= 400) throw Error(`Server response status ${res.status}`);
  
  const data = await res.json();  
  speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));
  return data.text;
};

const Chat = () => {
  const [oracleSays, setOracle] = useState<string[]>([]);
  const textValueRef = useRef<HTMLTextAreaElement>(null);

  const handleRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const init = async () => {
      const text = await postOracle();
      setOracle([text]);
    };
    init();
  }, []);

  const handleClick = async () => {
    if (!textValueRef.current) return;
    const { value } = textValueRef.current;
    textValueRef.current.value = "";
    const chatArr = [...oracleSays, `Detective: ${value}`];
    setOracle(chatArr);
    const text = await postOracle(chatArr);
    setOracle([...chatArr, text]);
  };
  return (
    <>
      <div ref={handleRef} className={styles.textBox}>
        {oracleSays.map((o, i) => (
          <p key={i}>
            {o}
            <br />
          </p>
        ))}
      </div>
      <div className={styles.actions}>
        <Button onClick={handleClick} text="Send" />
        <Textarea textValueRef={textValueRef} className={styles.textarea} />
      </div>
    </>
  );
};

export default Chat;
