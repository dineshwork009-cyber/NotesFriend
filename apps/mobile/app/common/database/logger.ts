import { initialize } from "@notesfriend/core";
import {
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler
} from "@streetwriters/kysely";
import { Platform } from "react-native";
import { setLogger } from ".";
import { RNSqliteDriver } from "./sqlite.kysely";

let loggerLoaded = false;
const initializeLogger = async () => {
  if (loggerLoaded) return;
  await initialize({
    dialect: (name) => ({
      createDriver: () => {
        return new RNSqliteDriver({ async: true, dbName: name });
      },
      createAdapter: () => new SqliteAdapter(),
      createIntrospector: (db) => new SqliteIntrospector(db),
      createQueryCompiler: () => new SqliteQueryCompiler()
    }),
    tempStore: "memory",
    journalMode: Platform.OS === "ios" ? "DELETE" : "WAL"
  });
  setLogger();
  loggerLoaded = true;
};

export { initializeLogger };
