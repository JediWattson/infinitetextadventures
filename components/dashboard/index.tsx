"use client";
import { useState } from "react";

import Button from "../button";

import { useRouter } from "next/navigation";

import styles from "./styles.module.css";

const title = "The Oracle's Private Eye!";
const description = "You are a detective tasked with a mystery surrounding someone's death with three days to solve the murder. The Oracle will narrate an adventure explaining any questions or events that might occour for you actions."

export default function DashboardComponent() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await fetch("/dashboard/api", { method: "PUT" });
      const game = await res.json();
      if (!game.gameId) throw Error("Game was not created here...");
      router.push(`/game/${game.gameId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const text = loading ? "Creating..." : "Create a game";
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p>{description}</p>
      <Button onClick={handleClick} text={text} disabled={loading} />
    </div>
  );
}
