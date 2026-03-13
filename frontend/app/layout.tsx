'use client';

import { ApolloProvider } from '@apollo/client/react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
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
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            error: {
              style: {
                background: '#a90303',
                color: '#fff'
              },
            },
          }}
        />
        <StoreProvider>
          <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
