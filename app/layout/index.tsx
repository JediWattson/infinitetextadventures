import AuthContext from "../context/auth";
import Header from "@/components/header";

import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthContext>
          <Header />
          <main>{children}</main>
        </AuthContext>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Infinite Text Adventures",
  description: "Play an infinite amount of various text adventures",
  icons: {
    icon: '/favicon/favicon.ico'
  },
  opengraph: {
    title: "Infinite Text Adventures!",
    description: "Using generative AI I've been able to create a text adventure game!",
    sitename: "https://infinitetextadventures.app",
    images: [{
      height: 1024,
      width: 1024,
      url: 'og-image/infinity.png',
      alt: "painted image of infinity symbol in the middle of the woods"
    }],
  },
};
