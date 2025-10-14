import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CognitoAuthProvider } from '@/lib/auth/CognitoAuthContext';
import { NotificationProvider } from '@/lib/NotificationContext';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { GTMProvider } from '@/components/providers/GTMProvider';
import NotificationManager from '@/components/NotificationManager';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Morpheus API Gateway Documentation",
  description: "Documentation and management interface for the Morpheus API Gateway",
  icons: {
    icon: '/morpheus_wings_32x32.png',
    shortcut: '/morpheus_wings_32x32.png',
    apple: '/morpheus_wings_32x32.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
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
        <NotificationProvider>
          <CognitoAuthProvider>
            <GTMProvider>
              <NotificationManager />
              {children}
            </GTMProvider>
          </CognitoAuthProvider>
        </NotificationProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
