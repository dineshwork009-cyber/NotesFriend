import { initTRPC } from "@trpc/server";
import { compressionRouter } from "./compression";
import { osIntegrationRouter } from "./os-integration";
import { spellCheckerRouter } from "./spell-checker";
import { updaterRouter } from "./updater";
import { bridgeRouter } from "./bridge";
import { safeStorageRouter } from "./safe-storage";
import { windowRouter } from "./window";

const t = initTRPC.create();

export const router = t.router({
  compress: compressionRouter,
  integration: osIntegrationRouter,
  spellChecker: spellCheckerRouter,
  updater: updaterRouter,
  bridge: bridgeRouter,
  safeStorage: safeStorageRouter,
  window: windowRouter
});

export const api = router.createCaller({});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof router;
