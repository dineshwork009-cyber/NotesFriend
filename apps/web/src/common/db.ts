import { EventSourcePolyfill as EventSource } from "event-source-polyfill";
import { DatabasePersistence, NNStorage } from "../interfaces/storage";
import { logger } from "../utils/logger";
import {
  database,
  getFeature,
  getFeatureLimit,
  isFeatureAvailable
} from "@notesfriend/common";
import { createDialect } from "./sqlite";
import { isFeatureSupported } from "../utils/feature-check";
import { generatePassword } from "../utils/password-generator";
import { deriveKey, useKeyStore } from "../interfaces/key-store";
import {
  logManager,
  SubscriptionPlan,
  SubscriptionStatus
} from "@notesfriend/core";
import Config from "../utils/config";
import { FileStorage } from "../interfaces/fs";

const db = database;
async function initializeDatabase(persistence: DatabasePersistence) {
  performance.mark("start:initializeDatabase");

  let databaseKey = await useKeyStore.getState().getValue("databaseKey");
  if (!databaseKey) {
    databaseKey = await deriveKey(generatePassword());
    await useKeyStore.getState().setValue("databaseKey", databaseKey);
  }

  db.host({
    API_HOST: "https://api.notesfriend.com",
    AUTH_HOST: "https://auth.notesfriend.app",
    SSE_HOST: "https://events.notesfriend.app",
    ISSUES_HOST: "https://issues.notesfriend.app",
    SUBSCRIPTIONS_HOST: "https://subscriptions.notesfriend.app",
    MONOGRAPH_HOST: "https://monogr.ph",
    NOTESFRIEND_HOST: "https://notesfriend.com",
    ...Config.get("serverUrls", {})
  });

  const storage = new NNStorage(
    "Notesfriend",
    () => useKeyStore.getState(),
    persistence
  );
  await storage.migrate();

  const multiTab = !!globalThis.SharedWorker && isFeatureSupported("opfs");
  database.setup({
    sqliteOptions: {
      dialect: (name, init) =>
        createDialect({
          name: persistence === "memory" ? ":memory:" : name,
          encrypted: true,
          async: !isFeatureSupported("opfs"),
          init,
          multiTab
        }),
      ...(IS_DESKTOP_APP || isFeatureSupported("opfs")
        ? { journalMode: "WAL", lockingMode: "exclusive" }
        : {
            journalMode: "MEMORY",
            lockingMode: "normal"
          }),
      tempStore: "memory",
      synchronous: "normal",
      pageSize: 8192,
      cacheSize: -32000,
      password: Buffer.from(databaseKey).toString("hex"),
      skipInitialization: !IS_DESKTOP_APP && multiTab
    },
    storage: storage,
    eventsource: EventSource,
    fs: FileStorage,
    compressor: () =>
      import("../utils/compressor").then(({ Compressor }) => new Compressor()),
    maxNoteVersions: async () => {
      const limit = await getFeatureLimit(getFeature("maxNoteVersions"));
      return typeof limit.caption === "number" ? limit.caption : undefined;
    },
    batchSize: 100
  });

  // if (IS_TESTING) {

  // } else {
  // db.host({
  //   API_HOST: "http://localhost:5264",
  //   AUTH_HOST: "http://localhost:8264",
  //   SSE_HOST: "http://localhost:7264",
  // });
  // const base = `http://localhost`;
  // db.host({
  //   API_HOST: `${base}:5264`,
  //   AUTH_HOST: `${base}:8264`,
  //   SSE_HOST: `${base}:7264`,
  //   ISSUES_HOST: `${base}:2624`,
  //   SUBSCRIPTIONS_HOST: `${base}:9264`
  // });
  // }

  performance.mark("start:initdb");
  await db.init();
  performance.mark("end:initdb");

  window.addEventListener("beforeunload", async () => {
    if (IS_DESKTOP_APP) {
      await db.sql().destroy();
      await logManager?.close();
    }
  });

  if (db.migrations?.required()) {
    await import("../dialogs/migration-dialog").then(({ MigrationDialog }) =>
      MigrationDialog.show({})
    );
  }

  performance.mark("end:initializeDatabase");

  if (IS_TESTING && "isPro" in window) {
    await db.user.setUser({
      // @ts-expect-error just for testing purposes
      subscription: {
        plan: SubscriptionPlan.PRO,
        status: SubscriptionStatus.ACTIVE
      }
    });
  }

  return db;
}

export { db, initializeDatabase };
