import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata = {
  title: 'LiteFi Admin Dashboard',
  description: 'Administrative dashboard for LiteFi financial services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/runtime-config.js"></script>
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
