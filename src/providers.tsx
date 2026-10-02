import type { ReactNode } from 'react';

// Placeholder provider tree kept intentionally thin while Convex auth is being
// wired up. Once Convex React is live, expand this to wrap the app in the real
// Convex + Convex Auth providers.

export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
