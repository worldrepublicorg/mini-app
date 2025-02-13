import type { Metadata } from "next";
import "./globals.css";
import MiniKitProvider from "@/providers/minikit-provider";
import NextAuthProvider from "@/providers/next-auth-provider";
import BottomNav from "@/components/BottomNav";
import { WalletProvider } from "@/contexts/WalletContext";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";

export const metadata: Metadata = {
  title: "World Republic",
  description: "The home of global democracy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital@0;1&family=Rubik:ital,wght@0,300..900;1,300..900&family=Sora:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextAuthProvider>
          <MiniKitProvider>
            <WalletProvider>
              {children}
              <BottomNav />
            </WalletProvider>
          </MiniKitProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
