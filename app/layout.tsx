import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'What Men Carry — LIMEN Helix',
  description: 'A community for men. Stories about the weight we carry. Mental health through cinematic video.',
  openGraph: {
    title: 'What Men Carry — LIMEN Helix',
    description: 'A community for men. Stories about the weight we carry.',
    url: 'https://whatmencarry.com',
    type: 'website',
    images: [
      {
        url: 'https://whatmencarry.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Men Carry — LIMEN Helix',
    description: 'A community for men. Stories about the weight we carry.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-gray-200">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
