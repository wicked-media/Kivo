import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const QueryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={QueryClientInstance}>
      {children}
    </QueryClientProvider>
  );
}
