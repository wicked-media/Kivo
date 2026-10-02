import { v } from 'convex/values';
import { api, internal } from './_generated/api';

// ------------------------------------------------------------------
// Minimal Anthropic client shared by Convex actions.
// Kept tiny on purpose: keep the model, prompts, and output schemas
// close together so extraction behaviour is easy to tune.
// ------------------------------------------------------------------

async function anthropicText(prompt: string, system?: string) {    const apiKey: string | undefined = (process as any)?.env?.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured in this environment.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      system: system ?? 'You are a precise extraction and reasoning engine for a life-admin assistant called Kivo. Return only the requested structured payload unless explicitly told to explain.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Anthropic error ${response.status}: ${body.slice(0, 500)}`);
  }

  const data = await response.json();
  const parts = data.content ?? [];
  const textPart = parts.find((p: { type?: string }) => p.type === 'text');
  if (!textPart || typeof textPart.text !== 'string') {
    throw new Error('Unexpected Anthropic response shape: no text part found.');
  }
  return textPart.text as string;
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

export const extractLifeObject = (api.action as any).bind(null, {
  args: {
    source: v.string(),
    rawText: v.string(),
    // Help the model focus: e.g. "electricity bill", "rego notice", "subscription price increase"
    suggestedType: v.optional(v.string()),
  },
  handler: async (_ctx: any, { source, rawText, suggestedType }) => {
    const system = `You convert a raw piece of incoming life-admin into one Kivo "life object".

Return ONLY a JSON object with these keys:

- type: one of "bill","subscription","task","document","reminder","price_movement","renewal","appointment","receipt","policy","unknown". Use the category that best matches the underlying obligation, not the channel it arrived through.
- subtype: short stable string for the thing itself, e.g. "electricity", "rego", "netflix", "internet".
- title: 6-12 word human title for the inbox card.
- status: one of "needs_attention","watch","done","snoozed","archived".
- priority: one of "urgent","high","normal","low","info".
- nextAction: optional object describing the single next best thing for the user, or omit if there is no clear action. If present, it has:
    - kind: one of "review","pay","cancel","switch","renew","upload","confirm","ignore","none".
    - status: one of "suggested","pending","approved","in_progress","completed".
    - dueBy: optional ISO timestamp string when this should be resolved, omit if not timebound.
    - chargeUntil: optional ISO timestamp string if the thing is price/time bound, omit otherwise.
- fields: JSON object capturing the extracted structured data for this object (amount, due date, provider, contract length, registration expiry, etc.). Use null for missing values. Keep money amounts as numbers where possible, dates as ISO strings.
- why: one sentence explaining why this object matters in plain English.
- clarifications: array of strings, only include if you genuinely cannot extract something or the text is ambiguous.

Be conservative about cancelling, switching providers, or financial decisions: only recommend those when the evidence in the text strongly supports it. Do not invent amounts, dates, or providers.
`;

    const hint =
      suggestedType && suggestedType !== 'unknown'
        ? `\n\nHint about what this looks like: ${suggestedType}`
        : '';

    const prompt = `You are parsing the following incoming item from: ${source}.

${rawText}${hint}

Return the JSON object described above. Do not include markdown code fences, preamble, or anything after the JSON object.`;

    const raw = await anthropicText(prompt, system);
    const parsed = safeJson(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Anthropic did not return parseable object JSON.');
    }
    return parsed as Record<string, unknown>;
  },
});

export const explainLifeObject = (api.action as any).bind(null, {
  args: {
    object: v.object({
      type: v.string(),
      subtype: v.string(),
      title: v.string(),
      status: v.string(),
      fields: v.record(v.any()),
      nextAction: v.optional(v.any()),
      why: v.optional(v.string()),
    }),
    context: v.optional(v.string()),
  },
  handler: async (_ctx: any, args) => {
    const { object, context } = args;
    const fields = JSON.stringify(object.fields ?? {}, null, 2);

    const prompt = `You are Kivo's explainer. Write a friendly, calm, useful 3-6 sentence explanation for the user.

Object:
- kind: ${object.type} / ${object.subtype}
- title: ${object.title}
- status: ${object.status}
${fields ? `- data:\n${fields}` : ''}
${object.nextAction ? `- next action: ${JSON.stringify(object.nextAction)}` : ''}
${object.why ? `- why it matters: ${object.why}` : ''}
${context ? `- extra context: ${context}` : ''}

Do not scare people. Do not speculate financially beyond what the data supports. State what is known, what is missing, and what the user can do next.`;

    return anthropicText(prompt);
  },
});

