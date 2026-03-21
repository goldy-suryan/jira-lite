'use client';

import { ApolloProvider } from '@apollo/client/react';
import { Inter, Manrope } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { apolloClient } from './lib/apollo-client';
import StoreProvider from './storeProvider';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} antialiased overflow-hidden`}
      >
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            error: {
              style: {
                background: '#a90303',
                color: '#fff',
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
