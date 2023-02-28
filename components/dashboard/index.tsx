'use client';

import Button from "../button";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import styles from './styles.module.css';

export default function DashboardComponent() {
    const router = useRouter();
    const handleClick = async () => {
        const res = await fetch('/dashboard/api', { method: "PUT" });
        const game = await res.json();
        if (!game.gameId) return;
        router.push(`/game/${game.gameId}`)
    }
    
    return (
        <div className={styles.container}>
            <Button onClick={handleClick} text="Create a game" />
        </div>
    );
}