
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://speakup-nepal.netlify.app'),
  title: "SpeakUp - Now or Never",
  description: "Share your voice, report news, and connect with your community",
  keywords: "nepal, news, social media, community, voice, speak up",
  authors: [{ name: "SpeakUp Team" }],
  
  // Favicon Configuration
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico' }
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'android-chrome', url: '/favicons/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/favicons/android-chrome-512x512.png', sizes: '512x512' }
    ]
  },

  // Web App Manifest
  manifest: '/favicons/site.webmanifest',

  // Open Graph
  openGraph: {
    title: "SpeakUp - Now or Never",
    description: "Share your voice, report news, and connect with your community",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/logo/logo-light.svg',
        width: 1200,
        height: 630,
        alt: 'SpeakUp Logo'
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "SpeakUp - Now or Never",
    description: "Share your voice, report news, and connect with your community",
    images: ['/logo/logo-light.svg']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E53E3E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional Favicon Links for better browser support */}
        <link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        
        {/* PWA Theme Color */}
        <meta name="msapplication-TileColor" content="#E53E3E" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}
        suppressHydrationWarning={true}
      >
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}