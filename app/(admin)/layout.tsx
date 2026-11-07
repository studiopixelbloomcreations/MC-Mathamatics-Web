import type { Metadata } from "next";
import { geist, jetbrainsMono } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MC Mathematics | Admin Portal",
  description: "Administrative control center for Malinga C Dissanayake.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  );
}
