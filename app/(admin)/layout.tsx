import type { Metadata } from "next";
import { satoshi, jetbrainsMono } from "@/lib/fonts";
import "@/styles/globals.css";
import { getAiModeStatus } from "@/app/actions/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { AiModeGuardModal } from "@/components/admin/ai-mode-guard-modal";

export const metadata: Metadata = {
  title: "MC Mathematics | Admin Portal",
  description: "Administrative control center for Malinga C Dissanayake.",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { aiMode } = await getAiModeStatus();

  return (
    <html lang="en" className={`dark ${satoshi.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-foreground antialiased flex">
        <AdminNav aiMode={aiMode} />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AiModeGuardModal aiMode={aiMode} />
          <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
