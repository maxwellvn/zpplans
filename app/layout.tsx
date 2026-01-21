import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AS ONE MAN Diamond Global Conference | Registration",
  description: "Register for the AS ONE MAN Diamond Global Conference - Thursday, January 29th, 2026",
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
