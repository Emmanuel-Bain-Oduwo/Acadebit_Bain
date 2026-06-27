import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acadebit — Kenya School OS",
  description: "Kenya's complete school operating system. CBC-aligned, M-Pesa integrated, offline-first. 17 modules, 155+ features across 8 portals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
