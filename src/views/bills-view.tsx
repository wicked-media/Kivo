import { useState } from 'react';
import { motion } from 'framer-motion';import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Check,
  Search,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}
import { format, parseISO } from 'date-fns';

const MOCK_BILLS = [
  {
    id: '1',
    provider: 'PowerCo',
    type: 'Electricity',
    amount: 284,
    currency: 'AUD',
    dueAt: '2026-10-14',
    status: 'due_soon',
    previousAmount: 233,
    movement: 'up',
    movementPercent: 22,
    category: 'utility',
  },
  {
    id: '2',
    provider: 'StreamNet',
    type: 'Internet',
    amount: 109,
    currency: 'AUD',
    dueAt: '2026-10-20',
    status: 'due_soon',
    previousAmount: 79,
    movement: 'up',
    movementPercent: 38,
    category: 'telecom',
  },
  {
    id: '3',
    provider: 'Telstra',
    type: 'Mobile',
    amount: 49,
    currency: 'AUD',
    dueAt: '2026-10-27',
    status: 'ok',
    previousAmount: 49,
    movement: 'flat',
    movementPercent: 0,
    category: 'telecom',
  },
  {
    id: '4',
    provider: 'QBE',
    type: 'Home & Contents Insurance',
    amount: 512,
    currency: 'AUD',
    dueAt: '2026-11-02',
    status: 'upcoming',
    previousAmount: 411,
    movement: 'up',
    movementPercent: 25,
    category: 'insurance',
  },
  {
    id: '5',
    provider: 'City Council',
    type: 'Council Rates',
    amount: 1870,
    currency: 'AUD',
    dueAt: '2026-11-18',
    status: 'upcoming',
    previousAmount: 1870,
    movement: 'flat',
    movementPercent: 0,
    category: 'rates',
  },
  {
    id: '6',
    provider: 'Origin Energy',
    type: 'Gas',
    amount: 92,
    currency: 'AUD',
    dueAt: '2026-12-01',
    status: 'upcoming',
    previousAmount: 88,
    movement: 'up',
    movementPercent: 5,
    category: 'utility',
  },
];

const STATUS_LABELS: Record<string, string> = {
  due_soon: 'Due soon',
  upcoming: 'Upcoming',
  ok: 'On track',
  overdue: 'Overdue',
};

const STATUS_STYLE: Record<string, { badge: string; accent: string }> = {
  due_soon: { badge: 'warning', accent: 'text-amber-700' },
  upcoming: { badge: 'secondary', accent: 'text-kivo-600' },
  ok: { badge: 'success', accent: 'text-emerald-700' },
  overdue: { badge: 'destructive', accent: 'text-red-700' },
};

type Bill = (typeof MOCK_BILLS)[number];

export function BillsView() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = MOCK_BILLS.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.provider.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  const selected = selectedId ? MOCK_BILLS.find(b => b.id === selectedId) : null;

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kivo-900">Bills</h1>
          <p className="mt-1 text-sm text-kivo-600">
            Bills Kivo is watching, with price movement flagged where it can see it.
          </p>
        </div>

        {/* Price movement summary */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    2 bills increased this month
                  </p>
                  <p className="text-xs text-amber-700">
                    Electricity +22%, Internet +38%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    4 bills on track
                  </p>
                  <p className="text-xs text-emerald-700">
                    Mobile, council rates and gas unchanged
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kivo-400" />
          <Input
            placeholder="Search bills by provider, type or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {filtered.map(bill => {
              const style = STATUS_STYLE[bill.status] ?? STATUS_STYLE.ok;
              return (
                <Card
                  key={bill.id}
                  className={cn(
                    'cursor-pointer border-kivo-200 bg-white transition-all',
                    selectedId === bill.id && 'border-kivo-500 ring-1 ring-kivo-500/30',
                    bill.movement === 'up' && 'border-amber-200/70'
                  )}
                  onClick={() => setSelectedId(bill.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-kivo-900">
                            {bill.provider}
                          </span>
                          {bill.movement === 'up' && (
                            <Badge variant="warning" className="font-normal">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              +{bill.movementPercent}%
                            </Badge>
                          )}
                        </div>
                        <span className="mt-0.5 text-sm text-kivo-600">
                          {bill.type}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg font-bold text-kivo-900">
                          ${bill.amount}
                        </span>
                        <span className="text-xs text-kivo-500">
                          {bill.currency}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            style.accent
                          )}
                        >
                          {STATUS_LABELS[bill.status]}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-kivo-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Due {format(parseISO(bill.dueAt), 'd MMMM')}
                      </span>
                      {bill.movement !== 'flat' && (
                        <span className="flex items-center gap-1 text-amber-700">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {bill.previousAmount} → {bill.amount}
                        </span>
                      )}
                      <Badge variant={style.badge} className="font-normal">
                        {bill.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <Card className="border-kivo-200 bg-white">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-kivo-500">
                    No bills match your search.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {selected ? (
              <MotionPanel bill={selected} />
            ) : (
              <Card className="border-kivo-200 bg-white">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-kivo-500">
                    Select a bill to see details.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}

function MotionPanel({ bill }: { bill: Bill }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-kivo-200 bg-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{bill.provider}</CardTitle>
              <CardDescription>{bill.type}</CardDescription>
            </div>
            <Badge
              variant={STATUS_STYLE[bill.status]?.badge ?? 'secondary'}
              className="font-normal"
            >
              {STATUS_LABELS[bill.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount" value={`$${bill.amount} ${bill.currency}`} />
            <Field
              label="Due"
              value={format(parseISO(bill.dueAt), 'd MMMM yyyy')}
            />
            <Field label="Category" value={bill.category} />
            <Field
              label="Previous"
              value={`$${bill.previousAmount} ${bill.currency}`}
            />
          </div>

          {bill.movement !== 'flat' && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <TrendingUp className="h-4 w-4" />
                Price increased {bill.movementPercent}%
              </div>
              <p className="mt-1 text-xs text-amber-700">
                Kivo can compare alternatives and find a cheaper equivalent plan.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              Pay
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Remind me
            </Button>
            <Button size="sm" variant="ghost">
              Compare plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-kivo-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-kivo-900">{value}</p>
    </div>
  );
}
