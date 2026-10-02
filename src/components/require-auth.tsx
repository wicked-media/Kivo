import type { ReactNode } from 'react';

// NOTE: Prefer the real Convex React integration (`convex/react`) once the
// project is wired up. Until then, gate protected routes with a local stub.

export function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
