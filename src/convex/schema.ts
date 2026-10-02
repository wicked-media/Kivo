import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable(
    {
      authEntityId: v.id('authValues'),
      email: v.string(),
      name: v.string(),
      avatarUrl: v.optional(v.string()),
      // MVP: single owner per account. Household expansion lives in the roadmap.
      householdId: v.optional(v.id('households')),
      onboardedAt: v.optional(v.number()),
    }
  ).index('by_authEntityId', ['authEntityId']),
  households: defineTable({
    name: v.string(),
    ownerId: v.id('users'),
    createdAt: v.number(),
  }),
  // The heart of the product: structured life objects, not documents.
  lifeObjects: defineTable(
    {
      ownerId: v.id('users'),
      householdId: v.optional(v.id('households')),
      type: v.string(),
      // Stable slug for the object kind, e.g. "electricity", "registration", "subscription"
      subtype: v.string(),
      title: v.string(),
      status: v.string(),
      priority: v.string(),
      source: v.optional(v.string()),
      rawText: v.optional(v.string()),
      data: v.string(), // JSON string holding the structured fields for this object
      relations: v.optional(
        v.array(
          v.object({
            relation: v.string(),
            objectId: v.id('lifeObjects'),
          })
        )
      ),
      nextAction: v.optional(
        v.object({
          kind: v.string(),
          status: v.string(),
          dueBy: v.optional(v.number()),
          chargeUntil: v.optional(v.number()),
          evidence: v.optional(v.string()),
          meta: v.optional(v.string()),
        })
      ),
      visible: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }
  )
    .index('by_owner', ['ownerId'])
    .index('by_household', ['householdId'])
    .index('by_type_status', ['type', 'status'])
    .index('by_priority', ['priority']),
  providers: defineTable({
    ownerId: v.id('users'),
    name: v.string(),
    category: v.string(),
    slug: v.string(),
    website: v.optional(v.string()),
    knownCharges: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index('by_owner_slug', ['ownerId', 'slug']),
  // Document vault: understand first, store second.
  documents: defineTable({
    ownerId: v.id('users'),
    householdId: v.optional(v.id('households')),
    title: v.string(),
    category: v.string(),
    subtype: v.optional(v.string()),
    storageKey: v.string(),
    mimeType: v.optional(v.string()),
    sizeBytes: v.optional(v.number()),
    extracted: v.optional(v.string()), // JSON snapshot of what Kivo understood
    linkedObjectId: v.optional(v.id('lifeObjects')),
    createdAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_household', ['householdId']),
  // Audit trail for every Kivo action and user approval.
  actions: defineTable({
    ownerId: v.id('users'),
    householdId: v.optional(v.id('households')),
    kind: v.string(),
    intent: v.optional(v.string()),
    status: v.string(),
    requestedAt: v.number(),
    decidedAt: v.optional(v.number()),
    decidedBy: v.optional(v.string()), // "user" | "kivo"
    evidence: v.optional(v.string()),
    outcome: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_household', ['householdId'])
    .index('by_status', ['status']),
  // User preferences for autonomy levels and household rules.
  settings: defineTable({
    ownerId: v.id('users'),
    householdId: v.optional(v.id('households')),
    autonomyLevel: v.string(), // "observe" | "recommend" | "prepare" | "approve" | "autopilot"
    preferredPlanCompare: v.optional(v.string()),
    blockedChargeCategories: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerId']),
  reminders: defineTable({
    ownerId: v.id('users'),
    householdId: v.optional(v.id('households')),
    title: v.string(),
    becauseOf: v.optional(v.id('lifeObjects')),
    dueAt: v.number(),
    repeatKind: v.optional(v.string()),
    repeatBy: v.optional(v.number()),
    status: v.string(),
    createdAt: v.number(),
  })
    .index('by_owner_due', ['ownerId', 'dueAt'])
    .index('by_owner_status', ['ownerId', 'status']),
});

