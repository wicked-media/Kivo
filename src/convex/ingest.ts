import { v } from 'convex/values';
import { mutation, query } from 'convex/server';

export const getInbox = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUser();
    if (!user) return null;

    const profile = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('authEntityId'), user._id))
      .first();

    if (!profile) return null;

    const limit = args.limit ?? 40;
    const objects = await ctx.db
      .query('lifeObjects')
      .filter(q => q.eq(q.field('ownerId'), profile._id))
      .filter(q => q.eq(q.field('visible'), true))
      .orderby('updatedAt', 'desc')
      .take(limit);

    const reminders = await ctx.db
      .query('reminders')
      .filter(q => q.eq(q.field('ownerId'), profile._id))
      .filter(q => q.eq(q.field('status'), 'open'))
      .orderby('dueAt', 'asc')
      .take(20);

    const actions = await ctx.db
      .query('actions')
      .filter(q => q.eq(q.field('ownerId'), profile._id))
      .orderby('createdAt', 'desc')
      .take(25);

    return {
      objects: objects.map(o => ({
        id: o._id.toString(),
        type: o.type,
        subtype: o.subtype,
        title: o.title,
        status: o.status,
        priority: o.priority,
        source: o.source,
        nextAction:
          o.nextAction && typeof o.nextAction === 'object'
            ? {
                kind: (o.nextAction as { kind?: string }).kind ?? 'review',
                status: (o.nextAction as { status?: string }).status ?? 'suggested',
                dueBy: (o.nextAction as { dueBy?: number }).dueBy
                  ? new Date((o.nextAction as { dueBy: number }).dueBy).toISOString()
                  : null,
                chargeUntil: (o.nextAction as { chargeUntil?: number }).chargeUntil
                  ? new Date((o.nextAction as { chargeUntil: number }).chargeUntil).toISOString()
                  : null,
              }
            : null,
        why: o.why ?? null,
      })),
      reminders: reminders.map(r => ({
        id: r._id.toString(),
        title: r.title,
        dueAt: new Date(r.dueAt).toISOString(),
        status: r.status,
        becauseOfId: r.becauseOf?.toString() ?? null,
      })),
      actions: actions.map(a => ({
        id: a._id.toString(),
        kind: a.kind,
        intent: a.intent,
        status: a.status,
        requestedAt: new Date(a.requestedAt).toISOString(),
        decidedAt: a.decidedAt ? new Date(a.decidedAt).toISOString() : null,
        decidedBy: a.decidedBy,
      })),
    };
  },
});

export const approveAction = mutation({
  args: {
    actionId: v.id('actions'),
    outcome: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUser();
    if (!user) throw new Error('Unauthenticated');

    const profile = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('authEntityId'), user._id))
      .first();
    if (!profile) throw new Error('User profile missing');

    const action = await ctx.db.get(args.actionId);
    if (!action || action.ownerId !== profile._id) {
      throw new Error('Action not found');
    }

    await ctx.db.patch(args.actionId, {
      status: 'approved',
      decidedAt: Date.now(),
      decidedBy: 'user',
      outcome: args.outcome ?? action.outcome,
    });

    await ctx.db.insert('actions', {
      ownerId: profile._id,
      householdId: profile.householdId,
      kind: 'approval:' + action.kind,
      intent: action.intent ?? undefined,
      status: 'approved',
      requestedAt: action.requestedAt,
      decidedAt: Date.now(),
      decidedBy: 'user',
      outcome: args.outcome ?? action.outcome,
      createdAt: Date.now(),
    });

    return { status: 'approved' };
  },
});

export const createManualReminder = mutation({
  args: {
    title: v.string(),
    dueAt: v.number(),
    repeatKind: v.optional(v.string()),
    repeatBy: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUser();
    if (!user) throw new Error('Unauthenticated');

    const profile = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('authEntityId'), user._id))
      .first();
    if (!profile) throw new Error('User profile missing');

    const id = await ctx.db.insert('reminders', {
      ownerId: profile._id,
      householdId: profile.householdId,
      title: args.title,
      dueAt: args.dueAt,
      repeatKind: args.repeatKind ?? undefined,
      repeatBy: args.repeatBy ?? undefined,
      status: 'open',
      createdAt: Date.now(),
    });

    return { id: id };
  },
});
