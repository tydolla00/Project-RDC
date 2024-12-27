import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "@/lib/providers";
import { AdminProvider } from "@/lib/adminContext";

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
      <body className={inter.className}>
        <AdminProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CSPostHogProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster />
              <Footer />
            </CSPostHogProvider>
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
