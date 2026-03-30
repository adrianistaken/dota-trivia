import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dota 2 Trivia",
  description: "Test your Dota 2 knowledge with quick-fire trivia questions. Answer 10 questions as fast as you can to maximize your score!",
  icons: {
    icon: [
      { url: "/images/dota2trivialogo.png", type: "image/png" },
    ],
    shortcut: "/images/dota2trivialogo.png",
    apple: "/images/dota2trivialogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        {/* Background is managed by page.tsx for smooth transitions */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
