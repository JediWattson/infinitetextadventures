"use client";
import { useState } from "react";

import Button from "../button";

import { useRouter } from "next/navigation";

import styles from "./styles.module.css";

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
      <Button onClick={handleClick} text={text} disabled={loading} />
    </div>
  );
}
