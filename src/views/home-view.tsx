import { motion } from 'framer-motion';
import {
  Zap,
  Inbox,
  Banknote,
  FileText,
  Home,
  Car,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { KivoHero } from '@/components/kivo-hero';
import { KivoFooter } from '@/components/kivo-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Inbox,
    title: 'Life Inbox',
    description:
      'Your email becomes a short list of things that actually matter — bills, renewals, receipts and permissions, not a thousand unread threads.',
  },
  {
    icon: Banknote,
    title: 'Kivo Money',
    description:
      'Subscriptions, price increases, duplicate services and recurring charges — surfaced with a rough annual saving figure so the value is obvious early.',
  },
  {
    icon: FileText,
    title: 'Kivo Documents',
    description:
      'A secure vault that understands what it stores: vehicles, houses, policies, warranties. Search “when did we buy the washing machine?” and get the receipt.',
  },
  {
    icon: Zap,
    title: 'Kivo Bills',
    description:
      'Electricity, gas, internet, mobile, insurance, council rates, water, loans. Kivo extracts provider, cost, due date and price movement, then flags increases.',
  },
  {
    icon: Home,
    title: 'Kivo Home',
    description:
      'A digital inventory of your house and appliances, with warranty and repair tracking that can nudge you before something expires or fails.',
  },
  {
    icon: Car,
    title: 'Kivo Vehicles',
    description:
      'One profile per vehicle: registration, insurance, service records, tyres, repairs and receipts. Kivo says when rego, service or insurance renewal is due.',
  },
  {
    icon: Users,
    title: 'Kivo Family',
    description:
      'A household operating system: partner, kids, pets, vehicles, house, appointments and activities — with shared responsibilities assigned to real people.',
  },
  {
    icon: Shield,
    title: 'Kivo Guard',
    description:
      'A financial and admin watchdog, not a cybersecurity tool: duplicate charges, restarted subscriptions, changed bank details and suspicious renewals.',
  },
];

const MODULES = [
  {
    name: 'Kivo Money',
    oneLiner: 'Find out what you are paying for — and what you can save.',
  },
  {
    name: 'Kivo Bills',
    oneLiner: 'Your bills, organised and watched for increases.',
  },
  {
    name: 'Kivo Documents',
    oneLiner: 'Secure, searchable, understood.',
  },
  {
    name: 'Kivo Home',
    oneLiner: 'Your house on record, not in your head.',
  },
  {
    name: 'Kivo Vehicles',
    oneLiner: 'Registration, insurance, service history in one place.',
  },
  {
    name: 'Kivo Family',
    oneLiner: 'Household admin with the right person responsible.',
  },
  {
    name: 'Kivo Guard',
    oneLiner: 'A watchdog for suspicious life-admin events.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Observe',
    description:
      'Kivo watches connected sources and turns noise into structured Life Objects — bills, renewals, receipts, appointments, subscriptions.',
  },
  {
    n: '02',
    title: 'Understand',
    description:
      'Every object is parsed and linked into your Life Graph, so Kivo knows what a thing is, not just what it says.',
  },
  {
    n: '03',
    title: 'Recommend',
    description:
      'Kivo compares options, highlights price increases and tells you what should happen next.',
  },
  {
    n: '04',
    title: 'Approve & Act',
    description:
      'Nothing happens without your approval for anything non-trivial. Kivo asks, you decide, then Kivo does it.',
  },
  {
    n: '05',
    title: 'Verify',
    description:
      'Kivo proves the outcome, not just the attempt — the new plan is active, the payment cleared, the document is filed.',
  },
  {
    n: '06',
    title: 'Learn',
    description:
      'The household’s approved preferences are remembered, so future decisions get smarter and faster.',
  },
];

const PLANS = [
  {
    name: 'Kivo Free',
    price: '$0',
    period: ' forever',
    description: 'Life Inbox, basic reminders and limited AI.',
    highlight: false,
    list: [
      'Life Inbox',
      'Basic reminders',
      'Limited AI',
      'Document upload',
    ],
  },
  {
    name: 'Kivo+',
    price: '$19.99',
    period: '/month',
    description: 'Full AI plus bills, subscriptions, documents, household and vehicles.',
    highlight: true,
    list: [
      'Full AI',
      'Bills & subscriptions',
      'Documents & vault',
      'Household & vehicles',
      'Unlimited Kivo actions',
    ],
  },
  {
    name: 'Kivo Family',
    price: '$29.99',
    period: '/month',
    description: 'Everything in Kivo+ for a whole household.',
    highlight: false,
    list: [
      'Everything in Kivo+',
      'Multiple adults',
      'Children',
      'Shared household',
      'Shared documents',
      'Responsibilities',
    ],
  },
];

