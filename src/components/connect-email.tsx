import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Upload, FileText, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function ConnectEmailView({
  onIngest,
}: {
  onIngest?: (source: string, text: string, suggestedType?: string) => Promise<void>;
}) {
  const [tab, setTab] = useState<'paste' | 'upload'>('paste');
  const [sourceLabel, setSourceLabel] = useState('Gmail');
  const [text, setText] = useState('');
  const [suggestedType, setSuggestedType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const SOURCE_OPTIONS = [
    'Gmail',
    'Outlook',
    'iCloud Mail',
    'Fastmail',
    'Proton',
    'Other inbox or forwarded email',
  ];

  const TYPE_HINTS = [
    { label: 'Bill', value: 'bill' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Receipt', value: 'receipt' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'Registration', value: 'registration' },
    { label: 'Appointment', value: 'appointment' },
    { label: 'Renewal', value: 'renewal' },
    { label: 'Not sure', value: 'unknown' },
  ];

  const handlePasteSubmit = async () => {
    if (!text.trim() || !sourceLabel.trim()) return;
    setSubmitting(true);
    try {
      await onIngest?.(sourceLabel, text.trim(), suggestedType || undefined);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSubmit = async () => {
    if (!files.length || !sourceLabel.trim()) return;
    setSubmitting(true);
    try {
      // In the real app, files upload to storage, then the backend calls
      // the document understanding endpoint. For the MVP UI we mirror the
      // paste flow: a doc snippet is not available client-side yet, so this
      // path is wired but the deep doc parse comes next.
      await Promise.all(
        files.map(f =>
          onIngest?.(`${sourceLabel} attachment: ${f.name}`, `[${f.name}] uploaded.`, 'document')
        )
      );
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-kivo-100 px-3 py-1 text-xs font-medium text-kivo-700 ring-1 ring-kivo-200/60">
            <Mail className="h-3.5 w-3.5" />
            Connect email
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
            Bring your inbox into Kivo
          </h1>
          <p className="mt-3 text-base text-kivo-600">
            You can paste a message right now, or we will connect your inbox
            with a one-click OAuth flow.
          </p>
        </div>

        {/* Source picker */}
        <Card className="mt-8 border-kivo-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-kivo-900">
              Which inbox are you connecting?
            </Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOURCE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSourceLabel(opt)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    sourceLabel === opt
                      ? 'border-kivo-500 bg-kivo-50 text-kivo-900'
                      : 'border-kivo-200 bg-white text-kivo-700 hover:border-kivo-300'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mt-6 flex gap-4 border-b border-kivo-200 pb-3">
          <button
            onClick={() => setTab('paste')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              tab === 'paste'
                ? 'bg-kivo-100 text-kivo-900'
                : 'text-kivo-600 hover:bg-kivo-50'
            )}
          >
            Paste a message
          </button>
          <button
            onClick={() => setTab('upload')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              tab === 'upload'
                ? 'bg-kivo-100 text-kivo-900'
                : 'text-kivo-600 hover:bg-kivo-50'
            )}
          >
            Upload a document
          </button>
        </div>

        {/* Paste tab */}
        {tab === 'paste' && (
          <Card className="mt-6 border-kivo-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Paste the message</CardTitle>
              <CardDescription>
                Paste an email, notice, bill or any life-admin message and Kivo
                will turn it into a structured action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Message</Label>
                <Textarea
                  className="mt-1.5 h-40 resize-y"
                  value={text}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                  placeholder="Paste the full message here..."
                />
              </div>

              <div>
                <Label>What kind of thing is this?</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {TYPE_HINTS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSuggestedType(opt.value)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-sm transition-colors',
                        suggestedType === opt.value
                          ? 'border-kivo-500 bg-kivo-50 text-kivo-900'
                          : 'border-kivo-200 bg-white text-kivo-700 hover:border-kivo-300'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handlePasteSubmit}
                  disabled={
                    submitting ||
                    !text.trim() ||
                    !sourceLabel.trim()
                  }
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Kivo is reading this…
                    </>
                  ) : submitted ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added to your Life Inbox
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Let Kivo understand this
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <Card className="mt-6 border-kivo-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload a document</CardTitle>
              <CardDescription>
                Receipts, insurance renewal notices, registrations, warranties —
                Kivo will understand what they mean, not just store them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-kivo-300 p-8 transition-colors hover:border-kivo-400',
                  files.length > 0 && 'border-kivo-500 bg-kivo-50'
                )}
                onClick={() => document.getElementById('doc-upload')?.click()}
              >
                <Upload className="h-8 w-8 text-kivo-400" />
                <p className="text-sm text-kivo-700">
                  Drop a file here or click to upload
                </p>
                <p className="text-xs text-kivo-500">
                  PDF, images and documents
                </p>
              </div>
              <input
                id="doc-upload"
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.heic,.docx,.txt"
                onChange={e => {
                  const els = e.target.files;
                  if (!els) return;
                  setFiles(Array.from(els));
                }}
              />

              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map(f => (
                    <Badge key={f.name} variant="secondary" className="font-normal">
                      <FileText className="mr-1 h-3.5 w-3.5" />
                      {f.name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleFileSubmit}
                  disabled={
                    submitting ||
                    !files.length ||
                    !sourceLabel.trim()
                  }
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Kivo is reading this…
                    </>
                  ) : submitted ? (
                    <>
                      <Check className="h-4 w-4" />
                      Document saved
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Understand this document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Inbox connector note */}
      <Card className="mt-8 border-kivo-200 bg-kivo-50/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-kivo-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-kivo-900">
                Connect your inbox properly
              </p>
              <p className="mt-1 text-sm text-kivo-600">
                Once you connect Gmail or Outlook with one-click OAuth, Kivo
                keeps watching for new bills, renewals and notices without you
                needing to paste anything.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
