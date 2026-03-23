import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BackToTop from "@/components/ui/BackToTop";
import GlobalShortcuts from "@/components/providers/GlobalShortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coindex",
  description: "Coindex is a high-performance, real-time cryptocurrency screener and dashboard designed for traders and developers who need instant market clarity",
};

import { CurrencyProvider } from "@/components/providers/CurrencyProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#030712] text-white`}
      >
        <CurrencyProvider>
          <GlobalShortcuts />
          <div className="bw-background" />
          <Header />
          {children}
          <BackToTop />
        </CurrencyProvider>
      </body>
    </html>
  );
}
