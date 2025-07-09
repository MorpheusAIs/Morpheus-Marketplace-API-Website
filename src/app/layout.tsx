import './globals.css';
import '@aws-amplify/ui-react/styles.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import '@/lib/auth/amplify-config'; // Your Amplify configuration

export const metadata = {
  title: 'Morpheus - Open Beta API Gateway',
  description: 'Access and manage your API usage for Morpheus models.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
