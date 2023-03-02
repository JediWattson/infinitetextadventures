"use client";

import React, { useEffect, useRef, useState } from "react";

import { getGame, postOracle } from "./lib";

import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";
import { GameMetaType } from "@/lib/gameMeta";

// speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));

type ChatPropsType = { gamePath: string, gameMeta: GameMetaType }
const Chat = ({ gamePath, gameMeta }: ChatPropsType) => {
  const [oracleSays, setOracle] = useState<string[]>([]);

  const gamePathRef = useRef<string | null>(null);
  useEffect(() => {
    if (gamePath === gamePathRef.current) return;
    gamePathRef.current = gamePath;
    (async () => {
      const textArr = await getGame(gamePath);
      setOracle(textArr);
    })();
  }, [gamePath]);

  const handleRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  const textValueRef = useRef<HTMLTextAreaElement>(null);
  const handleClick = async () => {
    if (!textValueRef.current) return;

    const playerText = textValueRef.current.value;
    textValueRef.current.value = "";

    const speaker = gameMeta.speaker
    const newChat = [...oracleSays, `${speaker} ${playerText}`]
    setOracle(newChat);

    const text = await postOracle(gamePath, { speaker, text: playerText });
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
