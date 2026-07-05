import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Condividy - File Sharing',
  description: 'Simple and secure file sharing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
