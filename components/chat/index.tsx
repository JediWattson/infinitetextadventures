"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";

const postOracle = async (gameId: string, text: string) => {
  const res = await fetch(`/game/${gameId}/api`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (res.status >= 400) throw Error(`Server response status ${res.status}`);

  const data = await res.json();
  // speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));
  return data.text;
};

const Chat = ({
  gameId,
  logs,
}: {
  gameId: string;
  logs: { text: string }[];
}) => {
  const [oracleSays, setOracle] = useState<string[]>([]);
  const textValueRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!logs) return;
    setOracle(logs.map((l) => l.text));
  }, [logs]);

  const handleRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  const handleClick = async () => {
    if (!textValueRef.current) return;

    const playerText = `Detective: ${textValueRef.current.value}`;
    const chatArr = [...oracleSays, playerText];
    setOracle(chatArr);
    textValueRef.current.value = "";

    const text = await postOracle(gameId, playerText);
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
