import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Avolta Digital Book',
    default: 'Avolta Digital Book',
  },
  description:
    'Monthly digital feature releases across Avolta work streams — Website R&C and Emporium, Club Avolta App, OMS, SSO, My Autogrill, and Audio Digest.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalbook.avolta.com'),
  openGraph: {
    type: 'website',
    siteName: 'Avolta Digital Book',
    locale: 'en_US',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8F53F0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
