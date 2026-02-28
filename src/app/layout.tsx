import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: {
    template: "%s | Nexa Store",
    default: "Nexa Store | Premium App & Game Repository",
  },
  description: "Download rare, latest, and old versions of apps. Explore Magisk & LSPosed modules, trending games, and premium applications.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexastore.vercel.app'),
  openGraph: {
    title: "Nexa Store | Premium App & Game Repository",
    description: "Download rare, latest, and old versions of apps. Explore Magisk & LSPosed modules, trending games, and premium applications.",
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
    title: "Nexa Store | Premium App & Game Repository",
    description: "Download rare, latest, and old versions of apps. Explore Magisk & LSPosed modules, trending games, and premium applications.",
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
        <ThemeProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
