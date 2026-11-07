import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { geist, instrumentSerif, jetbrainsMono, notoSansSinhala } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ToastProvider } from "@/components/ui/toast";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MC Mathematics | Malinga C Dissanayake",
  description: "Maths is the question. MC is the answer. Elite e-learning platform in Kurunegala, Sri Lanka.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${notoSansSinhala.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased selection:bg-[var(--brand)]/30 selection:text-[var(--accent)]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <ToastProvider>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
