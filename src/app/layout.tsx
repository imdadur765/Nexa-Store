import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { AppCacheProvider } from "@/components/AppCacheProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Nexa Store",
    default: "Nexa Store | Premium App & Game Store",
  },
  description: "Download the latest apps, trending games, and exclusive collections. Your one-stop app store for Android.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexastore.vercel.app'),
  openGraph: {
    title: "Nexa Store | Premium App & Game Store",
    description: "Download the latest apps, trending games, and exclusive collections. Your one-stop app store for Android.",
    url: "/",
    siteName: "Nexa Store",
    images: [
      {
        url: "/og-image.png", // Default OG Image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Store | Premium App & Game Store",
    description: "Download the latest apps, trending games, and exclusive collections. Your one-stop app store for Android.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppCacheProvider>
          <ThemeProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </ThemeProvider>
        </AppCacheProvider>
      </body>
    </html>
  );
}
