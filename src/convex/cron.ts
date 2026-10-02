import { internal } from './_generated/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const internalAny = internal as any;

// Lightweight scheduled loop that keeps the inbox live between user actions.
// It does not do anything heroic here — the point of Kivo is prove outcomes,
// not to over-automate too early. Right now this seeds reminders and flags
// attention items.

export const scheduled = internalAny.scheduled.query({
  args: {},
  handler: async (ctx: any) => {
    const users = await ctx.db
      .query('users')
      .filter((q: any) => q.exists(q.field('onboardedAt')))
      .collect();

    for (const user of users) {
      try {
        await scanUser(ctx, user);
      } catch (err) {
        console.error('Cron scan failed for user', user._id, err);
      }
    }
  },
});

async function scanUser(
  ctx: Parameters<Parameters<typeof internal.scheduled.query>[1]>[0],
  user: { _id: Parameters<Parameters<typeof internal.scheduled.query>[1]>[0]['db']['query'] extends (_q: infer Q) => infer _ ? never : never }
) {
  // Upcoming due-at reminders that are still open.
  const now = Date.now();
  const upcoming = await ctx.db
    .query('reminders')
    .filter(q => q.eq(q.field('ownerId'), user._id))
    .filter(q => q.eq(q.field('status'), 'open'))
    .filter(q => q.gt(q.field('dueAt'), now - 86400000))
    .filter(q => q.lt(q.field('dueAt'), now + 14 * 86400000))
    .take(50);

  // Anything coming due within 48 hours that has no reminder attached yet.
  const openAttention = await ctx.db
    .query('lifeObjects')
    .filter(q => q.eq(q.field('ownerId'), user._id))
    .filter(q => q.eq(q.field('visible'), true))
    .filter(q => q.eq(q.field('status'), 'needs_attention'))
    .take(200);

  for (const obj of openAttention) {
    const data = safeParse(obj.data ?? '');
    const nextAction = obj.nextAction && typeof obj.nextAction === 'object' ? obj.nextAction as Record<string, unknown> : null;
    const dueBy = nextAction?.dueBy
      ? new Date(nextAction.dueBy as string).getTime()
      : data?.dueDate
        ? new Date(data.dueDate as string).getTime()
        : null;

    if (dueBy && dueBy > now - 86400000 && dueBy < now + 48 * 86400000) {
      const existing = await ctx.db
        .query('reminders')
        .filter(q => q.eq(q.field('ownerId'), user._id))
        .filter(q => q.eq(q.field('title'), obj.title))
        .first();
      if (!existing) {
        await ctx.db.insert('reminders', {
          ownerId: user._id,
          householdId: user.householdId,
          title: `${obj.title} — ${nextAction?.kind ?? 'review'}`,
          becauseOf: obj._id,
          dueAt: dueBy,
          status: 'open',
          createdAt: Date.now(),
        });
      }
    }
  }

  // If nothing is due yet, do not spam the user with more reminders.
  if (upcoming.length === 0 && openAttention.length === 0) {
    return;
  }
}

function safeParse(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
