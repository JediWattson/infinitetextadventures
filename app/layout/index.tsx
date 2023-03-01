import { Source_Sans_Pro } from "next/font/google";
import AuthContext from "../context/auth";
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
  description: "Play an infinite amount of various text adventures",
  icons: {
    icon: "/favicon/favicon.ico",
  },
  openGraph: {
    title: "Infinite Text Adventures!",
    description:
      "Using generative AI I've been able to create a text adventure game!",
    sitename: "https://infinitetextadventures.app",
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
