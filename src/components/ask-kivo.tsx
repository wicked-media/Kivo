import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertTriangle, Sparkles, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

export function AskKivoView({
  inboxSummary,
  onAsk,
}: {
  inboxSummary?: string | null;
  onAsk: (message: string) => Promise<string>;
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'kivo'; text: string }[]
  >([]);
  const [responding, setResponding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || responding) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setResponding(true);

    try {
      const reply = await onAsk(text);
      setMessages(prev => [...prev, { role: 'kivo', text: reply }]);
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
            Kivo is your life operating layer, not a chat room. Ask it to sort
            something out, and it will tell you what it found and what it can do.
          </p>
        </div>

        {/* Context strip */}
        {inboxSummary && (
          <Card className="mt-8 border-kivo-200 bg-kivo-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-kivo-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-kivo-900">
                    Your current life inbox
                  </p>
                  <p className="mt-1 text-sm text-kivo-700">{inboxSummary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 border-kivo-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <QuickCommand
                  label="Sort out my electricity bill"
                  onClick={() => setInput('Sort out my electricity bill')}
                />
                <QuickCommand
                  label="What's due soon?"
                  onClick={() => setInput('What do I need to deal with today?')}
                />
                <QuickCommand
                  label="Cancel anything I'm not using"
                  onClick={() => setInput('Cancel anything I am not using')}
                />
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask Kivo something..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[100px] resize-none"
                  disabled={responding}
                />
                <Button
                  variant="default"
                  size="icon"
                  className="shrink-0 h-[100px] w-12"
                  onClick={handleSend}
                  disabled={!input.trim() || responding}
                >
                  {responding ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {responding && (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function MessageBubble({ message }: { message: { role: 'user' | 'kivo'; text: string } }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'rounded-xl px-4 py-3 text-sm leading-relaxed',
        isUser
          ? 'ml-8 bg-kivo-700 text-white self-end'
          : 'bg-kivo-50 text-kivo-800 self-start'
      )}
    >
      {message.text}
    </div>
  );
}

function QuickCommand({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg border border-kivo-200 bg-white px-3 py-1.5 text-xs font-medium text-kivo-700 transition-colors hover:border-kivo-300 hover:bg-kivo-50'
      )}
    >
      {label}
    </button>
  );
}
