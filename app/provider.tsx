'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/lib/apollo';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloProvider client={apolloClient}>
        <SessionProvider>
          {children}
      </SessionProvider>
    </ApolloProvider>
  );
};