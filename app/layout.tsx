import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Archive | Official Match & Score Records',
  description: 'Verified archive and live bracket tracker of every game and score from the FIFA 2026 World Cup.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
