import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Sparkles,
  Check,
  Home,
  Car,
  Shield,
  File,
  HelpCircle,
  Paperclip,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}
import { format, parseISO } from 'date-fns';

const MOCK_DOCS = [
  {
    id: '1',
    title: 'Toyota RAV4 — Registration Renewal Notice',
    category: 'vehicle',
    subtype: 'registration',
    status: 'ready',
    storageKey: 'docs/reg-rav4-2026.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 284_621,
    linkedObjectType: 'rego',
    expiresOn: '2026-12-12',
    entities: ['Toyota RAV4', 'Vicroads'],
    keyFacts: [
      'Registration renewed until 12 Dec 2026',
      'Rego number: ABC 123',
      'Compulsory third party included',
    ],
  },
  {
    id: '2',
    title: 'QBE Home Insurance Renewal Quote',
    category: 'insurance',
    subtype: 'home',
    status: 'ready',
    storageKey: 'docs/qbe-home-2026.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 512_330,
    linkedObjectType: 'home-insurance',
    money: 512,
    expiresOn: '2027-02-01',
    entities: ['QBE', '14 Maple Street'],
    keyFacts: [
      'Sum insured: $875,000',
      'Premium increased 25% vs last year',
      'Replacement cost cover selected',
    ],
    note: 'Premium increased substantially — Kivo flagged this as worth reviewing.',
  },
  {
    id: '3',
    title: 'Washing Machine Purchase Receipt',
    category: 'appliance',
    subtype: 'warranty',
    status: 'ready',
    storageKey: 'docs/lg-wm-receipt.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 921_400,
    linkedObjectType: 'lg-washing-machine',
    money: 1349,
    purchasedOn: '2025-03-18',
    expiresOn: '2027-03-18',
    entities: ['LG Washing Machine', 'Best Buy'],
    keyFacts: [
      'Purchased 18 March 2025',
      'Price: $1,349',
      'Warranty expires 18 March 2027',
    ],
  },
  {
    id: '4',
    title: 'School Excursion Permission Form — Year 6',
    category: 'school',
    subtype: 'permission',
    status: 'pending_review',
    storageKey: 'docs/school-perm-2026.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 142_000,
    entities: ['St Mary’s Primary', 'Year 6 Camp'],
    keyFacts: [
      'Year 6 camp next month',
      'Permission required',
      'Medical info attached',
    ],
    note: 'This form needs signing and returning.',
  },
  {
    id: '5',
    title: 'House Gas Bill — September 2026',
    category: 'bill',
    subtype: 'gas',
    status: 'ready',
    storageKey: 'docs/gas-sep-2026.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 118_200,
    money: 92,
    entities: ['Origin Energy'],
    keyFacts: ['Usage: 542 MJ', 'Supply charge: $31.20', 'Total due: $92.00'],
  },
  {
    id: '6',
    title: 'Ford Territory — Service Invoice',
    category: 'vehicle',
    subtype: 'service',
    status: 'ready',
    storageKey: 'docs/ford-service-2025.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 380_100,
    entities: ['Ford Territory', 'Ford Dealer'],
    keyFacts: [
      'Service date: 22 Jan 2025',
      'Mileage: 138,420 km',
      'Next service around 149,000 km',
    ],
  },
];

const CATEGORY_LABELS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  vehicle: { icon: Car, color: 'text-kivo-600' },
  insurance: { icon: Shield, color: 'text-kivo-700' },
  appliance: { icon: Home, color: 'text-emerald-600' },
  school: { icon: FileText, color: 'text-indigo-600' },
  bill: { icon: File, color: 'text-amber-600' },
};

type Doc = (typeof MOCK_DOCS)[number];

