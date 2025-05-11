import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real-Time Collaborative Editor",
  description: "A collaborative text editor built with Next.js, TipTap, and Yjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}