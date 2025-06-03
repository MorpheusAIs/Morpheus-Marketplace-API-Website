import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from '@/lib/auth/AuthContext';
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from '@next/third-parties/google';
import { GTMProvider } from '@/components/providers/GTMProvider';
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className={inter.className}>
        {gtmId && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" 
              width="0" 
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <AuthProvider>
          <GTMProvider>
            {children}
          </GTMProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
