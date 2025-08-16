/* eslint-disable @next/next/no-sync-scripts */
// import { ReactScan } from "@/components/ReactScan";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "@/posthog/client-init";
import { SessionProvider } from "next-auth/react";
import PostHogIdentify from "@/posthog/PosthogIdentify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RDC Stats Tracker",
  description: "Who's the best gamer?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-screen" lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      {/* <ReactScan /> */}
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CSPostHogProvider>
              <PostHogIdentify />
              <Navbar />
              <main>{children}</main>
              <Toaster />
              <Footer />
            </CSPostHogProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
