"use client";

import React, { useRef, useState } from "react";

import { postOracle } from "./lib";

import Button from "../button";
import Textarea from "../textarea";

import styles from "./style.module.css";
import { GameMetaType } from "@/lib/gameMeta";
import { useAuthContext } from "@/app/context/auth";
import { useRouter } from "next/navigation";

// speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));

type ChatPropsType = {
  gamePath: string;
  gameMeta: GameMetaType;
  gameData: { isStarted: boolean, playerId: string; oracleText: string[] };
};
const Chat = ({ gamePath, gameMeta, gameData }: ChatPropsType) => {
  const [oracleSays, setOracle] = useState(gameData.oracleText);
  const handleRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    ref.scrollTop = ref.scrollHeight;
  };

  const textValueRef = useRef<HTMLTextAreaElement>(null);
  const handleClick = async () => {
    if (!textValueRef.current) return;

    const playerText = textValueRef.current.value.trim();
    if (playerText === "") return;
    textValueRef.current.value = "";

    const speaker = gameMeta.speaker;
    const newChat = [...oracleSays, `${speaker} ${playerText}`];
    setOracle(newChat);

    const text = await postOracle(gamePath, { speaker, text: playerText });
    setOracle([...newChat, text]);
  };

  const handleKeyUp = ({ key }: { key: string }) => {
    if (key === "Enter") handleClick();
  };

  const router = useRouter();
  const handleEndGame = async () => {
    try {
      const res = await fetch(`/game/${gamePath}/api`, { method: "DELETE" });      
      
      // TODO: add some error handling
      const data = await res.json();      
      setIsExpanded(false);
      await router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const auth = useAuthContext();  
  const [isExpanded, setIsExpanded] = useState(false);
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
      {gameData.playerId === auth.player?._id && gameData.isStarted && (
        <div className={styles.actions}>
          {isExpanded ? (
            <Button onClick={handleEndGame} text="End Game" />
          ) : (
            <Button onClick={() => setIsExpanded(true)} text="Opts >>" />
          )}

          <Textarea
            onFocus={() => setIsExpanded(false)}
            handleKeyUp={handleKeyUp}
            textValueRef={textValueRef}
            className={styles.textarea}
          />
          <Button onClick={handleClick} text="Send" />
        </div>
      )}
    </>
  );
};

export default Chat;
