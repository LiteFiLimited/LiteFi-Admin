import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { RouteGuard } from '@/components/auth/RouteGuard'
import { ToastProvider } from '@/components/ui/toast-provider'

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: 'LiteFi Admin Dashboard',
  description: 'LiteFi financial platform administration dashboard',
  icons: {
    icon: '/assets/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className} suppressHydrationWarning={true}>
        <ToastProvider>
          <AuthProvider>
            <RouteGuard>
              {children}
            </RouteGuard>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
