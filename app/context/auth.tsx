"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Session } from "next-auth";

type SessionType = Session & { user: { id: string } } | null;
type AuthContextType = {
  session?: SessionType;
  setSession?: Dispatch<SetStateAction<SessionType>>;
  clearSession?: () => void
}

const AuthContext = createContext<AuthContextType>({});
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<SessionType>(null);  
  
  const clearSession = () => {
    setSession(null);
  }

  useEffect(() => {
    const getAuth = async () => {
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      if (Object.keys(session).length === 0) return;
      setSession(session);
    }
    getAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
