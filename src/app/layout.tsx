import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import { WagmiProviders } from "@/providers/wagmi";

export const metadata: Metadata = {
  title: "Neostox AI",
  description: "Next gen AI trading buddy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-aileron antialiased">
        <WagmiProviders>
          <ToastProvider>
            {children}
          </ToastProvider>
        </WagmiProviders>
      </body>
    </html>
  );
}
