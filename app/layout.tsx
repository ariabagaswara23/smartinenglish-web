import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";
import localFont from 'next/font/local'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const centuryGothic = localFont({
  src: [
    {
      path: './fonts/centurygothic.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/centurygothic_bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-century-gothic',
})

export const metadata: Metadata = {
  title: "SMART in ENGLISH",
  description: "Bimbingan Belajar yang efektif dan menyenangkan untuk jenjang SD/SMP/SMA/MAHASISWA",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, centuryGothic.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
