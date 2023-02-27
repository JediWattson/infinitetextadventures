'use client';

import Button from "../button";

import { useSession } from "next-auth/react";

import styles from './styles.module.css';

export default function DashboardComponent() {
    const { data: session } = useSession();
    const handleClick = () => {
        console.log("click")
    }
    return (
        <div className={styles.container}>
            <Button onClick={handleClick} text="Create a game" />
        </div>
    );
}