import { SQLite } from "@notesfriend/desktop";
import { expose } from "comlink";

export type SQLiteWorker = typeof SQLite.prototype;
const db = new SQLite();
expose(db);
