import { TimeFormat, DayFormat } from "../types.js";
import { formatDate } from "./date.js";

export const NEWLINE_STRIP_REGEX = /[\r\n\t\v]+/gm;
export const HEADLINE_REGEX = /\$headline\$/g;

const DATE_REGEX = /\$date\$/g;
const COUNT_REGEX = /\$count\$/g;
const TIME_REGEX = /\$time\$/g;
const DAY_REGEX = /\$day\$/g;
const TIMESTAMP_REGEX = /\$timestamp\$/g;
const TIMESTAMP_Z_REGEX = /\$timestampz\$/g;
const DATE_TIME_STRIP_REGEX = /[\\\-:./, ]/g;

export function formatTitle(
  titleFormat: string,
  dateFormat: string,
  timeFormat: TimeFormat,
  dayFormat: DayFormat,
  headline = "",
  totalNotes = 0
) {
  const date = formatDate(Date.now(), {
    dateFormat,
    type: "date"
  });

  const time = formatDate(Date.now(), {
    timeFormat,
    type: "time"
  });
  const timezone = formatDate(Date.now(), {
    type: "timezone"
  });
  const day = formatDate(Date.now(), {
    dayFormat,
    type: "day"
  });

  const timestamp = `${date}${time}`.replace(DATE_TIME_STRIP_REGEX, "");
  const timestampWithTimeZone = `${timestamp}${timezone}`;

  return titleFormat
    .replace(NEWLINE_STRIP_REGEX, " ")
    .replace(DATE_REGEX, date)
    .replace(TIME_REGEX, time)
    .replace(DAY_REGEX, day)
    .replace(HEADLINE_REGEX, headline || "")
    .replace(TIMESTAMP_REGEX, timestamp)
    .replace(TIMESTAMP_Z_REGEX, timestampWithTimeZone)
    .replace(COUNT_REGEX, `${totalNotes + 1}`);
}
