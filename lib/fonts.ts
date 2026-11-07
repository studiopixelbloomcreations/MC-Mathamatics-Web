import localFont from "next/font/local";
import { Instrument_Serif, JetBrains_Mono, Noto_Sans_Sinhala } from "next/font/google";

/**
 * Self-hosted Satoshi font from Fontshare.
 * Geometric neo-grotesque with optical corrections and tabular figures support.
 */
export const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

/**
 * Instrument Serif — reserved exclusively for the slogan to provide editorial contrast.
 */
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/**
 * JetBrains Mono — for tabular unique student IDs and numeric telemetry.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * Noto Sans Sinhala — typography fallback for Sinhala translations.
 */
export const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-noto-sinhala",
  display: "swap",
});
