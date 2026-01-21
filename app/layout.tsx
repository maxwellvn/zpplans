import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AS ONE MAN Diamond Global Conference | Registration",
  description: "Register for the AS ONE MAN Diamond Global Conference - February 1st to 28th, 2026",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
