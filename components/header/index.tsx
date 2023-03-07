"use client";

import Link from "next/link";

import { signIn, signOut } from "next-auth/react";

import { usePlayerContext } from "@/app/context/player";
import Button from "@/components/button";

import styles from "./styles.module.css";
import AdminBtn from "./admin-btn";

function Header() {
  const playerCtx = usePlayerContext();
  const isSession = !!playerCtx.player;

  const handleSignout = () => {
    if (!playerCtx.clearPlayer) throw Error("Clear session is undefined");
    playerCtx.clearPlayer();
    signOut();
  };

  return (
    <nav className={styles.header}>
      <h2 className={styles.title}>
        <Link className={styles.homeLink} href={isSession ? "/dashboard" : "/"}>
          {"ITA!"}
        </Link>
      </h2>
      <ul className={styles.actions}>
        {playerCtx.player?.role === "admin" && (
          <li>
            <AdminBtn />
          </li>
        )}
        <li>
          <Button
            small
            text={`Sign ${isSession ? "Out" : "In"}`}
            onClick={
              isSession
                ? handleSignout
                : () => signIn(undefined, { callbackUrl: `/dashboard` })
            }
          />
        </li>
      </ul>
    </nav>
  );
}

export default Header;
