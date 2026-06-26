import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Geosite DEVELOPERS — Signature Portfolio 2026',
  description:
    'Curating extraordinary living through iconic designs, sustainable innovation, and timeless elegance in Nairobi.',
  keywords: 'Geosite Developers, Nairobi, luxury interior design, architectural visualization, African design',
  openGraph: {
    title: 'Geosite DEVELOPERS — Signature Portfolio 2026',
    description: 'Curating extraordinary living through iconic designs, sustainable innovation, and timeless elegance in Nairobi.',
    locale: 'en_KE',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
