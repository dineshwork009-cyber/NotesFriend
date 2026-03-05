import { Node, mergeAttributes } from "@tiptap/core";
import { hasSameAttributes } from "../../utils/prosemirror.js";
import { WebClipAttachment, getDataAttribute } from "../attachment/index.js";
import { createNodeView } from "../react/index.js";
import { WebClipComponent } from "./component.js";

export interface WebClipOptions {
  HTMLAttributes: Record<string, unknown>;
}

export type WebClipAttributes = WebClipAttachment & {
  fullscreen: boolean;
};

export const WebClipNode = Node.create<WebClipOptions>({
  name: "webclip",
  content: "",
  marks: "",
  draggable: true,
  priority: 51,

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  group() {
    return "block";
  },

  addAttributes() {
    return {
      type: { default: "web-clip", rendered: false },
      progress: {
        default: 0,
        rendered: false
      },
      fullscreen: {
        rendered: false,
        default: false
      },
      src: {
        default: null
      },
      title: {
        default: null
      },
      width: {
        default: null
      },
      height: {
        default: null
      },
      hash: getDataAttribute("hash"),
      mime: getDataAttribute("mime")
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe[data-hash]"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ];
  },

  addNodeView() {
    return createNodeView(WebClipComponent, {
      shouldUpdate: (prev, next) => !hasSameAttributes(prev.attrs, next.attrs),
      forceEnableSelection: true
    });
  }
});
