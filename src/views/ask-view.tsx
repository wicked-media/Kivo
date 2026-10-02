import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Loader, AlertTriangle } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

export function AskKivoView() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'kivo'; text: string }[]>([
    {
      role: 'kivo',
      text: 'Good morning. Your life inbox is ready. What do you need handled?',
    },
  ]);
  const [responding, setResponding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    const text = input.trim();
    if (!text || responding) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setResponding(true);

    try {
      const reply = await Promise.resolve(
        "I'm not connected to Kivo's brain yet, but I'm here and ready to help. Try asking me what's due, what you're paying for, or what needs attention."
      ) as string;
      setMessages(prev => [...prev, { role: 'kivo', text: reply }]);


      setMessages(prev => [...prev, { role: 'kivo', text: reply as string }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'kivo',
          text: "I couldn't reach Kivo just now. Try again in a moment.",
        },
      ]);
    } finally {
      setResponding(false);
    }
  };

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-kivo-100 px-3 py-1 text-xs font-medium text-kivo-700 ring-1 ring-kivo-200/60">
            <Sparkles className="h-3.5 w-3.5" />
            Ask Kivo
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
            What do you need handled?
          </h1>
          <p className="mt-3 text-base text-kivo-600">
            Kivo is your life operating layer. Ask it to sort something out,
            and it will tell you what it found and what it can do.
          </p>
        </div>

        <Card className="mt-8 border-kivo-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask Kivo something…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                className="min-h-[110px] resize-none"
                disabled={responding}
              />
              <Button
                variant="default"
                size="icon"
                className="shrink-0 h-[110px] w-14"
                onClick={handleAsk}
                disabled={!input.trim() || responding}
              >
                {responding ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <QuickChip
                label="Sort out my electricity bill"
                onClick={() => setInput('Sort out my electricity bill')}
              />
              <QuickChip
                label="When does my rego expire?"
                onClick={() => setInput('When does my rego expire?')}
              />
              <QuickChip
                label="Cancel anything I'm not using"
                onClick={() => setInput('Cancel anything I am not using')}
              />
              <QuickChip
                label="Find me a better internet plan"
                onClick={() => setInput('Find me a better internet plan')}
              />
              <QuickChip
                label="What do I need to deal with today?"
                onClick={() => setInput('What do I need to deal with today?')}
              />
            </div>

            <div className="mt-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === 'kivo' ? (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-kivo-900 p-2">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="rounded-xl bg-kivo-50 px-4 py-3 text-sm leading-relaxed text-kivo-800">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-xl bg-kivo-700 px-4 py-3 text-sm leading-relaxed text-white">
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {responding && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-kivo-200 p-2">
                    <Loader className="h-3.5 w-3.5 animate-spin text-kivo-600" />
                  </div>
                  <div className="rounded-xl bg-kivo-50 px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </CardContent>
        </Card>

        {/* Trust note */}
        <Card className="mt-6 border-kivo-200 bg-kivo-50/60">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-kivo-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-kivo-900">
                  Nothing happens without your approval
                </p>
                <p className="mt-1 text-sm text-kivo-600">
                  Kivo only acts on your life after you approve it. For anything
                  non-trivial, Kivo will prepare the evidence and ask before
                  doing anything external.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  );
}

function QuickChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border border-kivo-200 bg-white px-3 py-1.5 text-xs font-medium text-kivo-700 transition-colors hover:border-kivo-300 hover:bg-kivo-50'
      )}
    >
      {label}
    </button>
  );
}
