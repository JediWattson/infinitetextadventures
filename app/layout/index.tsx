import { Source_Sans_Pro } from "next/font/google";
import AuthContext from "../context/player";
import Header from "@/components/header";

import "./globals.css";

const sourceSansPro = Source_Sans_Pro({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSansPro.className}>
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
  description:
    "Find yourself in an adventure generated by AI. Everything you type seems to make a story unfold that's unique to your own experience. Each time you play there will be a different set up from the begining.",
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "og:image": "https://infinitetextadventures.app/og-image/infinity.png",
  },
  openGraph: {
    title: "Infinite Text Adventures!",
    description: `
        Play various games an infinite amount of times. Every adventure starts off differently 
        and your choices will create a unique experience with a story that unfolds 
        like it was written just for you!
      `,
    sitename: "https://infinitetextadventures.app",
    url: "https://infinitetextadventures.app",
    type: "website",
    images: [
      {
        height: 1024,
        width: 1024,
        url: "https://infinitetextadventures.app/og-image/infinity.png",
        alt: "painted image of infinity symbol in the middle of the woods",
      },
    ],
  },
};
