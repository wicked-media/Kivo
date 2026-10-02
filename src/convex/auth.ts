import type { Id } from './_generated/dataModel';
import { v } from 'convex/values';
import { mutation, query } from 'convex/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mutationAny = mutation as any;
const queryAny = query as any;

// Lightweight account bootstrap on top of Convex Auth.
// The real auth login lives in convex/auth, but we want a user profile
// row the product can actually drive against.

export const ensureUser = mutationAny({
  args: {
    authEntityId: v.id('authValues'),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('authEntityId'), args.authEntityId))
      .first();

    if (existing) {
      // Keep name in sync in case it changes after auth.
      if (args.name && existing.name !== args.name) {
        await ctx.db.patch(existing._id, { name: args.name });
      }
      return existing._id as Id<'users'>;
    }

    let name = args.name;
    if (!name) {
      const local = args.email.split('@')[0] || '';
      name = local.charAt(0).toUpperCase() + local.slice(1);
    }

    const userId = await ctx.db.insert('users', {
      authEntityId: args.authEntityId,
      email: args.email,
      name,
      onboardedAt: Date.now(),
    }) as Id<'users'>;

    // Bootstrap the default household and settings for a new account.
    const householdId = await ctx.db.insert('households', {
      name: `${name}'s household`,
      ownerId: userId,
      createdAt: Date.now(),
    }) as Id<'households'>;

    await ctx.db.insert('settings', {
      ownerId: userId,
      householdId,
      autonomyLevel: 'recommend',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(userId, {
      householdId,
      onboardedAt: Date.now(),
    });

    return userId;
  },
});

export const getUser = queryAny({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUser();
    if (!user) return null;

    const profile = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('authEntityId'), user._id))
      .first();

    if (!profile) return null;

    return {
      id: profile._id as Id<'users'>,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      householdId: profile.householdId,
    };
  },
});

export const getMe = queryAny({
  args: {},
  handler: async (ctx) => {
    const profile = await getUser(ctx);
    if (!profile) return null;

    const settings = await ctx.db
      .query('settings')
      .filter(q => q.eq(q.field('ownerId'), profile.id))
      .first();

    const recentObjects = await ctx.db
      .query('lifeObjects')
      .filter(q => q.eq(q.field('ownerId'), profile.id))
      .filter(q => q.eq(q.field('visible'), true))
      .orderby('updatedAt', 'desc')
      .take(12);

    const actions = await ctx.db
      .query('actions')
      .filter(q => q.eq(q.field('ownerId'), profile.id))
      .orderby('createdAt', 'desc')
      .take(6);

    const summary = {
      subscriptions: 0,
      bills: 0,
      warranties: 0,
      appointments: 0,
      priceIncreases: 0,
      attention: 0,
    };

    for (const obj of recentObjects) {
      const d = parseData(obj);
      if (d?.subtype === 'subscription') summary.subscriptions += 1;
      if (d?.type === 'bill') summary.bills += 1;
      if (d?.subtype === 'warranty') summary.warranties += 1;
      if (d?.type === 'appointment') summary.appointments += 1;
      if (d?.type === 'price_movement') summary.priceIncreases += 1;
      if (d?.status === 'needs_attention') summary.attention += 1;
    }

    return {
      ...profile,
      autonomyLevel: settings?.autonomyLevel ?? 'recommend',
      stats: summary,
      recentObjects: recentObjects.map(normalizeObject),
      recentActions: actions.map(a => ({
        id: a._id as Id<'actions'>,
        kind: a.kind,
        intent: a.intent,
        status: a.status,
        createdAt: a.createdAt,
      })),
    };
  },
});

function parseData(obj: { data?: string }) {
  if (!obj.data) return null;
  try {
    return JSON.parse(obj.data);
  } catch {
    return null;
  }
}

function normalizeObject(obj: {
  _id: Id<'lifeObjects'>;
  type: string;
  subtype: string;
  title: string;
  status: string;
  priority: string;
  nextAction?: unknown;
  why?: string;
}) {
  return {
    id: obj._id,
    type: obj.type,
    subtype: obj.subtype,
    title: obj.title,
    status: obj.status,
    priority: obj.priority,
    nextAction:
      obj.nextAction && typeof obj.nextAction === 'object'
        ? {
            kind: (obj.nextAction as { kind?: string }).kind ?? 'review',
            status: (obj.nextAction as { status?: string }).status ?? 'suggested',
            dueBy:
              (obj.nextAction as { dueBy?: string }).dueBy ??
              null,
            chargeUntil:
              (obj.nextAction as { chargeUntil?: string }).chargeUntil ??
              null,
          }
        : null,
    why: obj.why ?? null,
  };
}
