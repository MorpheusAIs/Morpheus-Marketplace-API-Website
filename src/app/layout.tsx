import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from '@/lib/auth/AuthContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Morpheus API Gateway Documentation",
  description: "Documentation and management interface for the Morpheus API Gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
