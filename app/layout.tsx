import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BackToTop from "@/components/ui/BackToTop";
import GlobalShortcuts from "@/components/providers/GlobalShortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zync",
  description: "Zync is a high-performance, real-time cryptocurrency screener and dashboard designed for traders and developers who need instant market clarity",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <GlobalShortcuts />
            <div className="bw-background" />
            <Header />
            {children}
            <BackToTop />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
