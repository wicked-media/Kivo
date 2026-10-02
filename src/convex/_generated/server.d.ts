// Placeholder mirror of Convex server context/types so the app can typecheck
// independently of running `convex dev --once`.
//
// Once Convex codegen is available, replace this file with the real
// src/convex/_generated/server.d.ts. Do not hand-edit the generated file
// when it exists.
import type { DataModel } from './dataModel';

export type contextProto = {
  db: {
    get: <K extends keyof DataModel>(id: Parameters<DataModel[K]['ownerId'] extends infer T ? T : never>[0]) => Promise<DataModel[K] | null>;
    insert: <K extends keyof DataModel>(doc: DataModel[K]) => Promise<{ _id: unknown }>;
    patch: <K extends keyof DataModel>(id: Parameters<DataModel[K]['ownerId'] extends infer T ? T : never>[0], patch: Partial<DataModel[K]>) => Promise<void>;
    query: <K extends keyof DataModel>(table: K) => {
      filter: <T>(filterBuilder: (q: unknown) => unknown) => {
        first: () => Promise<DataModel[K] | null>;
        collect: () => Promise<DataModel[K]>;
        take: (n: number) => Promise<DataModel[K]>;
        orderby: (field: keyof DataModel[K], direction?: 'asc' | 'desc') => unknown;
      };
    };
  };
  auth: {
    getUser: () => Promise<{ _id: unknown; identifier: string } | null>;
  };
};

declare module 'convex/server' {
  export interface defineSchemaOptions {}
  export type defineSchemaReturn = DataModel;
  export type defineTableReturn<T> = T;

  export function defineSchema<T extends DataModel>(tables: Record<string, any>): T;
  export function defineTable<T>(fields: T): T;
  export type ServerContext = contextProto;
  export type MutationHandler = (ctx: contextProto, args: any) => Promise<any>;
  export type QueryHandler = (ctx: contextProto, args: any) => Promise<any>;
  export type ActionHandler = (ctx: contextProto, args: any) => Promise<any>;

  export const mutation: <TArgs, TReturn>(config: {
    args: any;
    handler: MutationHandler;
  }) => any;

  export const query: <TArgs, TReturn>(config: {
    args?: any;
    handler: QueryHandler;
  }) => any;

  export const internal: {
    mutation: typeof mutation;
    action: typeof mutation;
    query: typeof query;
    scheduled: {
      query: typeof query;
    };
  };

  export const api: {
    action: any;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ensureUser: any;
  export const getUser: any;
  export const getMe: any;
  export const extractLifeObject: any;
  export const explainLifeObject: any;
  export const askKivo: any;
  export const comparePlans: any;
  export const understandDocument: any;
  export const introSummary: any;
  export const getInbox: any;
  export const approveAction: any;
  export const createManualReminder: any;
}
