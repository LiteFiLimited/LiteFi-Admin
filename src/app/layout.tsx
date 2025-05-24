import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "LiteFi Admin Dashboard",
  description: "Admin dashboard for the LiteFi financial platform",
  icons: {
    icon: "/assets/logo.svg",
    shortcut: "/assets/logo.svg",
    apple: "/assets/logo.svg",
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
  other: {
    "format-detection": "telephone=no, date=no, email=no, address=no"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
