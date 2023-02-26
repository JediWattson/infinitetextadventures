'use client';

import React, { useEffect, useRef, useState } from "react";
import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";

const postOracle = async (text?: string[]) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  const data = await res.json();

  if (data.text === "") {
    data.text = "Try again!";
  }

  speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));
  return data.text;
};

const Chat = () => {
  const [oracleSays, setOracle] = useState<string[]>([]);
  const textValueRef = useRef(null);
  const chatWindowRef = useRef(null);

  const handleRef = (ref) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  useEffect(() => {
    const init = async () => {
      const text = await postOracle();
      setOracle([text]);
    };
    init();
  }, []);

  const handleClick = async () => {
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
