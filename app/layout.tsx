import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title:
    "Ecclesia Discipleship & Commissioning",

  description:
    "A theological formation and apostolic commissioning platform for raising Scripture-rooted, Spirit-formed, faithful witnesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main className="pt-20">
          {children}
        </main>

        <Footer />

        <Toaster
          richColors
          position="top-right"
        />
      </body>
    </html>
  );
}