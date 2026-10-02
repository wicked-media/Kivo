import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Zap,
  Shield,
  House,
  Mail,
  Banknote,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

const AUTONOMY_LEVELS = [
  {
    value: 'observe',
    label: 'Level 0 — Observe',
    description: 'Kivo watches and organises. Nothing is done without you.',
    icon: Eye,
    color: 'text-kivo-600',
  },
  {
    value: 'recommend',
    label: 'Level 1 — Recommend',
    description: 'Kivo tells you what should happen and why.',
    icon: Lightbulb,
    color: 'text-amber-600',
  },
  {
    value: 'prepare',
    label: 'Level 2 — Prepare',
    description: 'Kivo fills forms, prepares emails, compares products and gets things ready for you.',
    icon: FileText,
    color: 'text-indigo-600',
  },
  {
    value: 'approve',
    label: 'Level 3 — Approve & Act',
    description: 'Kivo asks "ready to proceed?" then executes with your approval.',
    icon: CheckCircle,
    color: 'text-emerald-600',
  },
  {
    value: 'autopilot',
    label: 'Level 4 — Autopilot',
    description: 'Only for explicitly permitted low-risk actions, like paying small bills under a limit you set.',
    icon: Rocket,
    color: 'text-kivo-700',
  },
] as const;

const SOURCE_STATUS: Record<string, { label: string; badge: string }> = {
  gmail: { label: 'Gmail', badge: 'success' },
  outlook: { label: 'Outlook', badge: 'success' },
  icloud: { label: 'iCloud Mail', badge: 'secondary' },
  connected: { label: 'Connected', badge: 'success' },
  disconnected: { label: 'Not connected', badge: 'secondary' },
  not_configured: { label: 'Not configured', badge: 'destructive' },
};

type SourceRow = {
  id: string;
  name: string;
  status: keyof typeof SOURCE_STATUS;
  note?: string;
};

const CONNECTED_SOURCES: SourceRow[] = [
  { id: 'gmail', name: 'Gmail', status: 'disconnected', note: 'Connect to let Kivo watch for bills, renewals and notices.' },
  { id: 'outlook', name: 'Outlook', status: 'disconnected', note: 'Connect to let Kivo watch for bills, renewals and notices.' },
  { id: 'icloud', name: 'iCloud Mail', status: 'disconnected', note: 'Connect to let Kivo watch for bills, renewals and notices.' },
  { id: 'banks', name: 'Bank accounts', status: 'not_configured', note: 'Open-banking / CDR integration coming later.' },
  { id: 'calendar', name: 'Calendar', status: 'disconnected', note: 'Connect to surface appointments and deadlines.' },
];

export function SettingsView() {
  const [selectedAutonomy, setSelectedAutonomy] = useState('recommend');

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kivo-900">Settings</h1>
          <p className="mt-1 text-sm text-kivo-600">
            How Kivo is allowed to help you.
          </p>
        </div>

        {/* Autonomy */}
        <Card className="mb-6 border-kivo-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-kivo-500" />
              <CardTitle>Autonomy level</CardTitle>
            </div>
            <CardDescription>
              Choose how much authority Kivo has over your life.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {AUTONOMY_LEVELS.map(level => {
              const Icon = level.icon;
              const active = selectedAutonomy === level.value;
              return (
                <button
                  key={level.value}
                  onClick={() => setSelectedAutonomy(level.value)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-colors',
                    active
                      ? 'border-kivo-500 bg-kivo-50 shadow-sm'
                      : 'border-kivo-200 bg-white hover:border-kivo-300'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'mt-0.5 rounded-lg bg-kivo-100 p-2',
                        active && 'bg-kivo-500 text-white'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', active ? 'text-white' : level.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-kivo-900">
                          {level.label}
                        </span>
                        {active && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-kivo-600">
                        {level.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Connected sources */}
        <Card className="mb-6 border-kivo-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-kivo-500" />
              <CardTitle>Connected sources</CardTitle>
            </div>
            <CardDescription>
              The places Kivo watches for life-admin events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {CONNECTED_SOURCES.map(source => {
              const style = SOURCE_STATUS[source.status];
              return (
                <div
                  key={source.id}
                  className="rounded-lg border border-kivo-200 bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-kivo-900">
                          {source.name}
                        </span>
                        <Badge variant={style?.badge ?? 'secondary'} className="font-normal text-xs">
                          {style?.label ?? source.status}
                        </Badge>
                      </div>
                      {source.note && (
                        <p className="mt-1 text-xs text-kivo-500">{source.note}</p>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      {source.status === 'not_configured' ? 'Coming soon' : 'Connect'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Household */}
        <Card className="mb-6 border-kivo-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <House className="h-5 w-5 text-kivo-500" />
              <CardTitle>Household</CardTitle>
            </div>
            <CardDescription>
              Your household is the unit Kivo organises around.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-kivo-200 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-kivo-900">Your household</p>
                <p className="text-xs text-kivo-500">Aaron’s household</p>
              </div>
              <Badge variant="secondary">Owner</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-kivo-200 bg-white p-3 opacity-60">
              <div>
                <p className="text-sm font-medium text-kivo-900">Partner</p>
                <p className="text-xs text-kivo-500">Not yet added</p>
              </div>
              <Button size="sm" variant="outline" disabled>
                Add
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-kivo-200 bg-white p-3 opacity-60">
              <div>
                <p className="text-sm font-medium text-kivo-900">Children</p>
                <p className="text-xs text-kivo-500">Not yet added</p>
              </div>
              <Button size="sm" variant="outline" disabled>
                Add
              </Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                Invite partner
              </Button>
              <Button size="sm" disabled className="flex-1">
                Invite child
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-kivo-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-kivo-500" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>
              Your profile and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-kivo-200 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-kivo-900">Email</p>
                <p className="text-xs text-kivo-500">you@domain.com</p>
              </div>
              <Button size="sm" variant="outline">
                Sign out
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-kivo-200 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-kivo-900">Plan</p>
                <p className="text-xs text-kivo-500">Kivo+ · $19.99/month</p>
              </div>
              <Badge variant="secondary">Current</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-kivo-200 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-kivo-900">Data portability</p>
                <p className="text-xs text-kivo-500">Export or delete your Kivo data anytime.</p>
              </div>
              <Button size="sm" variant="outline">
                Export data
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Lightbulb({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Rocket({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84 1.66-1.53 2.7-1.95" />
      <path d="M6 20h12" />
      <path d="M12 18v4" />
      <path d="M8 13l-1 3" />
      <path d="M16 13l1 3" />
      <path d="M10 17h4" />
    </svg>
  );
}
