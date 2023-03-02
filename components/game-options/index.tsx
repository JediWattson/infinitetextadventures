"use client";
import { useState } from "react";

import Button from "../button";

import { useRouter } from "next/navigation";

import styles from "./styles.module.css";

type GameOptionsPropsType = { options: { title: string, description: string, gameKey: string }[] }
export default function GameOptions({ options }: GameOptionsPropsType) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleClick = async (gameType: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/dashboard/api?type=${gameType}`, { method: "PUT" });
      const game = await res.json();
      if (!game.gameId) throw Error("Game was not created here...");
      router.push(`/game/${gameType}/${game.gameId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const text = loading ? "Creating..." : "Create a game";
  return (
    <>
      {options.map(({ title, description, gameKey }, i) =>
        <div key={i} className={styles.container}>
          <h2>{title}</h2>
          <p>{description}</p>
          <Button onClick={() => handleClick(gameKey)} text={text} disabled={loading} />
        </div>
      )}
    </>
  )
}
