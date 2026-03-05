export type TitleCase<
  T extends string,
  D extends string = " "
> = string extends T
  ? never
  : T extends `${infer F}${D}${infer R}`
  ? `${Capitalize<F>}${D}${TitleCase<R, D>}`
  : Capitalize<T>;

type Separator = " " | "-" | "_";

export type CamelCase<T extends string> =
  T extends `${Separator}${infer Suffix}`
    ? CamelCase<Suffix>
    : T extends `${infer Prefix}${Separator}`
    ? CamelCase<Prefix>
    : T extends `${infer Prefix}${Separator}${infer Suffix}`
    ? CamelCase<`${Prefix}${Capitalize<Suffix>}`>
    : T;

type KebabCaseHelper<
  S,
  Acc extends string = ""
> = S extends `${infer C}${infer T}`
  ? KebabCaseHelper<
      T extends Uncapitalize<T> ? T : Uncapitalize<T>,
      `${Acc}${Lowercase<C>}${T extends Uncapitalize<T> ? "" : "-"}`
    >
  : Acc;

export type KebabCase<S extends string> = KebabCaseHelper<S>;

const SingularPluralPairs = {
  note: "notes",
  notebook: "notebooks",
  topic: "topics",
  attachment: "attachments",
  reminder: "reminders",
  file: "files",
  tag: "tags",
  item: "items"
};

export function pluralize(
  count: number | null | undefined | false,
  key: keyof typeof SingularPluralPairs
): string {
  return !count || count > 1
    ? `${count} ${SingularPluralPairs[key]}`
    : `${count} ${key}`;
}

export function toTitleCase<T extends string>(str: T): TitleCase<T> | "" {
  if (!str || !str[0]) {
    return "";
  }
  return (str[0].toUpperCase() + str.substring(1)) as TitleCase<T>;
}

export function toCamelCase<T extends string>(str: T): CamelCase<T> {
  return str.replace(/-(.{1})/gm, (_str, letter) => {
    return letter.toUpperCase();
  }) as CamelCase<T>;
}
