// Placeholder mirror of src/convex/schema.ts table shapes so that the app
// can typecheck independently of running `convex dev --once`.
//
// Once Convex codegen is available, replace this file with the real
// src/convex/_generated/dataModel.d.ts. Do not hand-edit the generated file
// when it exists.

export type TableNames = 'users' | 'households' | 'lifeObjects' | 'providers' | 'documents' | 'actions' | 'settings' | 'reminders';

export type RawDocumentNames<T extends Record<string, unknown>> = T;

export declare type Id<T extends TableNames> = { _collection: T; _key: string };

export declare type DataModel = {
  users: {
    authEntityId: Id<'authValues'>;
    email: string;
    name: string;
    avatarUrl?: string;
    householdId?: Id<'households'>;
    onboardedAt?: number;
  };
  households: {
    name: string;
    ownerId: Id<'users'>;
    createdAt: number;
  };
  lifeObjects: {
    ownerId: Id<'users'>;
    householdId?: Id<'households'>;
    type: string;
    subtype: string;
    title: string;
    status: string;
    priority: string;
    source?: string;
    rawText?: string;
    data?: string;
    relations?: Array<{ relation: string; objectId: Id<'lifeObjects'> }>;
    nextAction?: {
      kind: string;
      status: string;
      dueBy?: number;
      chargeUntil?: number;
      evidence?: string;
      meta?: string;
    };
    visible: boolean;
    createdAt: number;
    updatedAt: number;
  };
  providers: {
    ownerId: Id<'users'>;
    name: string;
    category: string;
    slug: string;
    website?: string;
    knownCharges?: string[];
    createdAt: number;
  };
  documents: {
    ownerId: Id<'users'>;
    householdId?: Id<'households'>;
    title: string;
    category: string;
    subtype?: string;
    storageKey: string;
    mimeType?: string;
    sizeBytes?: number;
    extracted?: string;
    linkedObjectId?: Id<'lifeObjects'>;
    createdAt: number;
  };
  actions: {
    ownerId: Id<'users'>;
    householdId?: Id<'households'>;
    kind: string;
    intent?: string;
    status: string;
    requestedAt: number;
    decidedAt?: number;
    decidedBy?: string;
    evidence?: string;
    outcome?: string;
    createdAt: number;
  };
  settings: {
    ownerId: Id<'users'>;
    householdId?: Id<'households'>;
    autonomyLevel: string;
    preferredPlanCompare?: string;
    blockedChargeCategories?: string[];
    createdAt: number;
    updatedAt: number;
  };
  reminders: {
    ownerId: Id<'users'>;
    householdId?: Id<'households'>;
    title: string;
    becauseOf?: Id<'lifeObjects'>;
    dueAt: number;
    repeatKind?: string;
    repeatBy?: number;
    status: string;
    createdAt: number;
  };
  authValues: {
    tokenIdentifier: string;
    imageUrl?: string;
  };
};

declare module 'convex/values' {
  export interface v {
    id: <K extends TableNames>(table: K) => (value: Id<K>) => unknown;
    optional: <T>(validator: (value: unknown) => unknown) => (value: unknown) => unknown;
    string: (value: unknown) => unknown;
    number: (value: unknown) => unknown;
    boolean: (value: unknown) => unknown;
    literal: <T extends string>(value: T) => (value: unknown) => unknown;
    array: <T>(validator: (value: unknown) => unknown) => (value: unknown) => unknown;
    record: <T>(validator: (value: unknown) => unknown) => (value: unknown) => unknown;
    object: <T extends Record<string, (value: unknown) => unknown>>(fields: T) => (value: unknown) => unknown;
    any: (value: unknown) => unknown;
    null: (value: unknown) => unknown;
    union: <T extends Array<(value: unknown) => unknown>>(...validators: T) => (value: unknown) => unknown;
    bool: (value: unknown) => unknown;
    int: (value: unknown) => unknown;
    float: (value: unknown) => unknown;
    index: (value: unknown) => unknown;
  }
}
