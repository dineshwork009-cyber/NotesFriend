import { tinyToTiptap } from "../migrations.js";
import { makeSessionContentId } from "../utils/id.js";
import { ICollection } from "./collection.js";
import { isCipher } from "../utils/crypto.js";
import Database from "../api/index.js";
import { NoteContent, SessionContentItem, isDeleted } from "../types.js";
import { SQLCollection } from "../database/sql-collection.js";

export class SessionContent implements ICollection {
  name = "sessioncontent";
  readonly collection: SQLCollection<"sessioncontent", SessionContentItem>;
  constructor(private readonly db: Database) {
    this.collection = new SQLCollection(
      db.sql,
      db.transaction,
      "sessioncontent",
      db.eventManager,
      db.sanitizer
    );
  }

  async init() {
    await this.collection.init();
  }

  async add<TLocked extends boolean>(
    sessionId: string,
    content: Partial<NoteContent<TLocked>> & { title?: string; noteId: string },
    locked?: TLocked
  ) {
    if (!sessionId || !content) return;
    // const data =
    //   locked || isCipher(content.data)
    //     ? content.data
    //     :  await this.db.compressor().compress(content.data);
    const sessionContentItemId = makeSessionContentId(sessionId);
    const sessionContentExists = await this.collection.exists(
      sessionContentItemId
    );
    const sessionItem: Partial<SessionContentItem> = {
      type: "sessioncontent",
      id: sessionContentItemId,
      compressed: false,
      localOnly: true,
      locked: locked || false,
      dateCreated: Date.now(),
      dateModified: Date.now()
    };

    if (content.data && content.type) {
      sessionItem.data = content.data;
      sessionItem.contentType = content.type;

      if (typeof content.title !== "string" && !sessionContentExists) {
        const note = await this.db.notes.note(content.noteId);
        sessionItem.title = note?.title;
      }
    }

    if (content.title) {
      sessionItem.title = content.title;

      if (!content.data && !content.type && !sessionContentExists) {
        const note = await this.db.notes.note(content.noteId);
        if (note?.contentId) {
          const noteContent = await this.db.content.get(note?.contentId);
          if (noteContent) {
            sessionItem.data = noteContent?.data;
            sessionItem.contentType = noteContent?.type;
          }
        }
      }
    }

    if (sessionContentExists) {
      this.collection.update([sessionContentItemId], sessionItem);
    } else {
      await this.collection.upsert(sessionItem as SessionContentItem);
    }
  }

  async get(
    sessionContentId: string
  ): Promise<Partial<NoteContent<boolean> & { title: string }> | undefined> {
    const session = await this.collection.get(sessionContentId);
    if (!session || isDeleted(session)) return;

    const compressor = await this.db.compressor();
    if (
      session.contentType === "tiny" &&
      session.compressed &&
      !session.locked &&
      !isCipher(session.data)
    ) {
      session.data = await compressor.compress(
        tinyToTiptap(await compressor.decompress(session.data))
      );
      session.contentType = "tiptap";
      await this.collection.upsert(session);
    }

    return {
      data:
        session.compressed && !isCipher(session.data)
          ? await compressor.decompress(session.data)
          : session.data,
      type: session.contentType,
      title: session.title
    };
  }

  async remove(sessionContentId: string) {
    await this.collection.delete([sessionContentId]);
  }

  // async all() {
  //   const indices = this.collection.indexer.indices;
  //   const items = await this.collection.getItems(indices);

  //   return Object.values(items);
  // }
}
