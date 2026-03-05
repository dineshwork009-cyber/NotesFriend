import { Editor, getAttributes } from "@tiptap/core";
import { MarkType } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";

type ClickHandlerOptions = {
  type: MarkType;
  editor: Editor;
};

export function clickHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey("handleClickLink"),
    props: {
      handleDOMEvents: {
        click: (view, event) => {
          const isMainClick = event.button === 0;
          const isAuxClick = event.button === 1;
          if (!isMainClick && !isAuxClick) {
            return false;
          }

          let a = event.target as HTMLElement;
          const els = [];

          while (a.nodeName !== "DIV") {
            els.push(a);
            a = a.parentNode as HTMLElement;
          }

          if (!els.find((value) => value.nodeName === "A")) {
            return false;
          }

          const attrs = getAttributes(view.state, options.type.name);
          const link = event.target as HTMLLinkElement;

          const href = link?.href ?? attrs.href;
          // const target = link?.target ?? attrs.target;

          if (link && href) {
            if (options.editor.storage.openLink) {
              event.preventDefault();
              setTimeout(() =>
                options.editor.storage.openLink?.(
                  href,
                  isAuxClick || event.ctrlKey || event.metaKey
                )
              );
            }

            return true;
          }

          return false;
        }
      }
    }
  });
}
