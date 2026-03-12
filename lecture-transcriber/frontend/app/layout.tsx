import type { Metadata } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "محاضرتي | LectureTranscriber",
  description: "Fast Arabic/English lecture transcription MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${cairo.variable} ${spaceGrotesk.variable} min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
