import type { ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  // This legacy wrapper is no longer the active auth gate. The dashboard now
  // uses the RequireAuth in src/components/require-auth.tsx instead.
  return <>{children}</>;
}

export function KivoSpinner() {
  return (
    <span className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-kivo-300 border-t-kivo-600" aria-hidden="true" />
  );
}
