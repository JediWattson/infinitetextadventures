"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import Button from '@/components/button';

import styles from "./styles.module.css";

function Header() {
  const router = useRouter()
  const pathname = usePathname();
  const { data: session } = useSession();
  
  useEffect(() => {    
    if (pathname === "/" && session) router.replace("/dashboard");
  }, [pathname, session])
  
  const [endLoading, setEndLoading] = useState(false);
  const handleEndGame = async () => {
    try {
      setEndLoading(true);
      await fetch(`${pathname}/api`, { method: "DELETE" });
      await router.replace("/dashboard");
      setEndLoading(false);
    } catch (error) {
      console.error(error);
      setEndLoading(false);
    }
  }

  return (
    <nav className={styles.header}>
      <h2 className={styles.title}>{"Infinite Text Adventures!"}</h2>
      <ul className={styles.actions}>
        {pathname?.includes("/game") && (
          <li><Button small text={endLoading ? "Ending Game" : "End Game"} onClick={handleEndGame} disabled={endLoading} /></li>        
        )}
        <li><Button small text={`Sign ${session ? "Out" : "In"}`} onClick={session ? signOut : signIn} /></li>
      </ul>      
    </nav>
  );
}

export default Header;
