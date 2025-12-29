import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        {/* Blurred background */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: 'url(/images/backgrounds/largo_wallpaper_3_desktop.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            filter: 'blur(1.4px)',
            transform: 'scale(1.05)',
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="fixed inset-0 -z-10 bg-black/20" />
        {children}
      </body>
    </html>
  );
}
