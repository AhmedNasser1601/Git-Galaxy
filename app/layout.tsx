// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Git-Galaxy | Your Code in 3D",
  description: "Transform your GitHub profile into a living, interactive 3D solar system.",
  openGraph: {
    title: "Git-Galaxy | Explore Code in 3D",
    description: "Transform your GitHub profile into a living, interactive 3D solar system.",
    siteName: "Git-Galaxy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Git-Galaxy | Your Code in 3D",
    description: "Transform your GitHub profile into a living, interactive 3D solar system.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
