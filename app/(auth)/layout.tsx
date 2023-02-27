import type { Session as SessionType } from "next-auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Session from "./session";

async function getSession(): Promise<SessionType | undefined> {
  try {
    const cookie = headers().get("cookie");
    if (!cookie) return;
    const response = await fetch(`http://localhost:3000/api/auth/session`, {
      headers: {
        cookie,
      },
    });

    if (response.status !== 200) return;
    const session = await response.json();
    return Object.keys(session).length > 0 ? session : undefined;
  } catch (error) {
    console.log(error);
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/");
  
  return (
    <>
      <Session session={session} />
      {children}
    </>
  );
}
