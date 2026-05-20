import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Razor.fit - Trener Personalny",
  description: "Surowe i naukowe podejście do treningu i dyscypliny.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}