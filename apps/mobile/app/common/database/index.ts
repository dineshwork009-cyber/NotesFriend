import { database, getFeature, getFeatureLimit } from "@notesfriend/common";
import { logger as dbLogger, ICompressor } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import {
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler
} from "@streetwriters/kysely";
import { Platform } from "react-native";
import * as Gzip from "react-native-gzip";
import EventSource from "../../utils/sse/even-source-ios";
import AndroidEventSource from "../../utils/sse/event-source";
import { FileStorage } from "../filesystem";
import { getDatabaseKey } from "./encryption";
import "./logger";
import { RNSqliteDriver } from "./sqlite.kysely";
import { Storage } from "./storage";
import SettingsService from "../../services/settings";

export async function setupDatabase(password?: string) {
  const key = await getDatabaseKey(password);
  if (!key) throw new Error(strings.databaseSetupFailed());

  // const base = `http://192.168.100.92`;

  // database.host({
  //   API_HOST: `${base}:5264`,
  //   AUTH_HOST: `${base}:8264`,
  //   SSE_HOST: `${base}:7264`,
  //   ISSUES_HOST: `${base}:2624`,
  //   SUBSCRIPTIONS_HOST: `${base}:9264`,
  //   MONOGRAPH_HOST: `${base}:6264`,
  //   NOTESFRIEND_HOST: `${base}:8788`
  // });

  database.host({
    API_HOST: "https://api.notesfriend.com",
    AUTH_HOST: "https://auth.notesfriend.app",
    SSE_HOST: "https://events.notesfriend.app",
    SUBSCRIPTIONS_HOST: "https://subscriptions.notesfriend.app",
    ISSUES_HOST: "https://issues.notesfriend.app",
    MONOGRAPH_HOST: "https://monogr.ph",
    NOTESFRIEND_HOST: "https://notesfriend.com",
    ...(SettingsService.getProperty("serverUrls") || {})
  });

  database.setup({
    storage: Storage,
    eventsource: (Platform.OS === "ios"
      ? EventSource
      : AndroidEventSource) as any,
    fs: FileStorage,
    compressor: async () =>
      ({
        compress: Gzip.deflate,
        decompress: Gzip.inflate
      }) as ICompressor,
    batchSize: 50,
    sqliteOptions: {
      dialect: (name) => ({
        createDriver: () => {
          return new RNSqliteDriver({ async: true, dbName: name });
        },
        createAdapter: () => new SqliteAdapter(),
        createIntrospector: (db) => new SqliteIntrospector(db),
        createQueryCompiler: () => new SqliteQueryCompiler()
      }),
      tempStore: "memory",
      journalMode: Platform.OS === "ios" ? "DELETE" : "WAL",
      password: key
    },
    maxNoteVersions: async () => {
      const limit = await getFeatureLimit(getFeature("maxNoteVersions"));
      return typeof limit.caption === "number" ? limit.caption : undefined;
    }
  });
}

export const db = database;
let DatabaseLogger = dbLogger.scope(Platform.OS);

const setLogger = () => {
  DatabaseLogger = dbLogger.scope(Platform.OS);
};

export { DatabaseLogger, setLogger };
