import { RouteContainerButtons } from "../components/route-container";

export type RouteResult = {
  key: string;
  type:
    | "notes"
    | "notebook"
    | "notebooks"
    | "reminders"
    | "trash"
    | "tags"
    | "notFound";
  title?: string | (() => Promise<string | undefined>);
  component:
    | ((props?: any) => JSX.Element | null)
    | React.ReactNode
    | React.MemoExoticComponent<React.FunctionComponent>;
  props?: any;
  buttons?: RouteContainerButtons;
  noCache?: boolean;
};

export function isRouteResult(obj: any): obj is RouteResult {
  return (
    !!obj &&
    typeof obj === "object" &&
    "key" in obj &&
    "type" in obj &&
    "component" in obj
  );
}

type IsParameter<Part> = Part extends `:${infer Parameter}?`
  ? Parameter
  : Part extends `:${infer Parameter}`
  ? Parameter
  : never;

type FilteredParts<Path> = Path extends `${infer PartA}/${infer PartB}`
  ? IsParameter<PartA> | FilteredParts<PartB>
  : IsParameter<Path>;

type ReplaceParameter<Part> = Part extends `:${string}` ? string : Part;

export type ReplaceParametersInPath<Path> =
  Path extends `${infer PartA}/${infer PartB}`
    ? `${ReplaceParameter<PartA>}/${ReplaceParametersInPath<PartB>}`
    : ReplaceParameter<Path>;

export type Params<Path> = {
  [Key in FilteredParts<Path>]: string;
};

export type Routes<T extends string> = {
  [Path in T]: (params: Params<Path>) => Promise<RouteResult> | RouteResult;
};

export type HashRoutes<T extends string> = {
  [Path in T]: (params: Params<Path>) => void;
};

export function defineRoutes<T extends string>(routes: Routes<T>): Routes<T> {
  return routes;
}

export function defineHashRoutes<T extends string>(
  routes: HashRoutes<T>
): HashRoutes<T> {
  return routes;
}
