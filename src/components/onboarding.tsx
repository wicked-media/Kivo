import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Upload,
  Banknote,
  FileText,
  Calendar,
  Zap,
  AlertTriangle,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

// unused import removed

type SourceKind = 'email' | 'documents' | 'banks' | 'calendar';

interface ConnectOption {
  kind: SourceKind;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  primary: boolean;
}

const sourceOptions: ConnectOption[] = [
  {
    kind: 'email',
    label: 'Email',
    description: 'Let Kivo read the bills, renewals and notices buried in your inbox.',
    icon: Mail,
    primary: true,
  },
  {
    kind: 'documents',
    label: 'Documents',
    description: 'Upload receipts, insurance papers, registrations and warranties.',
    icon: FileText,
    primary: false,
  },
  {
    kind: 'banks',
    label: 'Bank accounts',
    description: 'See subscriptions and price changes without reading every transaction.',
    icon: Banknote,
    primary: false,
  },
  {
    kind: 'calendar',
    label: 'Calendar',
    description: 'Surface appointments, renewals and deadlines from your calendar.',
    icon: Calendar,
    primary: false,
  },
];

export function OnboardingView({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState<'connect' | 'scan' | 'done'>('connect');
  const [selected, setSelected] = useState<SourceKind[]>([]);
  const [pasted, setPasted] = useState('');
  const [scanning, setScanning] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  const toggleSource = (kind: SourceKind) => {
    setSelected(prev =>
      prev.includes(kind)
        ? prev.filter(k => k !== kind)
        : [...prev, kind]
    );
  };

  void stats;


  const isSelected = (kind: SourceKind) => selected.includes(kind);

  const handleStartScan = async () => {
    setScanning(true);
    setSummary(null);
    setStats(null);
    // Simulate the first scan. In the real app this hits Kivo's ingestion
    // pipeline (paste + upload + connected sources).
    await new Promise(resolve => setTimeout(resolve, 1800));

    setStats({
      subscriptions: 12,
      bills: 8,
      warranties: 3,
      appointments: 4,
      priceIncreases: 2,
      attention: 1,
    });
    setSummary(
      "Kivo found 12 subscriptions across your life, 8 upcoming bills, and a couple of price changes worth a closer look. One thing needs your attention right now — your electricity rate climbed 22%."
    );
    setScanning(false);
    setStep('done');
    setTimeout(onComplete, 600);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-kivo-200 bg-white/70 px-3 py-1 text-xs font-medium text-kivo-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Let Kivo handle it
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
            Connect your world
          </h1>
          <p className="mt-3 text-base text-kivo-600">
            Life has enough admin. Pick the places Kivo should start watching.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {sourceOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <Card
                key={opt.kind}
                className={cn(
                  'cursor-pointer border-2 transition-all',
                  isSelected(opt.kind)
                    ? 'border-kivo-500 bg-kivo-50'
                    : 'border-kivo-200 bg-white hover:border-kivo-300'
                )}
                onClick={() => selected.length < 4 && toggleSource(opt.kind)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'mt-0.5 rounded-full bg-kivo-100 p-2.5',
                        isSelected(opt.kind) ? 'bg-kivo-500 text-white' : ''
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isSelected(opt.kind) ? 'text-white' : 'text-kivo-600'
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{opt.label}</CardTitle>
                        {isSelected(opt.kind) && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1 text-sm">
                        {opt.description}
                      </CardDescription>
                    </div>
                    {opt.primary && (
                      <Badge variant="secondary" className="font-normal">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleStartScan}
            disabled={selected.length === 0 || scanning}
            className="gap-2"
          >
            {scanning ? (
              <>
                <KivoSpinner />
                Kivo is organising your life…
              </>
            ) : (
              <>
                Kivo, sort out my life
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Paste fallback */}
        <div className="mt-8 rounded-xl border border-kivo-200 bg-kivo-50 p-4">
          <div className="flex items-start gap-3">
            <Upload className="mt-0.5 h-5 w-5 text-kivo-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-kivo-900">
                Or paste something directly
              </p>
              <p className="mt-1 text-sm text-kivo-600">
                Paste a bill, receipt, email or notice — Kivo will read it and
                turn it into an action.
              </p>
              <div className="mt-3">
                <Textarea
                  placeholder="Paste the text of a bill, email, receipt or notice here..."
                  value={pasted}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPasted(e.target.value)}
                  className="h-24 resize-y"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scan results */}
      {step === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <Card className="border-kivo-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-kivo-500" />
                You're all caught up
              </CardTitle>
              <CardDescription>
                {summary}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatItem
                  label="Subscriptions"
                  value={stats?.subscriptions ?? 0}
                  icon={Banknote}
                />
                <StatItem
                  label="Upcoming bills"
                  value={stats?.bills ?? 0}
                  icon={Zap}
                />
                <StatItem
                  label="Warranties"
                  value={stats?.warranties ?? 0}
                  icon={FileText}
                />
                <StatItem
                  label="Appointments"
                  value={stats?.appointments ?? 0}
                  icon={Calendar}
                />
                <StatItem
                  label="Price increases"
                  value={stats?.priceIncreases ?? 0}
                  icon={AlertTriangle}
                  highlight
                />
                <StatItem
                  label="Needs attention"
                  value={stats?.attention ?? 0}
                  icon={Sparkles}
                  highlight={stats?.attention !== 0}
                />
              </div>

              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      Your life inbox is ready
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Kivo will keep watching and only interrupt you when
                      something actually needs you.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={onComplete} className="gap-2">
              Continue to your inbox
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatItem({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 bg-white',
        highlight ? 'border-amber-200 bg-amber-50/40' : 'border-kivo-200'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-kivo-600">{label}</span>
        <Icon className={cn('h-4 w-4', highlight ? 'text-amber-600' : 'text-kivo-400')} />
      </div>
      <p className={cn(
        'mt-1 text-2xl font-bold',
        highlight ? 'text-amber-700' : 'text-kivo-900'
      )}>
        {value}
      </p>
    </div>
  );
}

function KivoSpinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-kivo-300 border-t-kivo-600" />
  );
}
