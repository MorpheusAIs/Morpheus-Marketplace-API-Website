import './globals.css';
import '@aws-amplify/ui-react/styles.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import ConfigureAmplifyClientSide from '@/components/ConfigureAmplifyClientSide';

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
        <ConfigureAmplifyClientSide />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
