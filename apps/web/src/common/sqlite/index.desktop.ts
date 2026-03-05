import {
  Dialect,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  DatabaseConnection,
  QueryResult,
  CompiledQuery,
  Driver
} from "@streetwriters/kysely";
import { desktop } from "../desktop-bridge";
import Worker from "./sqlite.worker.desktop.ts?worker";
import type { SQLiteWorker } from "./sqlite.worker.desktop";
import { wrap, Remote } from "comlink";
import { Mutex } from "async-mutex";
import { DialectOptions } from ".";

class SqliteDriver implements Driver {
  connection?: DatabaseConnection;
  private connectionMutex = new Mutex();
  worker: Remote<SQLiteWorker> = wrap<SQLiteWorker>(new Worker());
  constructor(private readonly config: { name: string }) {}

  async init(): Promise<void> {
    const path = await desktop!.integration.resolvePath.query({
      filePath: `userData/${this.config.name}.sql`
    });
    await this.worker.open(path);
    this.connection = new SqliteWorkerConnection(this.worker);
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    if (!this.connection) throw new Error("Driver not initialized.");

    // SQLite only has one single connection. We use a mutex here to wait
    // until the single connection has been released.
    await this.connectionMutex.waitForUnlock();
    await this.connectionMutex.acquire();
    return this.connection;
  }

  async beginTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }

  async releaseConnection(): Promise<void> {
    this.connectionMutex.release();
  }

  async destroy(): Promise<void> {
    await this.worker.close();
  }

  async delete() {
    const path = await desktop!.integration.resolvePath.query({
      filePath: `userData/${this.config.name}.sql`
    });
    await this.worker.delete(path);
  }
}

class SqliteWorkerConnection implements DatabaseConnection {
  constructor(private readonly worker: Remote<SQLiteWorker>) {}

  streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("wasqlite driver doesn't support streaming");
  }

  async executeQuery<R>(
    compiledQuery: CompiledQuery<unknown>
  ): Promise<QueryResult<R>> {
    const { parameters, sql } = compiledQuery;
    return this.worker.run(sql, parameters as any) as unknown as QueryResult<R>;
  }
}

export const createDialect = (options: DialectOptions): Dialect => {
  return {
    createDriver: () =>
      new SqliteDriver({
        name: options.name
      }),
    createAdapter: () => new SqliteAdapter(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler()
  };
};