export function HomeView() {
  return (
    <div className="relative bg-kivo-50">
      <KivoHero />

      {/* Trust strip */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-kivo-200 bg-white/70 py-8 ring-1 ring-kivo-100/60 backdrop-blur"
        >
          <p className="text-center text-sm font-medium text-kivo-600">
            Built for the kind of life admin most people keep in twelve different
            places
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-kivo-500">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Email
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Bills
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Subscriptions
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Documents
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Reminders
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Household
            </span>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative bg-kivo-950 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-kivo-300 uppercase tracking-widest">
              Not a chatbot. An operating layer.
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Observe → Understand → Recommend → Do → Verify
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-kivo-300 text-lg">
              Most AI stops at “I clicked the button.” Kivo proves the intended
              outcome actually happened, then remembers what your household
              prefers next time.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="relative"
              >
                <div className="rounded-xl border border-kivo-700/60 bg-kivo-900/60 p-6 backdrop-blur">
                  <span className="text-5xl font-bold text-kivo-400/40">
                    {step.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-kivo-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-kivo-600 uppercase tracking-widest">
              Modules
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
              One product, many parts of life
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-kivo-600 text-lg">
              Kivo starts with the Life Inbox and expands into money, bills,
              documents, home, vehicles, family and guard. Each module makes the
              whole product smarter.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(module => (
              <Card key={module.name} className="overflow-hidden border-kivo-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-kivo-900">
                    {module.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-kivo-600">
                    {module.oneLiner}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative bg-kivo-100/40 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-kivo-600 uppercase tracking-widest">
              What Kivo does
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
              From noise to the few things that matter
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(feature => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="overflow-hidden border-kivo-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kivo-100">
                      <Icon className="h-5 w-5 text-kivo-700" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-kivo-900">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-kivo-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="get-started"
        className="relative bg-kivo-50 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-kivo-600 uppercase tracking-widest">
              Plans
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
              Three plans. Start small, expand when it matters.
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-kivo-600 text-lg">
              Free gets you the Life Inbox. Kivo+ is where the value starts to
              compound. Kivo Family is for households that want one shared view.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PLANS.map(plan => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
              >
                <Card
                  className={plan.highlight ? 'border-kivo-500 shadow-md ring-1 ring-kivo-500/30' : 'border-kivo-200 bg-white shadow-sm'}
                >
                  {plan.highlight && (
                    <div className="flex items-center gap-1.5 rounded-full bg-kivo-100 px-3 py-1 text-xs font-medium text-kivo-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most popular
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-4xl font-bold text-kivo-900">
                        {plan.price}
                      </span>
                      <span className="text-sm text-kivo-500">{plan.period}</span>
                    </div>
                    <p className="mt-3 text-sm text-kivo-600">{plan.description}</p>
                    <ul className="mt-6 space-y-3">
                      {plan.list.map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-kivo-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.highlight ? 'default' : 'outline'}
                      className="mt-6 w-full"
                      size="lg"
                      asChild
                    >
                      <a href="/auth?returnTo=/dashboard">
                        {plan.highlight ? 'Get Kivo+' : 'Current plan'}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-kivo-500">
            Eventually Kivo Concierge becomes available for complex administrative
            work at a significantly higher price.
          </p>
        </div>
      </section>

      {/* Brand close */}
      <section className="relative border-t border-kivo-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-medium text-kivo-600 uppercase tracking-widest">
              Positioning
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-kivo-900 sm:text-4xl">
              Kivo
            </h2>
            <p className="mt-4 text-xl text-kivo-700">
              Life, handled.
            </p>
            <p className="mt-3 text-lg text-kivo-600 max-w-xl mx-auto">
              Or: your life. On autopilot.
            </p>
            <p className="mt-6 text-sm text-kivo-500">
              Before spending money branding Kivo, do a proper Australian/global
              trademark, domain and App Store availability search. Do not commit
              to the name until that work is done.
            </p>
          </motion.div>
        </div>
      </section>

      <KivoFooter />
    </div>
  );
}
