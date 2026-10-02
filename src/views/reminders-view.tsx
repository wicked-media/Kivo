import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, Check, RotateCcw, Trash2 } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}
import { format, parseISO, isPast, addDays } from 'date-fns';

const MOCK_REMINDERS = [
  {
    id: '1',
    title: 'Electricity bill — review cheaper plan',
    dueAt: '2026-10-14T09:00:00Z',
    status: 'open',
    becauseOf: 'PowerCo electricity bill',
  },
  {
    id: '2',
    title: 'Registration due — renew before 12 Dec',
    dueAt: '2026-12-12T00:00:00Z',
    status: 'open',
    becauseOf: 'Toyota RAV4 registration',
  },
  {
    id: '3',
    title: 'Insurance renewal increased — compare QBE quote',
    dueAt: '2026-11-02T09:00:00Z',
    status: 'open',
    becauseOf: 'QBE home insurance',
  },
  {
    id: '4',
    title: 'Year 6 camp permission form — sign and return',
    dueAt: '2026-11-10T17:00:00Z',
    status: 'open',
    becauseOf: 'School excursion form',
  },
  {
    id: '5',
    title: 'Netflix price increased — decide keep or cancel',
    dueAt: '2026-10-10T09:00:00Z',
    status: 'completed',
    becauseOf: 'Netflix subscription',
  },
];

const STATUS_LABELS: Record<string, { label: string; badge: string; color: string }> = {
  open: { label: 'Open', badge: 'warning', color: 'text-amber-700' },
  completed: { label: 'Done', badge: 'success', color: 'text-emerald-700' },
  snoozed: { label: 'Snoozed', badge: 'secondary', color: 'text-kivo-600' },
};

type Reminder = (typeof MOCK_REMINDERS)[number];

export function RemindersView() {
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState('');
  const [adding, setAdding] = useState(false);
  const [created, setCreated] = useState(false);

  const open = MOCK_REMINDERS.filter(r => r.status === 'open');
  const done = MOCK_REMINDERS.filter(r => r.status === 'completed');
  const snoozed = MOCK_REMINDERS.filter(r => r.status === 'snoozed');

  const handleAdd = async () => {
    if (!newTitle.trim() || !newDue) return;
    setAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCreated(true);
      setNewTitle('');
      setNewDue('');
    } finally {
      setAdding(false);
    }
  };

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>              <h1 className="text-2xl font-bold text-kivo-900">Reminders</h1>
            <p className="mt-1 text-sm text-kivo-600">
              Things Kivo surfaced that you asked to be reminded about.
            </p>
            {/}
            
          </div>
          <Button onClick={() => document.getElementById('add-reminder')?.click()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add reminder
          </Button>
        </div>

        {/* Add reminder form */}
        <Card className="mb-6 border-kivo-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <input
                id="add-reminder"
                type="file"
                className="hidden"
              />
              <div className="flex-1 grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs text-kivo-500">Reminder</Label>
                  <Input
                    placeholder="What should Kivo remind you about?"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs text-kivo-500">Due date</Label>
                  <Input
                    type="date"
                    value={newDue}
                    onChange={e => setNewDue(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs text-kivo-500">Repeat</Label>
                  <select
                    className={cn(
                      'mt-1 h-9 w-full rounded-lg border border-kivo-200 bg-white px-3 text-sm text-kivo-900 focus:border-kivo-400 focus:outline-none focus:ring-2 focus:ring-kivo-400'
                    )}
                  >
                    <option value="">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="shrink-0"
                onClick={handleAdd}
                disabled={
                  adding || !newTitle.trim() || !newDue
                }
              >
                {adding ? <Clock className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            {created && (
              <p className="mt-3 text-sm text-emerald-700 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Reminder created.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Open */}
        <Section title="Open" count={open.length}>
          {open.map(r => (
            <ReminderRow key={r.id} reminder={r} />
          ))}
          {open.length === 0 && (
            <Card className="border-kivo-200 bg-white">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-kivo-500">No open reminders.</p>
              </CardContent>
            </Card>
          )}
        </Section>

        {/* Snoozed */}
        <Section title="Snoozed" count={snoozed.length}>
          {snoozed.map(r => (
            <ReminderRow key={r.id} reminder={r} />
          ))}
          {snoozed.length === 0 && (
            <Card className="border-kivo-200 bg-white/60">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-kivo-400">No snoozed reminders.</p>
              </CardContent>
            </Card>
          )}
        </Section>

        {/* Done */}
        <Section title="Done" count={done.length} muted>
          {done.map(r => (
            <ReminderRow key={r.id} reminder={r} />
          ))}
          {done.length === 0 && (
            <Card className="border-kivo-200 bg-white/60">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-kivo-400">No completed reminders yet.</p>
              </CardContent>
            </Card>
          )}
        </Section>
      </motion.div>
    </DashboardShell>
  );
}

function Section({
  title,
  count,
  children,
  muted,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-kivo-900 flex items-center gap-2">
          <span className="text-sm text-kivo-500">{title}</span>
          <Badge variant={muted ? 'secondary' : 'default'} className="font-normal text-xs">
            {count}
          </Badge>
        </h2>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReminderRow({ reminder }: { reminder: Reminder }) {  const [snoozed, setSnoozed] = useState(false);
  const due = parseISO(reminder.dueAt);
              
  const status = snoozed ? 'snoozed' : reminder.status;
  const style = STATUS_LABELS[status] ?? STATUS_LABELS.open;

  return (
    <Card
      className={cn(
        'border-kivo-200 bg-white transition-all',
        status === 'completed' && 'opacity-60',
        status === 'snoozed' && 'border-kivo-200/60'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'text-sm font-medium',
                  status === 'completed'
                    ? 'text-kivo-400 line-through'
                    : 'text-kivo-900'
                )}
              >
                {reminder.title}
              </span>
              <Badge variant={style.badge} className="font-normal text-xs">
                {style.label}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-kivo-500 truncate">
              Because of: {reminder.becauseOf}
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-kivo-500">
              <Clock className="h-3.5 w-3.5" />
              <span className={cn(isPast(due) && status !== 'completed' ? 'text-red-600 font-medium' : '')}>
                {status === 'completed'
                  ? `Completed ${format(due, 'd MMMM yyyy')}`
                  : status === 'snoozed'
                    ? `Snoozed to ${format(addDays(due, 7), 'd MMMM yyyy')}`
                    : formatDistance(due)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {status === 'open' && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                onClick={() => {}}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {status === 'open' && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-kivo-500 hover:bg-kivo-100"
                onClick={() => setSnoozed(true)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            {status === 'completed' && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-kivo-400 hover:bg-kivo-100"
                onClick={() => {}}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDistance(d: Date) {
  const diff = d.getTime() - Date.now();
  if (diff < 0) return 'Overdue';
  if (diff < 86400000) return `Due today ${format(d, "'today at' h:mm a")}`;
  if (diff < 2 * 86400000) return `Tomorrow ${format(d, "'at' h:mm a")}`;
  return `Due ${format(d, 'd MMMM yyyy')}`;
}
