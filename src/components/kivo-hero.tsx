import { motion } from 'framer-motion';
import { Sparkles, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

export function KivoHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="relative">
          <div className="max-w-3xl mx-auto lg:max-w-3xl lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-kivo-200 bg-white/70 px-3 py-1 text-xs font-medium text-kivo-700 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                AI that gets life admin done
              </div>

              <h1 className="mt-6 text-5xl font-bold tracking-tight text-kivo-900 sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-kivo-900 via-kivo-700 to-kivo-500 bg-clip-text text-transparent">
                  Kivo
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-kivo-600 max-w-2xl mx-auto lg:mx-0">
                Life has enough admin. Kivo watches your email, bills, subscriptions,
                documents and reminders, then turns the noise into the few things
                that actually need your attention.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <a href="#get-started">Get started</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-kivo-600 justify-center lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Email, documents, bills, subscriptions
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Structured Life Graph, not just chat
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Approve before anything happens
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative kinetic dot ring */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-kivo-200 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-kivo-200 to-transparent opacity-60" aria-hidden="true" />
      </div>

      {/* Floating UI preview */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative">
          <div className="rounded-xl border border-kivo-200 bg-white shadow-xl ring-1 ring-kivo-100/60">
            <KivoDashboardPreview />
          </div>
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              7 things that matter
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function KivoDashboardPreview() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-kivo-900">Your morning</span>
        <span className="rounded-full bg-kivo-900/10 px-2 py-0.5 text-xs text-kivo-700">
          Good morning, Aaron
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <KivoCard
          emoji="⚡"
          title="Electricity bill increased 22%"
          subtitle="Kivo found a cheaper plan. Save ~$412/year"
          action="Review"
          kind="review"
        />
        <KivoCard
          emoji="🚗"
          title="Registration due in 18 days"
          subtitle="$376 estimated"
          action="Pay"
          kind="action"
        />
        <KivoCard
          emoji="💳"
          title="Netflix price increased"
          subtitle="+$4/month"
          action="Keep"
          kind="review"
        />
        <KivoCard
          emoji="📄"
          title="Receipt — washing machine"
          subtitle="Warranty until 18 March 2027"
          action="Saved"
          kind="info"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-kivo-200 bg-kivo-50 px-3 py-2 text-sm text-kivo-600">
        <HelpCircle className="h-4 w-4 text-kivo-400" />
        <span>Ask Kivo — what do you need handled?</span>
      </div>
    </div>
  );
}

function KivoCard({
  emoji,
  title,
  subtitle,
  action,
  kind,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  action: string;
  kind: 'review' | 'action' | 'info';
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all hover:shadow-md',
        kind === 'review' && 'border-kivo-200 bg-white',
        kind === 'action' && 'border-amber-200 bg-amber-50/40',
        kind === 'info' && 'border-kivo-100 bg-kivo-50/40'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <span className="text-lg font-medium text-kivo-900 leading-snug">
            {emoji} {title}
          </span>
        </div>
        <span
          className={cn(
            'text-xs font-medium rounded-full px-2 py-0.5',
            kind === 'review' && 'bg-kivo-100 text-kivo-700',
            kind === 'action' && 'bg-amber-100 text-amber-700',
            kind === 'info' && 'bg-kivo-100 text-kivo-600'
          )}
        >
          {action}
        </span>
      </div>
      {subtitle && (
        <p className="mt-1.5 text-sm text-kivo-600">{subtitle}</p>
      )}
    </div>
  );
}
