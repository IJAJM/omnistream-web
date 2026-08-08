import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: "OmniStream — Cinema, Music, Bareng.",
  description: "Satu platform buat nonton film, dengerin musik, dan nge-party bareng temen secara real-time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable} ${jbmono.variable}`}>
      <body className="min-h-screen bg-grain">
        <Navbar />
        <main className="pb-24">{children}</main>
        <AudioPlayer />
      </body>
    </html>
  );
}
