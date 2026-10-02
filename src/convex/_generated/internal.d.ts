// Placeholder mirror of Convex internal types so the app can typecheck
// independently of running `convex dev --once`.
//
// Once Convex codegen is available, replace this file with the real
// src/convex/_generated/internal.d.ts. Do not hand-edit the generated file
// when it exists.

declare module 'convex/internal' {
  export type internal = {
    action: any;
    mutation: any;
    query: any;
    scheduled: {
      query: any;
    };
  };
}
