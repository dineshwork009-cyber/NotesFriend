import { FloatingMenuProps } from "./types.js";
import { SearchReplacePopup } from "../popups/search-replace.js";
import { ResponsivePresenter } from "../../components/responsive/index.js";
import { getToolbarElement } from "../utils/dom.js";
import { useEditorSearchStore } from "../stores/search-store.js";

export function SearchReplaceFloatingMenu(props: FloatingMenuProps) {
  const { editor } = props;
  const isSearching = useEditorSearchStore((store) => store.isSearching);

  return (
    <ResponsivePresenter
      mobile="sheet"
      desktop="popup"
      scope="dialog"
      isOpen={isSearching}
      onClose={() => editor.commands.endSearch()}
      position={{
        target: getToolbarElement(),
        isTargetAbsolute: true,
        location: "below",
        align: "end",
        yOffset: 5
      }}
      blocking={false}
      focusOnRender={false}
      draggable={false}
    >
      <SearchReplacePopup editor={editor} />
    </ResponsivePresenter>
  );
}
