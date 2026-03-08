'use client';

import { ApolloProvider } from '@apollo/client/react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { apolloClient } from './lib/apollo-client';
import StoreProvider from './storeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
