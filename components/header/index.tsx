"use client";

import Link from "next/link";

import { signIn, signOut } from "next-auth/react";

import { useAuthContext } from "@/app/context/auth";
import Button from "@/components/button";

import styles from "./styles.module.css";

function Header() {
  const auth = useAuthContext();
  const isSession = !!auth.session;
  const handleSignout = () => {
    if (!auth.clearSession) throw Error("Clear session is undefined");
    auth.clearSession();
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
