import {
  SqliteAdapter,
  SqliteQueryCompiler,
  SqliteIntrospector,
  Dialect
} from "@streetwriters/kysely";
import {
  WaSqliteWorkerMultipleTabDriver,
  WaSqliteWorkerSingleTabDriver
} from "./wa-sqlite-kysely-driver";

declare module "@streetwriters/kysely" {
  interface Driver {
    delete(): Promise<void>;
  }
}

export type DialectOptions = {
  name: string;
  encrypted: boolean;
  async: boolean;
  multiTab: boolean;
  init?: () => Promise<void>;
};
export const createDialect = (options: DialectOptions): Dialect => {
  const { async, encrypted, multiTab, name, init } = options;
  return {
    createDriver: () =>
      multiTab
        ? new WaSqliteWorkerMultipleTabDriver({
            async,
            dbName: name,
            encrypted,
            init
          })
        : new WaSqliteWorkerSingleTabDriver({
            async,
            dbName: name,
            encrypted
          }),
    createAdapter: () => new SqliteAdapter(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler()
  };
};
