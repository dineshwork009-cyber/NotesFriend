import { useEffect, useState } from "react";
import { Opts, TDate, format, register } from "timeago.js";
const shortLocale: [string, string][] = [
  ["now", "now"],
  ["%ss", "in %ss"],
  ["1m", "in 1m"],
  ["%sm", "in %sm"],
  ["1h", "in 1h"],
  ["%sh", "in %sh"],
  ["1d", "in 1d"],
  ["%sd", "in %sd"],
  ["1w", "in 1w"],
  ["%sw", "in %sw"],
  ["1mo", "in 1mo"],
  ["%smo", "in %smo"],
  ["1yr", "in 1yr"],
  ["%syr", "in %syr"]
];

const enShortLocale: [string, string][] = [
  ["now", "now"],
  ["%ss ago", "in %ss"],
  ["1m ago", "in 1m"],
  ["%sm ago", "in %sm"],
  ["1h ago", "in 1h"],
  ["%sh ago", "in %sh"],
  ["1d ago", "in 1d"],
  ["%sd ago", "in %sd"],
  ["1w ago", "in 1w"],
  ["%sw ago", "in %sw"],
  ["1mo ago", "in 1mo"],
  ["%smo ago", "in %smo"],
  ["1yr ago", "in 1yr"],
  ["%syr ago", "in %syr"]
];
register("short", (_n, index) => shortLocale[index]);
register("en_short", (_n, index) => enShortLocale[index]);

export function getTimeAgo(datetime: TDate, locale = "short", opts?: Opts) {
  return format(datetime, locale, opts);
}

type TimeAgoOptions = {
  locale?: "short" | "en_short";
  live?: boolean;
  interval?: number;
  onUpdate?: (timeAgo: string) => void;
};

export function useTimeAgo(
  datetime: TDate,
  { locale = "short", live = true, interval = 60000, onUpdate }: TimeAgoOptions
) {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(datetime, locale));

  useEffect(() => {
    if (!live) return;
    const value = getTimeAgo(datetime, locale);
    onUpdate?.(value);
    setTimeAgo(value);

    const reset = setInterval(() => {
      const value = getTimeAgo(datetime, locale);
      onUpdate?.(value);
      setTimeAgo(value);
    }, interval);
    return () => {
      clearInterval(reset);
    };
  }, [datetime, interval, locale, live, onUpdate]);

  return timeAgo;
}
