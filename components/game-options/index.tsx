"use client";
import { useState } from "react";

import Button from "../button";

import { useRouter } from "next/navigation";

import styles from "./styles.module.css";

type GameOptionsPropsType = {
  options: { title: string; description: string; gameKey: string }[];
};
export default function GameOptions({ options }: GameOptionsPropsType) {
  const [loading, setLoading] = useState("");

  const router = useRouter();
  const handleClick = async (gameType: string) => {
    try {
      setLoading(gameType);
      const res = await fetch(`/dashboard/api?type=${gameType}`, {
        method: "PUT",
      });
      const game = await res.json();
      if (!game.gameId) throw Error("Game was not created here...");
      router.push(`/game/${gameType}/${game.gameId}`);
    } catch (error) {
      console.error(error);
      setLoading("");
    }
  };

  return (
    <div className={styles.gameContainer}>
      {options.map(({ title, description, gameKey }, i) => (
        <div key={i} className={styles.card}>
          <h2>{title}</h2>
          <p>{description}</p>
          <Button
            onClick={() => handleClick(gameKey)}
            text={loading === gameKey ? "Creating game" : "Create a game"}
            disabled={loading !== ""}
          />
        </div>
      ))}
    </div>
  );
}
