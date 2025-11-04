import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiffin Service Bot - Smart Order Management",
  description: "AI-powered tiffin service for seamless order management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
