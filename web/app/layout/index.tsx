import { Session } from 'next-auth'
import { headers } from 'next/headers'
import Header from "@/components/header";
import AuthContext from './AuthContext';

import styles from "./styles.module.css";
import '../globals.css'

export const metaData = {
  title: 'Infinite Text Advs.',
  description: 'Play an infinite amount of various text adventures',
  opengraph: {
    title: 'Infinite Text Adventures!',
    description: 'Play an infinite amount of various text adventures',
    sitename: 'infinitetextadventures.app',
    images: [{}]
  }

}

async function getSession(): Promise<Session | undefined> {
  const cookie = headers().get('cookie');  

  if (!cookie) return;
  const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/chat`, {
    headers: {
      cookie,
    },
  });

  if (response.status !== 200) return;
  const session = await response.json();
  return Object.keys(session).length > 0 ? session : undefined;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {  
  const session = await getSession();
  
  return (
    <html>
      <body>
        <AuthContext session={session}>
          <Header />
          <div className={styles.rowContainer}>{children}</div>
        </AuthContext>
      </body>
    </html>
  );
};
