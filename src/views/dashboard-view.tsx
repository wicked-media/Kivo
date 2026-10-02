import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  Zap,
  Banknote,
  FileText,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import {
  InboxView,
  InboxSkeleton,
  type LifeObjectShape,
  type ReminderShape,
} from '@/components/life-inbox';
import { KivoSpinner } from '@/components/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}
import {
  formatDistanceToNow,
  parseISO,
} from 'date-fns';

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 bg-white',
        highlight ? 'border-amber-200 bg-amber-50/40' : 'border-kivo-200'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-kivo-600">{label}</span>
        <Icon className={cn('h-4 w-4', highlight ? 'text-amber-600' : 'text-kivo-400')} />
      </div>
      <p className={cn('mt-1 text-2xl font-bold', highlight ? 'text-amber-700' : 'text-kivo-900')}>
        {value}
      </p>
    </div>
  );
}

interface DashboardProfile {
  name: string;
  stats: {
    subscriptions: number;
    bills: number;
    warranties: number;
    appointments: number;
    priceIncreases: number;
    attention: number;
  };
}

interface DashboardData {
  objects: LifeObjectShape[];
  reminders: ReminderShape[];
  actions: {
    id: string;
    kind: string;
    intent?: string | null;
    status: string;
    decidedBy?: string | null;
    decidedAt?: string | null;
  }[];
}

const DETERMINISTIC_PROFILE: DashboardProfile = {
  name: 'Aaron',
  stats: {
    subscriptions: 12,
    bills: 8,
    warranties: 3,
    appointments: 4,
    priceIncreases: 2,
    attention: 1,
  },
};

const DETERMINISTIC_DATA: DashboardData = {
  objects: [
    {
      id: 'obj-electricity',
      type: 'bill',
      subtype: 'electricity',
      title: 'Electricity bill increased 22%',
      status: 'needs_attention',
      priority: 'high',
      source: 'PowerCo',
      nextAction: {
        kind: 'switch',
        status: 'suggested',
        dueBy: new Date(Date.now() + 86400000 * 3).toISOString(),
        chargeUntil: null,
      },
      why: 'Kivo found a cheaper plan. Save ~$412/year.',
    },
    {
      id: 'obj-rego',
      type: 'renewal',
      subtype: 'rego',
      title: 'Registration due in 18 days',
      status: 'watch',
      priority: 'normal',
      source: 'Vicroads',
      nextAction: {
        kind: 'renew',
        status: 'suggested',
        dueBy: new Date(Date.now() + 86400000 * 18).toISOString(),
        chargeUntil: null,
      },
      why: '$376 estimated.',
    },
    {
      id: 'obj-netflix',
      type: 'subscription',
      subtype: 'netflix',
      title: 'Netflix price increased',
      status: 'watch',
      priority: 'low',
      source: 'Netflix',
      nextAction: {
        kind: 'review',
        status: 'suggested',
        dueBy: null,
        chargeUntil: null,
      },
      why: '+$4/month.',
    },
    {
      id: 'obj-receipt',
      type: 'receipt',
      subtype: 'appliance',
      title: 'Receipt — washing machine',
      status: 'done',
      priority: 'info',
      source: 'Best Buy',
      nextAction: null,
      why: 'Warranty until 18 March 2027.',
    },
  ],
  reminders: [
    {
      id: 'rem-1',
      title: 'Electricity bill — review cheaper plan',
      dueAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'open',
    },
  ],
  actions: [
    {
      id: 'act-1',
      kind: 'kivo:summary',
      intent: 'First life inbox scan complete',
      status: 'approved',
      decidedBy: 'kivo',
      decidedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

export function DashboardView() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const profile = DETERMINISTIC_PROFILE;
  const data = DETERMINISTIC_DATA;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kivo-50">
        <KivoSpinner />
      </div>
    );
  }

  const stats = profile.stats;
  const objects: LifeObjectShape[] = data.objects;
  const reminders: ReminderShape[] = data.reminders;

  const handleAction = async (_id: string, _kind: string, _status: string) => {
    void _status;
    // MVP: external action plumbing comes once Convex actions are live.
    return Promise.resolve();
  };

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Top greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kivo-900">
            Good morning, {profile.name}
          </h1>
          <p className="mt-1 text-sm text-kivo-600">
            {stats.attention > 0
              ? `${stats.attention} thing${stats.attention === 1 ? '' : 's'} need${stats.attention === 1 ? '' : 's'} your attention`
              : 'Everything is currently in order'}
          </p>
        </div>

        {/* Stats strip */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            icon={Banknote}
            label="Subscriptions"
            value={stats.subscriptions}
          />
          <StatCard
            icon={Zap}
            label="Upcoming bills"
            value={stats.bills}
          />
          <StatCard
            icon={FileText}
            label="Warranties"
            value={stats.warranties}
          />
          <StatCard
            icon={Calendar}
            label="Appointments"
            value={stats.appointments}
          />
          <StatCard
            icon={TrendingUp}
            label="Price increases"
            value={stats.priceIncreases}
            highlight={stats.priceIncreases > 0}
          />
          <StatCard
            icon={AlertTriangle}
            label="Needs attention"
            value={stats.attention}
            highlight={stats.attention > 0}
          />
        </div>

        {/* Inbox */}
        <div className="rounded-xl border border-kivo-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-kivo-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-kivo-900">
                  <Inbox className="mr-2 inline h-4 w-4 text-kivo-500" />
                  Life Inbox
                </h2>
                <p className="mt-0.5 text-xs text-kivo-500">
                  Your life, organised into things that matter
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{objects.length} items</Badge>
                <Badge variant="outline">{reminders.length} open</Badge>
              </div>
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <InboxSkeleton />
            ) : (
              <InboxView
                objects={objects}
                reminders={reminders}
                onAction={handleAction}
              />
            )}
          </div>
        </div>

        {/* Recent actions / history */}
        {data.actions.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-kivo-900">
              <Sparkles className="h-4 w-4 text-kivo-500" />
              Recent Kivo activity
            </h2>
            <Card className="border-kivo-200 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-kivo-100">
                  {data.actions.slice(0, 6).map((action: {
                    id: string;
                    kind: string;
                    intent?: string | null;
                    status: string;
                    decidedBy?: string | null;
                    decidedAt?: string | null;
                  }) => (
                    <div key={action.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-kivo-900">
                            {action.kind.replace(':', ' ')}
                          </p>
                          {action.intent && (
                            <p className="truncate text-xs text-kivo-500">
                              {action.intent}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {action.status === 'approved' && (
                            <Badge variant="success">Approved</Badge>
                          )}
                          {action.status === 'pending' && (
                            <Badge variant="warning">Pending</Badge>
                          )}
                          {action.decidedBy && (
                            <span className="text-xs text-kivo-400">
                              by {action.decidedBy}
                            </span>
                          )}
                        </div>
                      </div>
                      {action.decidedAt && (
                        <p className="mt-1 text-xs text-kivo-400">
                          {formatDistanceToNow(parseISO(action.decidedAt), {
                            addSuffix: true,
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
