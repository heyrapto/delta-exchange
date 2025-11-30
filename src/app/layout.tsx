import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import { WagmiProviders } from "@/providers/wagmi";
import { AppContextProvider } from "@/context/app-context";
import {Open_Sans } from "next/font/google"

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Neostox AI",
  description: "Next gen AI trading buddy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <WagmiProviders>
          <AppContextProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
          </AppContextProvider>
        </WagmiProviders>
      </body>
    </html>
  );
}