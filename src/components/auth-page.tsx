import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}
import { Button } from '@/components/ui/button';

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/dashboard';
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const already = typeof window !== 'undefined' ? sessionStorage.getItem('kivo.dev.authed') : null;
    setChecking(false);
    if (already) {
      navigate(returnTo, { replace: true });
    }
  }, [navigate, returnTo]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kivo-50">
        <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-kivo-300 border-t-kivo-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Soft kinetic background band */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-kivo-50 via-white to-kivo-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-kivo-100/60 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <div className="inline-flex items-center justify-center rounded-full bg-kivo-100 px-4 py-1.5 text-xs font-medium text-kivo-700 ring-1 ring-kivo-200/60">
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-kivo-600" />
          Life, handled
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-kivo-900 sm:text-5xl">
          Welcome to Kivo
        </h1>
        <p className="mt-4 text-base text-kivo-600">
          Sign in to let Kivo watch your inbox, bills, subscriptions and
          documents, then surface the few things that actually need your
          attention.
        </p>

        <div className="mt-8">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              sessionStorage.setItem('kivo.dev.authed', '1');
              navigate(returnTo, { replace: true });
            }}
          >
            Continue with email
          </Button>
        </div>

        <p className="mt-5 text-xs text-kivo-500">
          By continuing, you agree Kivo will only act on your life after you
          approve it.
        </p>
      </motion.div>
    </div>
  );
}
