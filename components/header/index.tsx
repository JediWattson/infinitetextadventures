"use client";

import { Suspense } from "react";
import Button from "../button";

import { useAuthContext } from "@/app/context/auth";
import { signIn, signOut } from "next-auth/react";

import styles from "./styles.module.css";
import { redirect, usePathname } from "next/navigation";

function Header() {
  const { session } = useAuthContext();
  const pathname = usePathname();

  if (pathname === "/" && session) redirect("/game");

  return (
    <Suspense fallback={<div />}>
      <div className={styles.header}>
        <h2 className={styles.title}>{"Infinite Text Adventures!"}</h2>
        {session ? (
          <Button inlineHeader text="Sign Out" onClick={() => signOut()} />
        ) : (
          <Button inlineHeader text="Sign In" onClick={() => signIn()} />
        )}
      </div>
    </Suspense>
  );
}

export default Header;
