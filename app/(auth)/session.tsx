"use client";

import type { Session } from "next-auth";
import { useEffect } from "react";
import { useAuthContext } from "../context/auth";

export default function Session({ session }: { session: Session }) {
  const { setSession } = useAuthContext();

  useEffect(() => {
    if (!session || !setSession) return;
    setSession(session);
  }, [session, setSession]);

  return <div />;
}