export const askKivo = (api.action as any).bind(null, {
  args: {
    message: v.string(),
    inboxSummary: v.optional(v.string()),
    recentObjects: v.optional(v.array(v.string())),
  },
  handler: async (_ctx: any, args) => {
    const { message, inboxSummary, recentObjects } = args;

    const context = [
      inboxSummary ? `Your current life inbox:\n${inboxSummary}` : '',
      recentObjects && recentObjects.length > 0
        ? `Recently surfaced items: ${recentObjects.join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const prompt = `You are Kivo, the life-admin assistant. You are not a chatty AI. You are the operating layer for the user's life.

Style:
- Concise, calm, direct.
- Lead with what needs attention and what Kivo can do.
- Prefer actions over essays.
- If the user seems to want an action, ask one clarifying question and offer 2-3 concrete next steps.
- If you don't have enough context, say what you need and how they can give it to you (email, upload, connect).

Their message:
${message}

${context ? `Current context:\n${context}` : ''}`;

    return anthropicText(prompt);
  },
});

export const comparePlans = (api.action as any).bind(null, {
  args: {
    current: v.record(v.any()),
    candidates: v.array(v.record(v.any())),
    householdRules: v.optional(v.string()),
  },
  handler: async (_ctx: any, args) => {
    const { current, candidates, householdRules } = args;

    const prompt = `You are comparing one current plan against several alternatives for a household.

Current plan:
${JSON.stringify(current, null, 2)}

Alternatives:
${candidates
  .map((c: unknown, i: number) => `Alternative ${i + 1}:\n${JSON.stringify(c, null, 2)}`)
  .join('\n\n')}
${householdRules ? `Household preferences / constraints:\n${householdRules}` : ''}

Return ONLY a JSON object:

{
  "headline": "one short plain-English sentence",
  "savingsPerYear": number or null if you can't compute a defensible figure,
  "whyCheaper": string,
  "risks": ["string", ...],
  "recommended": number (index of alternative, 0-based) or null,
  "requiresHumanReview": boolean
}

Only recommend switching when the math and the household rules support it. If any deal has unclear terms, missing exit costs, or contract penalties, set requiresHumanReview to true and explain in the risks. Do not invent savings.`;

    const raw = await anthropicText(prompt);
    const parsed = safeJson(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Compare plans returned unparseable JSON.');
    }
    return parsed as Record<string, unknown>;
  },
});

export const understandDocument = (api.action as any).bind(null, {
  args: {
    title: v.string(),
    text: v.string(),
    hints: v.optional(v.array(v.string())),
  },
  handler: async (_ctx: any, args) => {
    const { title, text, hints = [] } = args;

    const hintsText = hints.length > 0 ? `\n\nHints about what this might be: ${hints.join(', ')}` : '';

    const prompt = `You are extracting the structured meaning of a personal document for Kivo.

Document title: ${title}${hintsText}

Document text:
${text}

Return ONLY a JSON object:

{
  "category": one of "bill","receipt","insurance","registration","warranty","property","vehicle","school","appointment","identity","financial","medical","legal","manual","record","other",
  "subtype": short string, e.g. "electricity", "rego", "warranty",
  "entities": array of strings naming people, companies, vehicles, properties, or accounts mentioned,
  "date": ISO date string if one is visible, else null,
  "money": number or null,
  "expiresOn": ISO date string if something expires, else null,
  "keyFacts": array of 1-6 short factual strings,
  "linkedObjectType": best matching life-object type for this document, or null
}

Extract conservatively. If you do not have enough information, leave fields null rather than guessing.`;

    const raw = await anthropicText(prompt);
    const parsed = safeJson(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Understand document returned unparseable JSON.');
    }
    return parsed as Record<string, unknown>;
  },
});

export const introSummary = (api.action as any).bind(null, {
  args: {
    objects: v.array(
      v.object({
        type: v.string(),
        subtype: v.string(),
        title: v.string(),
        status: v.string(),
        priority: v.optional(v.string()),
        why: v.optional(v.string()),
      })
    ),
  },
  handler: async (_ctx: any, args) => {
    const { objects } = args;
    const prompt = `Kivo has just organized the user's life inbox for the first time. Summarise what it found in 4-7 short lines the user should see immediately.

Focus on:
- the number of items
- the ones that actually need attention
- one or two concrete wins or risks worth noticing

Group by theme if it helps, but keep it scannable. Do not invent actions or savings.`;

    return anthropicText(prompt);
  },
});

// ------------------------------------------------------------------
// Internal helpers
// ------------------------------------------------------------------

function safeJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fence = trimmed.startsWith('```');
  let candidate = trimmed;
  if (fence) {
    candidate = candidate
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();
  }
  try {
    return JSON.parse(candidate);
  } catch {
    const braceIndex = candidate.indexOf('{');
    const braceCandidate = braceIndex >= 0 ? candidate.slice(braceIndex) : candidate;
    try {
      return JSON.parse(braceCandidate);
    } catch {
      return undefined;
    }
  }
}

// ------------------------------------------------------------------
// Background / internal
// ------------------------------------------------------------------

export const processIncoming = (internal.action as any).bind(null, {
  args: {
    ownerId: v.id('users'),
    householdId: v.optional(v.id('households')),
    source: v.string(),
    rawText: v.string(),
    suggestedType: v.optional(v.string()),
  },
  handler: async (ctx: any, args) => {
    const { ownerId, householdId, source, rawText, suggestedType } = args;

    const extracted = await extractLifeObject({ source, rawText, suggestedType: suggestedType ?? undefined } as any);

    const createdAt = Date.now();
    const type = stringField(extracted, 'type') ?? 'unknown';
    const subtype = stringField(extracted, 'subtype') ?? 'imported';
    const title = stringField(extracted, 'title') ?? 'Imported item';
    const status = stringField(extracted, 'status') ?? 'needs_attention';
    const priority = stringField(extracted, 'priority') ?? 'normal';
    const nextAction = parsedNextAction(extracted);
    const fields = JSON.stringify(extracted.fields ?? {});
    const why = stringField(extracted, 'why');
    const clarifications = arrayField(extracted, 'clarifications');

    // Upsert by a stable key for the source+subtype combo so repeated
    // ingestion from the same provider does not duplicate objects.
    const searchKey = ` imported/${source}/${subtype} `.toLowerCase();
    const existing = await ctx.db
      .query('lifeObjects')
      .filter(q => q.eq(q.field('ownerId'), ownerId))
      .filter(q => q.eq(q.field('subtype'), subtype))
      .filter(q => q.contains(q.field('source') ?? '', source.toLowerCase()))
      .first();

    let objectId;
    if (existing) {
      await ctx.db.patch(existing._id, {
        title,
        status,
        priority,
        rawText: trimmed(rawText, 8000),
        data: fields,
        nextAction,
        visible: true,
        updatedAt: createdAt,
      });
      objectId = existing._id;
    } else {
      objectId = await ctx.db.insert('lifeObjects', {
        ownerId,
        householdId,
        type,
        subtype,
        title,
        status,
        priority,
        source: source.trim().slice(0, 120),
        rawText: trimmed(rawText, 8000),
        data: fields,
        nextAction,
        visible: true,
        createdAt,
        updatedAt: createdAt,
      });
    }

    // Create an actionable reminder if the object has a suggested next step
    // and a due-by time.
    if (nextAction && nextAction.dueBy && nextAction.kind !== 'none') {
      await ctx.db.insert('reminders', {
        ownerId,
        householdId,
        title: `${title} — ${nextAction.kind}`,
        becauseOf: objectId,
        dueAt: nextAction.dueBy.getTime(),
        status: 'open',
        createdAt,
      });
    }

    return {
      objectId: objectId,
      object: {
        type,
        subtype,
        title,
        status,
        priority,
        why,
        nextAction: nextAction
          ? {
              kind: nextAction.kind,
              status: nextAction.status,
              dueBy: nextAction.dueBy?.toISOString(),
              chargeUntil: nextAction.chargeUntil?.toISOString(),
            }
          : null,
        fields: JSON.parse(fields) as Record<string, unknown>,
        clarifications,
      },
    };
  },
});

function stringField(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function parsedNextAction(obj: Record<string, unknown>) {
  const na = obj.nextAction;
  if (!na || typeof na !== 'object') return undefined;
  const n = na as Record<string, unknown>;
  const kind = stringField(n, 'kind');
  const status = stringField(n, 'status');
  if (!kind || !status) return undefined;
  const dueBy = parseIso(n.dueBy as unknown);
  const chargeUntil = parseIso(n.chargeUntil as unknown);
  return {
    kind,
    status,
    dueBy: dueBy ?? undefined,
    chargeUntil: chargeUntil ?? undefined,
    evidence: stringField(n, 'evidence'),
    meta: stringField(n, 'meta'),
  };
}

function parseIso(value: unknown): Date | null {
  if (!value || typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function arrayField<T>(obj: Record<string, unknown>, key: string): T[] {
  const v = obj[key];
  return Array.isArray(v) ? (v as T[]) : [];
}

function trimmed(value: string, max: number) {
  return value.length > max ? value.slice(0, max) : value;
}
