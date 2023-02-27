"use client";

import { useEffect } from "react";

import Button from "../button";

import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import styles from "./styles.module.css";

function Header() {
  const router = useRouter()
  const pathname = usePathname();
  const { data: session } = useSession();
  
  useEffect(() => {    
    if (pathname === "/" && session) router.replace("/dashboard");
  }, [pathname, session])
  
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{"Infinite Text Adventures!"}</h2>
      {session ? (
        <Button small text="Sign Out" onClick={() => signOut()} />
      ) : (
        <Button small text="Sign In" onClick={() => signIn()} />
      )}
    </div>
  );
}

export default Header;
