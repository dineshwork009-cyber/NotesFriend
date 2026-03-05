import { FetchOptions } from "./fetch.js";

export type ClipArea = "full-page" | "visible" | "selection" | "article";
export type ClipMode = "simplified" | "screenshot" | "complete";
// | "full"
// | "article"
// | "simple-article"
// | "full-screenshot"
// | "screenshot"
// | "manual";

export type ClipData = string;

export type Filter = (node: HTMLElement) => boolean;

export type InlineOptions = {
  stylesheets?: boolean;
  fonts?: boolean;
  images?: boolean;
  inlineImages?: boolean;
};

export type Options = {
  filter?: Filter;
  backgroundColor?: CSSStyleDeclaration["backgroundColor"];
  width?: number;
  height?: number;
  quality?: number;
  raster?: boolean;
  scale?: number;
  fetchOptions?: FetchOptions;
  inlineOptions?: InlineOptions;
};

export type Config = {
  corsProxy?: string;
  images?: boolean;
  inlineImages?: boolean;
  styles?: boolean;
};
