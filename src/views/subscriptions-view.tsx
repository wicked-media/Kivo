import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Banknote,
  TrendingUp,
  X,
  RefreshCw,
  Search,
  HelpCircle,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const MOCK_SUBSCRIPTIONS = [
  {
    id: '1',
    name: 'Netflix',
    category: 'streaming',
    amount: 22.99,
    currency: 'USD',
    cycle: 'monthly',
    nextCharge: '2026-10-12',
    status: 'active',
    usage: 'low',
    note: 'Price increased from $22.99 to $22.99 — flagged by Kivo as a silent renewal.',
  },
  {
    id: '2',
    name: 'Spotify Family',
    category: 'streaming',
    amount: 22.99,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-14',
    status: 'active',
    usage: 'high',
  },
  {
    id: '3',
    name: 'CloudStorage Plus',
    category: 'storage',
    amount: 12.0,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-16',
    status: 'active',
    usage: 'low',
  },
  {
    id: '4',
    name: 'Dropbox Plus',
    category: 'storage',
    amount: 14.0,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-18',
    status: 'active',
    usage: 'low',
    note: 'Duplicate storage service — CloudStorage Plus and Dropbox cover similar needs.',
  },
  {
    id: '5',
    name: 'Adobe Creative Cloud',
    category: 'software',
    amount: 62.99,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-21',
    status: 'active',
    usage: 'high',
  },
  {
    id: '6',
    name: 'Gym Membership',
    category: 'membership',
    amount: 65.0,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-22',
    status: 'active',
    usage: 'low',
  },
  {
    id: '7',
    name: 'Premium News',
    category: 'media',
    amount: 14.99,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-25',
    status: 'active',
    usage: 'low',
  },
  {
    id: '8',
    name: 'Old Mobile Plan A',
    category: 'telecom',
    amount: 40.0,
    currency: 'AUD',
    cycle: 'monthly',
    nextCharge: '2026-10-28',
    status: 'paused',
    usage: 'none',
    note: 'This membership appears paused but the account still exists.',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  streaming: 'Streaming',
  storage: 'Storage',
  software: 'Software',
  membership: 'Membership',
  media: 'Media',
  telecom: 'Telecom',
  other: 'Other',
};

const USAGE_LABELS: Record<string, { label: string; badge: string }> = {
  high: { label: 'Used a lot', badge: 'success' },
  low: { label: 'Used a little', badge: 'secondary' },
  none: { label: 'Not used recently', badge: 'destructive' },
};

type Sub = (typeof MOCK_SUBSCRIPTIONS)[number];

export function SubscriptionsView() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = MOCK_SUBSCRIPTIONS.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalMonthly = filtered
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const duplicates = [
    {
      pair: ['CloudStorage Plus', 'Dropbox Plus'],
      reason: 'Two cloud storage services covering similar needs.',
    },
  ];

  const priceIncreases = [
    {
      name: 'Premium News',
      changed: '2026-10-01',
      from: 11.99,
      to: 14.99,
    },
  ];

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kivo-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-kivo-600">
            Kivo found {filtered.length} subscriptions totalling about{' '}
            <strong>${totalMonthly.toFixed(2)}</strong>/month.
          </p>
        </div>

        {/* Insights strip */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Card className="border-kivo-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-kivo-600">Monthly total</p>
                  <p className="text-2xl font-bold text-kivo-900">
                    ${totalMonthly.toFixed(2)}
                  </p>
                  <p className="text-xs text-kivo-500">across {filtered.length} subs</p>
                </div>
                <Banknote className="h-5 w-5 text-kivo-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Price increases</p>
                  <p className="text-lg font-bold text-amber-800">{priceIncreases.length}</p>
                  <p className="text-xs text-amber-700">this month</p>
                </div>
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Duplicate services</p>
                  <p className="text-lg font-bold text-red-800">{duplicates.length}</p>
                  <p className="text-xs text-red-700">worth reviewing</p>
                </div>
                <RefreshCw className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kivo-400" />
          <Input
            placeholder="Search subscriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="space-y-2">
            {filtered.map(sub => {
              const _usage = USAGE_LABELS[sub.usage] ?? USAGE_LABELS.none;
              return (
                <Card
                  key={sub.id}
                  className={cn(
                    'cursor-pointer border-kivo-200 bg-white transition-all',
                    openId === sub.id && 'border-kivo-500 ring-1 ring-kivo-500/30',
                    sub.status === 'paused' && 'opacity-70'
                  )}
                  onClick={() => setOpenId(openId === sub.id ? null : sub.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-kivo-900">
                            {sub.name}
                          </span>
                          {sub.status === 'paused' && (
                            <Badge variant="secondary" className="font-normal">
                              <X className="mr-1 h-3 w-3" />
                              Paused
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {CATEGORY_LABELS[sub.category] ?? sub.category}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-kivo-600">
                          {sub.cycle === 'monthly' ? 'Monthly' : sub.cycle} ·{' '}
                          {format(parseISO(sub.nextCharge), 'd MMMM')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-lg font-bold text-kivo-900">
                          ${sub.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-kivo-500">{sub.currency}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <Card className="border-kivo-200 bg-white">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-kivo-500">No subscriptions match.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detail / insights */}
          <div className="space-y-4">
            {openId ? (
              <MotionSubDetail sub={MOCK_SUBSCRIPTIONS.find(s => s.id === openId)} />
            ) : (
              <Card className="border-kivo-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-kivo-600">
                    <HelpCircle className="h-4 w-4 text-kivo-400" />
                    Select a subscription for details.
                  </div>
                </CardContent>
              </Card>
            )}

            {duplicates.length > 0 && (
              <Card className="border-red-200 bg-red-50/60">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-red-600" />
                    Duplicate services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {duplicates.map(d => (
                    <div key={d.pair.join('+')} className="rounded-lg border border-red-200 bg-white p-3">
                      <p className="text-sm font-medium text-kivo-900">
                        {d.pair.join(' & ')}
                      </p>
                      <p className="mt-1 text-xs text-red-700">{d.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {priceIncreases.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/60">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    Price increases
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {priceIncreases.map(p => (
                    <div key={p.name} className="rounded-lg border border-amber-200 bg-white p-3">
                      <p className="text-sm font-medium text-kivo-900">{p.name}</p>
                      <p className="mt-1 text-xs text-amber-700">
                        {format(parseISO(p.changed), 'd MMMM yyyy')} ·{' '}
                        ${p.from.toFixed(2)} → ${p.to.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}

function MotionSubDetail({ sub }: { sub: Sub | undefined }) {
  if (!sub) return null;
  const _usage = USAGE_LABELS[sub.usage] ?? USAGE_LABELS.none;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-kivo-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">{sub.name}</CardTitle>
          <CardDescription>
            {CATEGORY_LABELS[sub.category] ?? sub.category} ·{' '}
            {sub.cycle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current charge" value={`$${sub.amount.toFixed(2)} ${sub.currency}`} />
            <Field
              label="Next charge"
              value={format(parseISO(sub.nextCharge), 'd MMMM yyyy')}
            />
            <Field
              label="Status"
              value={sub.status === 'active' ? 'Active' : 'Paused'}
              badge={sub.status === 'active' ? 'success' : 'secondary'}
            />
            <Field label="Usage" value={usage.label} badge={usage.badge} />
          </div>
          {sub.note && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm text-amber-800">{sub.note}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" className="flex-1">
              Cancel
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Remind me
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Field({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div>
      <p className="text-xs text-kivo-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-kivo-900 flex items-center gap-2">
        {value}
        {badge && (
          <Badge variant={badge as 'success' | 'secondary' | 'destructive'} className="font-normal text-xs">
            {badge}
          </Badge>
        )}
      </p>
    </div>
  );
}
