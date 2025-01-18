'use client';

import { type PropsWithChildren } from 'react';
import { QueryProvider } from './query-provider';

export function RootProvider({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
