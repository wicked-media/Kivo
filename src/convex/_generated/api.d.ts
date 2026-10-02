// Placeholder mirror of Convex API types so the app can typecheck
// independently of running `convex dev --once`.
//
// Once Convex codegen is available, replace this file with the real
// src/convex/_generated/api.d.ts. Do not hand-edit the generated file
// when it exists.

declare module 'convex/api' {
  export type api = {
    email: {
      extractLifeObject: any;
      explainLifeObject: any;
      askKivo: any;
      comparePlans: any;
      understandDocument: any;
      introSummary: any;
    };
    ingest: {
      getInbox: any;
      approveAction: any;
      createManualReminder: any;
    };
    auth: {
      ensureUser: any;
      getUser: any;
      getMe: any;
    };
  };
}
