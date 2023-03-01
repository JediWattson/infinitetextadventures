"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import { useAuthContext } from "@/app/context/auth";
import Button from '@/components/button';

import styles from "./styles.module.css";


function Header() {
  const router = useRouter()
  const pathname = usePathname();
  
  const auth = useAuthContext()
  const isSession = !!auth.session;
  useEffect(() => {    
    if (pathname === "/" && isSession) router.replace("/dashboard");
  }, [pathname, isSession])
  
  const [endLoading, setEndLoading] = useState(false);
  useEffect(() => {
    setEndLoading(false);
  }, [pathname])
  const handleEndGame = async () => {
    try {
      setEndLoading(true);
      await fetch(`${pathname}/api`, { method: "DELETE" });
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <nav className={styles.header}>
      <h2 className={styles.title}>{"Infinite Text Adventures!"}</h2>
      <ul className={styles.actions}>
        {pathname?.includes("/game") && (
          <li><Button small text={endLoading ? "Ending Game" : "End Game"} onClick={handleEndGame} disabled={endLoading} /></li>        
        )}
        <li><Button small text={`Sign ${isSession ? "Out" : "In"}`} onClick={isSession ? signOut : signIn} /></li>
      </ul>      
    </nav>
  );
}

export default Header;
