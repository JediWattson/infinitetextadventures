"use client";

import React, { useEffect, useRef, useState } from "react";

import { getGame, postOracle } from "./lib";

import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";

// speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));

const Chat = ({ gameId }: { gameId: string }) => {
  const [oracleSays, setOracle] = useState<string[]>([]);

  const gameIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (gameId === gameIdRef.current) return;
    gameIdRef.current = gameId;
    (async () => {
      const textArr = await getGame(gameId);
      setOracle(textArr);
    })();
  }, [gameId]);

  const handleRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  const textValueRef = useRef<HTMLTextAreaElement>(null);
  const handleClick = async () => {
    if (!textValueRef.current) return;

    const speaker = 'Detective:'
    const playerText = textValueRef.current.value;
    textValueRef.current.value = "";

    const newChat = [...oracleSays, `${speaker} ${playerText}`]
    setOracle(newChat);

    const text = await postOracle(gameId, { speaker, text: playerText });
    setOracle([...newChat, text]);
  };

  const handleKeyUp = ({ key }: { key: string }) => {
    if (key === "Enter") handleClick();
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
        <Textarea
          handleKeyUp={handleKeyUp}
          textValueRef={textValueRef}
          className={styles.textarea}
        />
      </div>
    </>
  );
};

export default Chat;
