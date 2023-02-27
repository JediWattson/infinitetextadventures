import dynamic from "next/dynamic";
import AuthContext from "../context/auth";
import './globals.css'

const Header = dynamic(() => import("@/components/header"), { ssr: false });

export default async function RootLayout({ children }: { children: React.ReactNode }) {  
  return (
    <html>
      <body>
        <AuthContext>
          <Header />
          <main>
            {children}
          </main>
        </AuthContext>
      </body>
    </html>
  );
};

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
