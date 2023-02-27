"use client";

import type { Session } from "next-auth";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const SessionContext = createContext<{
  session?: Session | null;
  setSession?: Dispatch<SetStateAction<Session | null>>;
}>({});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useAuthContext = () => useContext(SessionContext);
