import { database } from "../database.js";
import {
  TimeFormat,
  formatReminderTime,
  HistorySession,
  Reminder,
  FormatDateOptions,
  formatDate
} from "@notesfriend/core";

export function getFormattedDate(
  date: string | number | Date,
  type: FormatDateOptions["type"] = "date-time"
) {
  return formatDate(date, {
    dateFormat: database.settings?.getDateFormat() as string,
    timeFormat: database.settings?.getTimeFormat() as string,
    type: type
  } as FormatDateOptions);
}

export function getFormattedReminderTime(reminder: Reminder, short = false) {
  return formatReminderTime(reminder, short, {
    dateFormat: database.settings?.getDateFormat() as string,
    timeFormat: database.settings?.getTimeFormat() as TimeFormat
  });
}

export function getFormattedHistorySessionDate(session: HistorySession) {
  const fromDate = getFormattedDate(session.dateCreated, "date");
  const toDate = getFormattedDate(session.dateModified, "date");
  const fromTime = getFormattedDate(session.dateCreated, "time");
  const toTime = getFormattedDate(session.dateModified, "time");
  return `${fromDate}, ${fromTime} — ${
    fromDate !== toDate ? `${toDate}, ` : ""
  }${toTime}`;
}

export { formatDate };
