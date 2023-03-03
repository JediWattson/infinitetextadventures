"use client";

import React, { useRef, useState } from "react";

import { postOracle } from "./lib";

import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";
import { GameMetaType } from "@/lib/gameMeta";
import { useAuthContext } from "@/app/context/auth";

// speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));

type ChatPropsType = { gamePath: string, gameMeta: GameMetaType, gameData: { playerId: string, oracleText: string[]} }
const Chat = ({ gamePath, gameMeta, gameData }: ChatPropsType) => {
  const [oracleSays, setOracle] = useState(gameData.oracleText);
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
    
  const handleEndGame = async () => {
    try {
      await fetch(`api`, { method: "DELETE" });
    } catch (error) {
      console.error(error);
    }
  };
  
  const auth = useAuthContext();  
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
      {gameData.playerId === auth.session?.user?.id && (
        <div className={styles.actions}>
          <Button onClick={handleClick} text="Send" />
          <Textarea
            handleKeyUp={handleKeyUp}
            textValueRef={textValueRef}
            className={styles.textarea}
          />
          <Button onClick={handleEndGame} text="End Game" />
        </div>
      )}
    </>
  );
};

export default Chat;
