import { Kysely, sql } from "@streetwriters/kysely";
import { RawDatabaseSchema } from "./index.js";

export async function rebuildSearchIndex(db: Kysely<RawDatabaseSchema>) {
  await db.transaction().execute(async (tx) => {
    for (const query of [
      sql`INSERT INTO content_fts(content_fts) VALUES('delete-all')`,
      sql`INSERT INTO notes_fts(notes_fts) VALUES('delete-all')`
    ]) {
      await query.execute(tx);
    }

    await tx
      .insertInto("content_fts")
      .columns(["rowid", "id", "data", "noteId"])
      .expression((eb) =>
        eb
          .selectFrom("content")
          .where((eb) =>
            eb.and([
              eb("noteId", "is not", null),
              eb("data", "is not", null),
              eb("deleted", "is not", true)
            ])
          )
          .select([
            "rowid",
            "id",
            sql`IIF(locked == 1, '', data)`.as("data"),
            "noteId"
          ])
      )
      .execute();

    await tx
      .insertInto("notes_fts")
      .columns(["rowid", "id", "title"])
      .expression((eb) =>
        eb
          .selectFrom("notes")
          .where((eb) =>
            eb.and([eb("title", "is not", null), eb("deleted", "is not", true)])
          )
          .select(["rowid", "id", "title"])
      )
      .execute();

    for (const query of [
      sql`INSERT INTO content_fts(content_fts) VALUES('optimize')`,
      sql`INSERT INTO notes_fts(notes_fts) VALUES('optimize')`
    ]) {
      await query.execute(tx);
    }
  });
}
