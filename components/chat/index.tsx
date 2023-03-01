"use client";

import React, { useEffect, useRef, useState } from "react";

import { getOracle, postOracle } from "./lib";

import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";

const Chat = ({
  gameId
}: {
  gameId: string
}) => {
  const [oracleSays, setOracle] = useState<string[]>([]);

  const gameIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (gameId === gameIdRef.current) return;
    gameIdRef.current = gameId;   
    (async () => {
      const textArr = await getOracle(gameId);
      setOracle(textArr);
    })()
  }, [gameId]);

  const handleRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  const textValueRef = useRef<HTMLTextAreaElement>(null);
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
