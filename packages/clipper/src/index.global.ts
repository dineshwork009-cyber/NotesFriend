import { clipArticle, clipPage } from "./index.js";

declare global {
  // eslint-disable-next-line no-var
  var Clipper: {
    clipArticle: typeof clipArticle;
    clipPage: typeof clipPage;
  };
}

globalThis.Clipper = {
  clipArticle,
  clipPage
};
