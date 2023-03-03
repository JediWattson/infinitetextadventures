"use client";

import { useEffect } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

import { useAuthContext } from "@/app/context/auth";
import Button from "@/components/button";

import styles from "./styles.module.css";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const auth = useAuthContext();
  const isSession = !!auth.session;
  useEffect(() => {
    if (pathname === "/" && isSession) router.replace("/dashboard");
  }, [pathname, isSession]);

  return (
    <nav className={styles.header}>
      <h2 className={styles.title}><Link className={styles.homeLink} href="/">{"ITA!"}</Link></h2>
      <ul className={styles.actions}>
        <li>
          <Button
            small
            text={`Sign ${isSession ? "Out" : "In"}`}
            onClick={isSession ? signOut : signIn}
          />
        </li>
      </ul>
    </nav>
  );
}

export default Header;