export function DocumentsView() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [uploading, setUploading] = useState(false);
  const filtered = MOCK_DOCS.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.subtype.toLowerCase().includes(q) ||
      d.entities.some(e => e.toLowerCase().includes(q))
    );
  });

  const handleUpload = async () => {
    if (!uploadLabel.trim() || !uploadText.trim()) return;
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setUploadText('');
      setUploadLabel('');
    } finally {
      setUploading(false);
    }
  };

  void uploaded;

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kivo-900">Documents</h1>
          <p className="mt-1 text-sm text-kivo-600">
            Kivo understands your documents, not just stores them.
          </p>
        </div>

        {/* Upload row */}
        <Card className="mb-6 border-dashed border-2 border-kivo-200 bg-kivo-50/60">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs text-kivo-500">New document</Label>
                <Input
                  placeholder="e.g. Toyota rego renewal"
                  value={uploadLabel}
                  onChange={e => setUploadLabel(e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('doc-drop')?.click()}
              >
                Upload file
              </Button>
              <input
                id="doc-drop"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.heic,.docx,.txt"
                className="hidden"
              />
              <Button size="sm" disabled={uploading} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {uploading ? 'Understanding…' : 'Understand this'}
              </Button>
            </div>
            <Textarea
              placeholder="Paste the document text if Kivo can read it directly..."
              value={uploadText}
              onChange={e => setUploadText(e.target.value)}
              className="mt-3 h-24 resize-y text-sm"
            />
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kivo-400" />
          <Input
            placeholder="Search by title, category, entity or warranty date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {filtered.map(doc => {
              const cat = CATEGORY_LABELS[doc.category] ?? { icon: FileText, color: 'text-kivo-600' };
              const Icon = cat.icon;
              return (
                <Card
                  key={doc.id}
                  className={cn(
                    'cursor-pointer border-kivo-200 bg-white transition-all',
                    expandedId === doc.id && 'border-kivo-500 ring-1 ring-kivo-500/30',
                    doc.status === 'pending_review' && 'border-amber-200 bg-amber-50/30'
                  )}
                  onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className={cn('mt-0.5 rounded-lg bg-kivo-100 p-2.5')}>
                          <Icon className={cn('h-5 w-5', cat.color)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-medium text-kivo-900 truncate">
                              {doc.title}
                            </span>
                            {doc.status === 'ready' && (
                              <Badge variant="success" className="font-normal text-xs">
                                <Check className="mr-1 h-3 w-3" />
                                Understood
                              </Badge>
                            )}
                            {doc.status === 'pending_review' && (
                              <Badge variant="warning" className="font-normal text-xs">
                                <HelpCircle className="mr-1 h-3 w-3" />
                                Needs review
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-kivo-600">
                            {doc.category} · {doc.subtype}
                          </p>
                          {doc.note && (
                            <p className="mt-1 text-xs text-kivo-600">{doc.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {doc.money != null && (
                          <span className="text-base font-semibold text-kivo-900">
                            ${doc.money.toLocaleString()}
                          </span>
                        )}
                        {doc.expiresOn && (
                          <span className="text-xs text-kivo-500">
                            Expires {format(parseISO(doc.expiresOn), 'd MMMM yyyy')}
                          </span>
                        )}
                        {doc.purchasedOn && (
                          <span className="text-xs text-kivo-500">
                            Bought {format(parseISO(doc.purchasedOn), 'd MMMM yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <Card className="border-kivo-200 bg-white">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-kivo-500">No documents match.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detail */}
          <div className="space-y-4">
            {expandedId ? (
              <DocDetail doc={MOCK_DOCS.find(d => d.id === expandedId)} />
            ) : (
              <Card className="border-kivo-200 bg-white">
                <CardContent className="p-4">
                  <p className="text-sm text-kivo-500">
                    Select a document to see what Kivo understood.
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

function DocDetail({ doc }: { doc: Doc | undefined }) {
  if (!doc) return null;
  const cat = CATEGORY_LABELS[doc.category] ?? { icon: FileText, color: 'text-kivo-600' };
  const Icon = cat.icon;

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
              <div className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', cat.color)} />
                <CardTitle className="text-base">{doc.category}</CardTitle>
              </div>
              <CardDescription>{doc.subtype}</CardDescription>
            </div>
            <Badge variant="secondary" className="font-normal text-xs">
              {formatSize(doc.sizeBytes)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-kivo-200 bg-kivo-50/60 p-3">
            <p className="text-xs text-kivo-500">What Kivo understood</p>
            <ul className="mt-2 space-y-1.5">
              {doc.keyFacts.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-kivo-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {doc.entities.length > 0 && (
            <div>
              <p className="text-xs text-kivo-500">Entities</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {doc.entities.map(e => (
                  <Badge key={e} variant="secondary" className="font-normal text-xs">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {doc.linkedObjectType && (
            <div>
              <p className="text-xs text-kivo-500">Linked life object</p>
              <p className="mt-0.5 text-sm font-medium text-kivo-900">
                {doc.linkedObjectType}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 gap-2">
              <Paperclip className="h-3.5 w-3.5" />
              View file
            </Button>
            {doc.status === 'pending_review' && (
              <Button size="sm" variant="outline" className="flex-1">
                Mark reviewed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function formatSize(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}
