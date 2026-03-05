import dayjs from "dayjs";
import { db } from "../common/db";
import { getTimeFormat } from "@notesfriend/core";

export function setTimeOnly(str: string, date: dayjs.Dayjs) {
  const value = dayjs(str, getTimeFormat(db.settings.getTimeFormat()), true);
  return date.hour(value.hour()).minute(value.minute());
}

export function setDateOnly(str: string, date: dayjs.Dayjs) {
  const value = dayjs(str, db.settings.getDateFormat(), true);
  return date.year(value.year()).month(value.month()).date(value.date());
}
