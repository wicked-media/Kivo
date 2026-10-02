import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Banknote,
  Clock,
  CheckCircle2,
  FileText,
  HelpCircle,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';

export type LifeObjectShape = {
  id: string;
  type: string;
  subtype: string;
  title: string;
  status: string;
  priority: string;
  source?: string;
  nextAction?: {
    kind: string;
    status: string;
    dueBy: string | null;
    chargeUntil: string | null;
  } | null;
  why?: string;
};

export type ReminderShape = {
  id: string;
  title: string;
  dueAt: string;
  status: string;
  becauseOfId?: string;
};

type InboxSection =
  | { type: 'attention'; title: string }
  | { type: 'price'; title: string }
  | { type: 'upcoming'; title: string }
  | { type: 'saved'; title: string }
  | { type: 'all'; title: string; count?: number };

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
  info: 'Info',
};

function priorityClass(p: string): string {
  return cn(
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
    p === 'urgent' && 'bg-red-100 text-red-700',
    p === 'high' && 'bg-amber-100 text-amber-700',
    p === 'normal' && 'bg-kivo-100 text-kivo-700',
    p === 'low' && 'bg-kivo-50 text-kivo-600',
    p === 'info' && 'bg-kivo-50 text-kivo-600'
  );
}

function actionKindIcon(kind: string) {
  if (kind === 'pay') return <Zap className="h-4 w-4" />;
  if (kind === 'cancel') return <Banknote className="h-4 w-4" />;
  if (kind === 'renew') return <Clock className="h-4 w-4" />;
  if (kind === 'switch' || kind === 'review') return <HelpCircle className="h-4 w-4" />;
  if (kind === 'upload') return <FileText className="h-4 w-4" />;
  return <ArrowRight className="h-4 w-4" />;
}

function CardKivo({
  object,
  onAction,
}: {
  object: LifeObjectShape;
  onAction?: (id: string, kind: string, status: string) => Promise<unknown>;
}) {
  const [approving, setApproving] = useState(false);

  const handleAction = async (kind: string, status: string) => {
    if (!onAction) return;
    setApproving(true);
    try {
      await onAction(object.id, kind, status);
    } finally {
      setApproving(false);
    }
  };

  const dueDate = object.nextAction?.dueBy
    ? parseISO(object.nextAction.dueBy)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="overflow-hidden border-kivo-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-kivo-900">
                  {object.title}
                </span>
                <Badge variant={object.priority === 'urgent' ? 'destructive' : 'default'}>
                  {PRIORITY_LABELS[object.priority] ?? object.priority}
                </Badge>
                {object.source && (
                  <Badge variant="secondary" className="font-normal text-xs">
                    {object.source}
                  </Badge>
                )}
              </div>

              <div className="mt-2 text-sm text-kivo-600">
                {object.why ? (
                  <span>{object.why}</span>
                ) : object.nextAction?.kind ? (
                  <span className="flex items-center gap-1.5">
                    {actionKindIcon(object.nextAction.kind)}
                    <span>
                      {actionLabel(object.nextAction.kind)} this item
                    </span>
                  </span>
                ) : (
                  <span>No action needed yet</span>
                )}
              </div>

              {dueDate && (
                <div className="mt-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      isPast(dueDate)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-kivo-100 text-kivo-700'
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {formatDistanceToNow(dueDate, { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              {object.nextAction?.kind && object.nextAction?.status === 'suggested' && (
                <Button
                  size="sm"
                  variant="default"
                  disabled={approving}
                  onClick={() =>
                    handleAction(object.nextAction.kind, 'approved')
                  }
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Handle it
                </Button>
              )}
              {object.status === 'needs_attention' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={approving}
                  onClick={() => handleAction('review', 'approved')}
                >
                  Review
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function actionLabel(kind: string) {
  return (
    {
      pay: 'Pay',
      cancel: 'Cancel',
      renew: 'Renew',
      switch: 'Switch',
      review: 'Review',
      upload: 'Upload',
      confirm: 'Confirm',
      ignore: 'Ignore',
      none: '',
      approve: 'Approve',
    }[kind] ?? 'Handle'
  );
}

export function InboxView({
  objects,
  reminders,
  onAction,
}: {
  objects: LifeObjectShape[];
  reminders: ReminderShape[];
  onAction?: (id: string, kind: string, status: string) => Promise<unknown> | void;
}) {
  const [section, setSection] = useState<InboxSection>({
    type: 'attention',
    title: 'Needs attention',
  });

  const sections: InboxSection[] = [
    { type: 'attention', title: 'Needs attention' },
    { type: 'price', title: 'Price changes' },
    { type: 'upcoming', title: 'Upcoming' },
    { type: 'saved', title: 'Saved' },
    { type: 'all', title: 'All items', count: objects.length },
  ];

  const grouped: Record<string, LifeObjectShape[]> = {
    attention: [],
    price: [],
    upcoming: [],
    saved: [],
    all: [],
  };

  for (const obj of objects) {
    grouped.all.push(obj);
    if (obj.status === 'needs_attention') grouped.attention.push(obj);
    if (obj.type === 'price_movement' || obj.subtype === 'price_movement') grouped.price.push(obj);
    if (
      obj.nextAction?.dueBy ||
      obj.type === 'appointment' ||
      obj.subtype === 'registration'
    )
      grouped.upcoming.push(obj);
    if (obj.status === 'done' || obj.status === 'archived')
      grouped.saved.push(obj);
  }

  const activeGroup = section.type === 'attention'
    ? grouped.attention
    : section.type === 'price'
      ? grouped.price
      : section.type === 'upcoming'
        ? grouped.upcoming
        : section.type === 'saved'
          ? grouped.saved
          : grouped.all;

  // Compact reminder strip
  const dueReminders = reminders
    .filter(r => {
      const d = parseISO(r.dueAt);
      return !isPast(d) || r.status === 'open';
    })
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-1 border-b border-kivo-200 pb-4">
        {sections.map(sec => {
          const active = section.type === sec.type;
          const label = sec.type === 'all' && typeof sec.count === 'number'
            ? `${sec.title} (${sec.count})`
            : sec.title;
          return (
            <button
              key={sec.type}
              onClick={() => setSection(sec)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-kivo-100 text-kivo-900'
                  : 'text-kivo-600 hover:bg-kivo-50'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Items */}
      {activeGroup.length === 0 ? (
        <Card className="border-kivo-200 bg-white shadow-sm">
          <CardContent className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kivo-100">
              <CheckCircle2 className="h-6 w-6 text-kivo-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-kivo-700">
              Nothing here yet
            </p>
            <p className="mt-1 text-sm text-kivo-500">
              Connect your email or upload a document and Kivo will start
              spotting the things that matter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {activeGroup.map(object => (
            <CardKivo key={object.id} object={object} onAction={onAction} />
          ))}
        </div>
      )}

      {/* Reminders strip */}
      {dueReminders.length > 0 && (
        <Card className="border-kivo-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-kivo-500" />
                <span className="text-sm font-medium text-kivo-900">
                  Upcoming reminders
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href="/dashboard/reminders" className="text-kivo-600">
                  View all
                </a>
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {dueReminders.map(r => {
                const due = parseISO(r.dueAt);
                return (
                  <li
                    key={r.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate text-kivo-700">{r.title}</span>
                    <span className={cn(
                      'shrink-0 rounded-full bg-kivo-100 px-2 py-0.5 text-xs font-medium text-kivo-700',
                      isPast(due) ? 'bg-red-100 text-red-700' : ''
                    )}>
                      {formatDistanceToNow(due, { addSuffix: true })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function InboxSkeleton() {
  return (
    <div className="space-y-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
