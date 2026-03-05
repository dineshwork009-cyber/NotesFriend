export type Notebook = {
  title: string;
  description?: string;
  subNotebooks?: Notebook[];
};

export type Item = {
  title: string;
};

export type Color = {
  title: string;
  color: string;
};

export type PriceItem = { label: string; value: string };

export type OrderByOptions = "asc" | "desc";
export type SortByOptions =
  | "dateCreated"
  | "dateEdited"
  | "dateModified"
  | "dateDeleted"
  | "title";
export type GroupByOptions =
  | "abc"
  | "none"
  | "default"
  | "year"
  | "month"
  | "week";

export type SortOptions = {
  groupBy?: GroupByOptions;
  sortBy: SortByOptions;
  orderBy: OrderByOptions;
};
