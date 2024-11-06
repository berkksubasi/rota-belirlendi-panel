import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// GeistSans ve GeistMono fontlarını yükleme
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Font yüklenirken geçici bir font gösterilir
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tur Yönetim Paneli",
  description: "Tur yönetim paneli uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
