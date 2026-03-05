import { DesktopOnly } from "../../components/responsive/index.js";
import { HoverPopupHandler } from "./hover-popup/index.js";
import { SearchReplaceFloatingMenu } from "./search-replace.js";
import { FloatingMenuProps } from "./types.js";

export function EditorFloatingMenus(props: FloatingMenuProps) {
  return (
    <>
      <SearchReplaceFloatingMenu {...props} />

      <DesktopOnly>
        <HoverPopupHandler {...props} />
      </DesktopOnly>
    </>
  );
}
