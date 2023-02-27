'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import Button from "../button";

import styles from "./styles.module.css";

function Header() {
  const { data: session } = useSession()
  if (session)
    console.log(session.user);
  
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{"Infinite Text Adventures!"}</h2>
      {session 
        ? <Button inlineHeader text="Sign Out" onClick={() => signOut()} /> 
        : <Button inlineHeader text="Sign In" onClick={() => signIn()} />
      }
    </div>
  );
}

export default Header;
